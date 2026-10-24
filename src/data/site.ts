/**
 * General information about the temple.
 *
 * **The content does not live here**: it lives in `content/*.json`, which is what the
 * admin panel (Decap CMS, at `/admin`) edits. This file only reads it and gives it
 * types, so the components receive objects with a stable shape.
 *
 * If you edit by hand, do it in `content/site.json`.
 */
import type { IconName } from "../components/ui";
import siteJson from "../../content/site.json";

/**
 * If someone has the panel open with an older version of the config and saves, the
 * file comes out WITHOUT the keys added later: the panel writes the fields its tab
 * knows about, not the ones on disk. That must not break the build over an optional
 * field, so keys that may be missing are declared optional and read as an empty value.
 */
const raw = siteJson as Omit<typeof siteJson, "portadaFotos"> & {
  portadaFotos?: { foto: string; texto?: string }[];
  youtube?: string;
  tiktok?: string;
};

export const site = {
  brand: raw.marca,
  brandLine1: raw.marcaLinea1,
  brandLine2: raw.marcaLinea2,
  city: raw.ciudad,
  motto: raw.lema,
  verse: { text: raw.versiculoTexto, reference: raw.versiculoCita },
};

/** Hero carousel slides. Empty = a composed wine gradient is shown instead. */
export const heroSlides = (raw.portadaFotos ?? [])
  .filter((s) => s.foto)
  .map((s) => ({ photo: s.foto, caption: s.texto ?? "" }));

/**
 * Turns whatever is pasted into the map field into a link that can be embedded.
 *
 * Google offers the **share** link first, and that one can't be embedded: it's refused
 * inside an iframe ("refused to connect"). The embed link is more hidden (Share → Embed
 * a map), so any of the usual forms is accepted here and translated:
 *
 *  - an embed link, as is;
 *  - the long URL from the address bar, from which the coordinates are extracted;
 *  - bare coordinates, "11.977989, -86.0876864";
 *  - anything else is treated as an address and searched for.
 *
 * The exception is short links (maps.app.goo.gl): only Google's server knows where
 * they point and the browser can't resolve them, so they are discarded and the
 * placeholder is shown, which explains what to paste.
 */
function toMapEmbedUrl(value: string): string {
  const v = value.trim();
  if (!v) return "";

  const embed = (query: string) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=17&hl=es&output=embed`;

  if (v.includes("/maps/embed") || v.includes("output=embed")) return v;
  if (/(maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(v)) return "";

  if (/^https?:\/\//i.test(v)) {
    // !3d/!4d are the place's coordinates; @lat,lng is the map center, used as a fallback.
    const place = v.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
    const center = v.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    const c = place ?? center;
    return c ? embed(`${c[1]},${c[2]}`) : "";
  }

  return embed(v);
}

/** True when a value is still a "[...]" placeholder and must not become a link. */
export const isPlaceholder = (v: string) => !v || v.trim().startsWith("[");

export const contact = {
  phone: raw.telefono,
  /** With country code, as it should be displayed. E.g. "+505 88887777". The links
   *  (wa.me, tel:) strip everything but the digits. */
  whatsapp: raw.whatsapp,
  address: raw.direccion,
  officeHours: raw.horarioAtencion,
  /** Already converted to an embeddable link. Empty = the placeholder is shown. */
  mapEmbedUrl: toMapEmbedUrl(raw.mapaEmbedUrl),
  /** The pin's own Google Maps page, for the "Cómo llegar" button. */
  mapDirectionsUrl: raw.mapaEmbedUrl.startsWith("http") && !raw.mapaEmbedUrl.includes("embed") ? raw.mapaEmbedUrl : "",
  /**
   * Only the ones with a link are shown; the rest are hidden entirely.
   *
   * `background` is each network's official color, and it's a CSS value rather than a
   * Tailwind class because Instagram's is a five-stop gradient. The glyph always goes
   * in white on top, which is how each brand asks to be used.
   */
  socials: [
    { name: "Facebook", icon: "facebook", url: raw.facebook, background: "#1877F2" },
    {
      name: "Instagram", icon: "instagram", url: raw.instagram,
      background: "linear-gradient(45deg,#FEDA75 5%,#FA7E1E 28%,#D62976 55%,#962FBF 78%,#4F5BD5 100%)",
    },
    { name: "YouTube", icon: "youtube", url: raw.youtube ?? "", background: "#FF0000" },
    { name: "TikTok", icon: "tiktok", url: raw.tiktok ?? "", background: "#010101" },
  ] as { name: string; icon: IconName; url: string; background: string }[],
};

export const whatsappUrl = isPlaceholder(contact.whatsapp)
  ? ""
  : `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;

/** The CMS stores a single text; double line breaks separate paragraphs. */
export const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

export const community = {
  title: raw.comunidadTitulo,
  paragraphs: paragraphs(raw.comunidadTexto),
  photo: raw.comunidadFoto,
};


/**
 * Navigation bar sections (the id must exist on the page). The ids are the URL
 * anchors visitors see, so they stay in Spanish.
 */
export const navigation = [
  { id: "nosotros", label: "Nosotros" },
  { id: "sacerdotes", label: "Sacerdotes" },
  { id: "horarios", label: "Horarios" },
  { id: "devociones", label: "Devociones" },
  { id: "grupos", label: "Grupos" },
  { id: "sacramentos", label: "Sacramentos" },
  { id: "avisos", label: "Avisos" },
  { id: "galeria", label: "Galería" },
  { id: "contacto", label: "Contacto" },
];
