
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@14.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verificar usuário autenticado
    const supabaseClient = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY') || '')
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('User not authenticated')
    }

    const { pedidoId } = await req.json()

    // Buscar pedido no banco (corrigir relacionamento para perfis_consumidores)
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos')
      .select(`
        *,
        filial:filiais(*),
        consumidor:perfis_consumidores(*),
        itens:itens_pedido(*, produto:produtos(*))
      `)
      .eq('id', pedidoId)
      .single()

    if (pedidoError || !pedido) {
      throw new Error('Pedido não encontrado')
    }

    // Verificar se o pedido pertence ao usuário, usando perfis_consumidores.user_id
    if (!pedido.consumidor || pedido.consumidor.user_id !== user.id) {
      throw new Error('Acesso negado')
    }

    // Verificar se já existe um customer no Stripe
    const customers = await stripe.customers.list({
      email: user.email!,
      limit: 1
    })

    let customerId = null
    if (customers.data.length > 0) {
      customerId = customers.data[0].id
    } else {
      // Criar novo customer
      const customer = await stripe.customers.create({
        email: user.email!,
        name: pedido.consumidor.nome
      })
      customerId = customer.id
    }

    // Criar sessão de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: pedido.itens.map((item: any) => ({
        price_data: {
          currency: 'brl',
          product_data: {
            name: item.produto.nome,
            description: item.produto.descricao,
            // Corrige para enviar um array de imagens, se houver
            images: Array.isArray(item.produto.imagem_url) ? item.produto.imagem_url : []
          },
          unit_amount: Math.round(item.preco_unitario_na_compra * 100) // Stripe usa centavos
        },
        quantity: item.quantidade
      })),
      // Frete só se for maior que zero
      shipping_cost: pedido.frete > 0 ? {
        amount_total: Math.round(pedido.frete * 100)
      } : undefined,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      metadata: {
        pedido_id: pedido.id
      }
    })

    // Atualizar pedido com session_id
    await supabase
      .from('pedidos')
      .update({ 
        stripe_payment_intent_id: session.id,
        status: 'aguardando_pagamento'
      })
      .eq('id', pedido.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Erro na criação do pagamento:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
