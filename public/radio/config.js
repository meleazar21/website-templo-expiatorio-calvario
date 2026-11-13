/**
 * RADIO LA VOZ DEL CALVARIO — configuración pública, versión 5.
 *
 * Diferenciar:
 *   - streamUrl: URL CONFIRMADA por la parroquia para escuchar.
 *   - mountPoint: ID que se observa en Broadcast Settings del encoder.
 *   - metadataUrl: SSE oficial de Zeno.FM sobre ese mount (primera opción).
 *   - metadataFallbackUrl: alternativa con ID del stream de escucha.
 *
 * No almacenar contraseñas de emisión, claves de encoder o credenciales.
 */
window.RADIO_CONFIG = Object.freeze({
  name: "Radio La Voz del Calvario",
  subtitle: "Templo Expiatorio Arquidiocesano · Parroquia El Calvario, Masaya",
  streamUrl: "https://stream.zeno.fm/xtwg2arx6hhvv",
  mountPoint: "g8nayarx6hhvv",
  metadataUrl: "https://api.zeno.fm/mounts/metadata/subscribe/g8nayarx6hhvv",
  metadataFallbackUrl: "https://api.zeno.fm/mounts/metadata/subscribe/xtwg2arx6hhvv",
  websiteUrl: "https://www.templo-expiatorio-calvario.com/",
  facebookUrl: "https://www.facebook.com/ParroquiaElCalvarioMasaya/",
  instagramUrl: "https://www.instagram.com/parroquiaelcalvariomasaya?igsh=YWg1c3pxOW1reXhm",
  tiktokUrl: "https://www.tiktok.com/@temploexpiatoriocalvario?_r=1&_t=ZM-921aURTQYl1",
  whatsappUrl: "+50583525200",
  logoUrl: "https://www.templo-expiatorio-calvario.com/logo.webp"
});
