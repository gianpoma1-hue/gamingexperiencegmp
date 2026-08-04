// Envía un mensaje de WhatsApp al admin usando CallMeBot
// (https://www.callmebot.com/blog/free-api-whatsapp-messages/).
//
// Cómo conseguir el teléfono y la apikey:
// 1. Agendá el número +34 644 59 71 67 en tu WhatsApp.
// 2. Mandale el mensaje: "I allow callmebot to send me messages"
// 3. Te va a responder con tu apikey personal.
//
// TODO: reemplazar por tu número (con código de país, sin +) y tu apikey real.
const WHATSAPP_ADMIN_TELEFONO = "TU-NUMERO-ACA";
const WHATSAPP_ADMIN_APIKEY = "TU-APIKEY-ACA";

export async function avisarWhatsAppAdmin(mensaje: string) {
  // Si todavía no se configuró el teléfono/apikey, no rompemos nada,
  // simplemente no mandamos el mensaje.
  if (
    WHATSAPP_ADMIN_TELEFONO === "TU-NUMERO-ACA" ||
    WHATSAPP_ADMIN_APIKEY === "TU-APIKEY-ACA"
  ) {
    return;
  }

  try {
    const url =
      `https://api.callmebot.com/whatsapp.php?phone=${WHATSAPP_ADMIN_TELEFONO}` +
      `&text=${encodeURIComponent(mensaje)}` +
      `&apikey=${WHATSAPP_ADMIN_APIKEY}`;

    await fetch(url);
  } catch (err) {
    // Si falla el envío del WhatsApp no queremos romper el flujo
    // principal (la inscripción/notificación en la web ya se guardó).
    console.error("No se pudo enviar el WhatsApp al admin:", err);
  }
}
