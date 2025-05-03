
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.4.0";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// Crear un cliente Supabase con la service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Función para generar un código OTP aleatorio de 6 dígitos
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

serve(async (req) => {
  // Manejar solicitudes preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const body = await req.json();
    const { email, action } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Se requiere un correo electrónico" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Si la acción es verificar OTP
    if (action === "verify") {
      const { code } = body;
      
      if (!code) {
        return new Response(
          JSON.stringify({ error: "Se requiere un código OTP" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Consultar la base de datos para verificar el código
      const { data, error } = await supabase
        .from("otp_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, error: "Código OTP inválido o expirado" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 400,
          }
        );
      }

      // Marcar el código como verificado
      const { error: updateError } = await supabase
        .from("otp_codes")
        .update({ verified: true })
        .eq("id", data.id);

      if (updateError) {
        return new Response(
          JSON.stringify({ success: false, error: "Error al verificar el código" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    // Si la acción es enviar OTP
    const otp = generateOTP();
    
    // Verificar si el usuario ya está registrado
    const { data: existingUser, count } = await supabase
      .from("profiles")
      .select("*", { count: 'exact' })
      .eq("email", email)
      .limit(1);
    
    // Si estamos en el flujo de registro y el usuario ya existe
    if (action !== "login" && count && count > 0) {
      return new Response(
        JSON.stringify({ error: "Este email ya está registrado", code: "EMAIL_EXISTS" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Si estamos en el flujo de login y el usuario no existe
    if (action === "login" && (!count || count === 0)) {
      return new Response(
        JSON.stringify({ error: "Este email no está registrado", code: "EMAIL_NOT_FOUND" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Guardar el OTP en la base de datos
    const { error: dbError } = await supabase
      .from("otp_codes")
      .insert({
        email,
        code: otp,
      });

    if (dbError) {
      return new Response(
        JSON.stringify({ error: "Error al generar el código de verificación" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Enviar el correo con el código OTP
    try {
      // Usar el dominio verificado vyba.app como remitente en lugar del dominio por defecto
      const emailResponse = await resend.emails.send({
        from: "VYBA <noreply@vyba.app>",
        to: [email],
        subject: "Tu código de verificación para Vyba",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px;">
              <img src="https://zkucuolpubthcnsgjtso.supabase.co/storage/v1/object/public/vyba-assets/logo.png" alt="Vyba Logo" style="max-width: 150px;" />
            </div>
            <h1 style="color: #333; font-size: 24px; text-align: center;">Tu código de verificación</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Hola,</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Recibimos una solicitud para verificar tu dirección de correo electrónico. Utiliza el siguiente código para completar la verificación:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0; border-radius: 5px;">
              <p style="font-size: 32px; letter-spacing: 5px; font-weight: bold; color: #333; margin: 0;">${otp}</p>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Este código es válido por 10 minutos.</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #999; font-size: 12px;">
              <p>&copy; ${new Date().getFullYear()} Vyba. Todos los derechos reservados.</p>
            </div>
          </div>
        `,
      });

      return new Response(
        JSON.stringify({ success: true, message: "Código enviado correctamente" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (emailError: any) {
      console.error("Error al enviar el correo:", emailError);
      return new Response(
        JSON.stringify({ error: "Error al enviar el correo de verificación", details: emailError.message }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
  } catch (error: any) {
    console.error("Error en la función Edge:", error);
    return new Response(
      JSON.stringify({ error: "Error en el servidor", details: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
