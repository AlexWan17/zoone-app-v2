
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@14.21.0"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')
    
    if (!signature) {
      return new Response('Missing stripe signature', { status: 400 })
    }

    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!endpointSecret) {
      return new Response('Missing webhook secret', { status: 500 })
    }

    // Verificar assinatura do webhook
    const event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    
    console.log('Webhook event type:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const pedidoId = session.metadata?.pedido_id
        
        if (!pedidoId) {
          console.error('pedido_id não encontrado nos metadados')
          break
        }

        // Atualizar status do pedido para pago
        const { error: updateError } = await supabase
          .from('pedidos')
          .update({ 
            status: 'pago',
            atualizado_em: new Date().toISOString()
          })
          .eq('id', pedidoId)

        if (updateError) {
          console.error('Erro ao atualizar pedido:', updateError)
          break
        }

        // Buscar itens do pedido para decrementar estoque
        const { data: pedido, error: pedidoError } = await supabase
          .from('pedidos')
          .select('*, itens:itens_pedido(*)')
          .eq('id', pedidoId)
          .single()

        if (pedidoError || !pedido) {
          console.error('Erro ao buscar pedido:', pedidoError)
          break
        }

        // Decrementar estoque para cada item
        for (const item of pedido.itens) {
          try {
            await supabase.rpc('decrementar_estoque', {
              produto_id_param: item.produto_id,
              filial_id_param: pedido.filial_id,
              quantidade_param: item.quantidade
            })
          } catch (error) {
            console.error('Erro ao decrementar estoque:', error)
          }
        }

        console.log(`Pedido ${pedidoId} processado com sucesso`)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        const pedidoId = session.metadata?.pedido_id
        
        if (pedidoId) {
          await supabase
            .from('pedidos')
            .update({ 
              status: 'cancelado',
              atualizado_em: new Date().toISOString()
            })
            .eq('id', pedidoId)
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (err) {
    console.error('Webhook error:', err)
    return new Response(`Webhook error: ${err.message}`, { status: 400 })
  }
})
