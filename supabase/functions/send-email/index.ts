
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
  type: 'purchase_confirmation' | 'new_order_notification';
  data?: any;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, subject, html, type, data }: EmailRequest = await req.json();

    let emailContent = html;

    // Templates específicos por tipo
    if (type === 'purchase_confirmation') {
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Confirmação de Compra - Zoone.AI</h1>
          <p>Olá ${data?.customerName || 'Cliente'},</p>
          <p>Sua compra foi realizada com sucesso!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalhes do Pedido:</h3>
            <p><strong>Pedido:</strong> #${data?.orderId || 'N/A'}</p>
            <p><strong>Total:</strong> ${data?.total || 'N/A'}</p>
            <p><strong>Loja:</strong> ${data?.storeName || 'N/A'}</p>
            <p><strong>Endereço de Entrega:</strong> ${data?.deliveryAddress || 'Retirada na loja'}</p>
          </div>
          
          <p>Acompanhe o status do seu pedido em nossa plataforma.</p>
          <p>Obrigado por escolher a Zoone.AI!</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Este é um e-mail automático. Por favor, não responda.
          </p>
        </div>
      `;
    } else if (type === 'new_order_notification') {
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Novo Pedido Recebido - Zoone.AI</h1>
          <p>Olá ${data?.storeName || 'Lojista'},</p>
          <p>Você recebeu um novo pedido!</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Detalhes do Pedido:</h3>
            <p><strong>Pedido:</strong> #${data?.orderId || 'N/A'}</p>
            <p><strong>Cliente:</strong> ${data?.customerName || 'N/A'}</p>
            <p><strong>Total:</strong> ${data?.total || 'N/A'}</p>
            <p><strong>Filial:</strong> ${data?.branchName || 'N/A'}</p>
            <p><strong>Tipo de Entrega:</strong> ${data?.deliveryType || 'N/A'}</p>
          </div>
          
          <p>Acesse o painel do lojista para gerenciar este pedido.</p>
          <p>Equipe Zoone.AI</p>
          
          <hr style="margin: 30px 0;">
          <p style="font-size: 12px; color: #666;">
            Este é um e-mail automático. Por favor, não responda.
          </p>
        </div>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Zoone.AI <noreply@zoone.ai>",
      to: [to],
      subject: subject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
