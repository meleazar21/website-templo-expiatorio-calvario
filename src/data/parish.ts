/**
 * Schedules, priests, parish groups, sacraments, announcements and gallery.
 *
 * **The content does not live here**: it lives in `content/`, which is what the admin
 * panel (Decap CMS, at `/admin`) edits. Each item in a collection is its own JSON file,
 * so the CMS can add and delete items without touching the others.
 * This file only loads them, sorts them and gives them types.
 *
 * Field names mirror the JSON keys in `content/`, so they stay in Spanish.
 */
import type { IconName } from "../components/ui";
import schedulesRaw from "../../content/horarios.json";
import devotionsRaw from "../../content/devociones.json";
import companyRaw from "../../content/compania.json";

/** A single string inside a list; the CMS cannot store lists of plain strings. */
interface Line { texto: string }
const toLines = (xs: Line[] | undefined): string[] => (xs ?? []).map((x) => x.texto);

/**
 * Loads every JSON file in a folder and sorts them by their `orden` field.
 * `import.meta.glob` resolves them at build time, so there are no network requests:
 * everything ends up inside the static bundle.
 */
function loadCollection<T extends { orden?: number }>(mods: Record<string, unknown>): T[] {
  return Object.keys(mods)
    .sort()
    .map((k) => (mods[k] as { default: T }).default)
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0));
}

// ---------------------------------------------------------------- Schedules
export interface ScheduleRow { dia: string; hora: string; nota?: string }

/** Masses, confessions and spiritual direction: the three things people look up. */
export const schedules: { key: string; title: string; icon: IconName; rows: ScheduleRow[] }[] = [
  { key: "misas", title: "Santa Misa", icon: "chalice", rows: schedulesRaw.misas ?? [] },
  { key: "confesiones", title: "Confesiones", icon: "heart", rows: schedulesRaw.confesiones ?? [] },
  { key: "direccion", title: "Dirección espiritual", icon: "book", rows: schedulesRaw.direccionEspiritual ?? [] },
];

/** Perpetual adoration: the temple is open day and night. Empty title = no notice. */
export const perpetualAdoration = {
  title: (schedulesRaw as { adoracionTitulo?: string }).adoracionTitulo ?? "",
  text: (schedulesRaw as { adoracionTexto?: string }).adoracionTexto ?? "",
};

/** Masses at the Capilla Espíritu Santo, which belongs to the temple. */
export const chapelMasses: ScheduleRow[] = schedulesRaw.capillaEspirituSanto ?? [];

// ---------------------------------------------------------------- Priests
export interface Priest {
  orden?: number;
  nombre: string;
  /** "Párroco", "Vicario"... */
  cargo: string;
  /** Photo path. Empty = a "photo to be defined" placeholder is drawn. */
  foto?: string;
  biografia: string;
  /** "pastor" = shown alone under "Nuestro Pastor" (the archbishop); anything else, or
   *  empty, = under "Nuestros Sacerdotes". */
  seccion?: "pastor" | "sacerdote";
}
export const priests = loadCollection<Priest>(
  import.meta.glob("../../content/sacerdotes/*.json", { eager: true })
);

// ---------------------------------------------------------------- Seminarians
export interface Seminarian {
  orden?: number;
  nombre: string;
  /** Photo path. Empty = a "photo to be defined" placeholder is drawn. */
  foto?: string;
  /** More photos of him; shown as thumbnails under the main one. */
  fotos?: string[];
  /** Priesthood (seminarians), consecrated life, or monastic life (cloistered orders). */
  vocacion?: "sacerdocio" | "consagrada" | "monastica";
  /** Replaces the status tag when it doesn't fit, e.g. "En el Monasterio del Carmelo Descalzo". */
  etiqueta?: string;
  /** "actual": doing pastoral work with us now; "anterior": did it in the past. */
  estado: "actual" | "anterior";
  /** Optional line: seminary, stage of formation... */
  detalle?: string;
}
export const seminarians = loadCollection<Seminarian>(
  import.meta.glob("../../content/seminaristas/*.json", { eager: true })
);

// ---------------------------------------------------------------- Parish groups
export interface Group {
  nombre: string;
  /** Group logo or poster. Empty (and no photos) = the card shows the default icon. */
  imagen?: string;
  /** Photos of the group; they follow the logo in the card's carousel. */
  fotos?: string[];
  descripcion: string;
  /** When they meet. */
  encuentros: string;
  /** Optional link to the group's own site or page (e.g. the catechesis website). */
  enlace?: string;
  /** Optional link to the group's Facebook page. */
  facebook?: string;
  /** Optional link to the group's Instagram profile. */
  instagram?: string;
  /** Optional link to the group's YouTube channel or a video. */
  youtube?: string;
  /** Optional link to the group's TikTok profile. */
  tiktok?: string;
}
/** Alphabetical by name, so a new group from the panel falls into place on its own. */
export const groups = Object.values(
  import.meta.glob<{ default: Group }>("../../content/grupos/*.json", { eager: true })
).map((m) => m.default).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

// ---------------------------------------------------------------- Sacraments
export interface Sacrament {
  orden?: number;
  nombre: string;
  icono: IconName;
  descripcion: string;
  requisitos: string[];
  nota?: string;
  /** Optional page with the detailed requirements and sign-up (e.g. the catechesis site). */
  enlace?: string;
  /** The button's label; says where it goes. */
  enlaceTexto?: string;
}
interface SacramentRaw extends Omit<Sacrament, "requisitos"> { requisitos?: Line[] }

export const sacraments: Sacrament[] = loadCollection<SacramentRaw>(
  import.meta.glob("../../content/sacramentos/*.json", { eager: true })
).map((s) => ({ ...s, requisitos: toLines(s.requisitos) }));

// ---------------------------------------------------------------- Announcements
/** Values stored in the content files, and shown as-is on the page. */
export type Category = "AVISOS" | "LITURGIA" | "SACRAMENTOS" | "ACTIVIDADES" | "FESTIVIDADES";

export interface Announcement {
  orden?: number;
  fecha: string;
  titulo: string;
  categoria: Category;
  descripcion: string;
  /** Optional poster or photo, shown whole above the text. */
  imagen?: string;
  /** Featured announcements get a gold border. */
  destacado?: boolean;
}
export const announcements = loadCollection<Announcement>(
  import.meta.glob("../../content/avisos/*.json", { eager: true })
);

// ---------------------------------------------------------------- Gallery
export interface GalleryPhoto {
  orden?: number;
  titulo: string;
  /** Image path. Empty = a "photo to be defined" placeholder is drawn. */
  foto?: string;
}
export const gallery = loadCollection<GalleryPhoto>(
  import.meta.glob("../../content/galeria/*.json", { eager: true })
);

// ---------------------------------------------------------------- Devotions

export interface Devotion {
  /** "Primer jueves de cada mes", "Todos los lunes"... */
  cuando: string;
  hora?: string;
  titulo: string;
  descripcion: string;
  icono: IconName;
}

/** A day of the Rosary: its time and a note ("Antes de la Misa…"). */
export interface RosaryDay { dia: string; hora: string; nota?: string }

/** The daily Rosary, the intentions it's prayed for, and the acts of reparation. */
export const devotions = {
  intro: devotionsRaw.intro ?? "",
  rosary: (devotionsRaw.rosario ?? []) as RosaryDay[],
  rosaryReason: devotionsRaw.rosarioMotivo ?? "",
  rosaryIntentions: toLines(devotionsRaw.rosarioIntenciones),
  items: (devotionsRaw.devociones ?? []) as Devotion[],
};

// ---------------------------------------------------------------- Compañía de Jesús Nazareno

/** The devotees and promesantes of Jesús Nazareno: not a group, so not a group card. */
export const nazarenoCompany = {
  eyebrow: companyRaw.antetitulo ?? "",
  title: companyRaw.titulo ?? "",
  text: companyRaw.texto ?? "",
  motto: companyRaw.lema ?? "",
  photos: (companyRaw.fotos ?? []).filter((f) => f.foto) as { foto: string; texto?: string }[],
};
