import { useEffect, useRef, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ Icons
 * Custom SVG strokes: no icon library and no emojis (the design rules them out).
 */
export type IconName =
  | "flame" | "book" | "calendar" | "clock" | "pin" | "phone"
  | "mail" | "chat" | "check" | "arrow" | "menu" | "close" | "chevron" | "image" | "globe"
  // Sacraments
  | "water" | "chalice" | "rings" | "heart" | "oil" | "cross"
  // Devotions
  | "sacredHeart" | "candle" | "moon"
  // Social networks
  | "facebook" | "instagram" | "youtube" | "tiktok";

const PATHS: Record<IconName, ReactNode> = {
  /* A flame with three short rays below it. Also used for Confirmation: the tongues
     of fire of Pentecost. */
  flame: <><path d="M12 2.6s4.6 4 4.6 8a4.6 4.6 0 1 1-9.2 0c0-1.4.6-2.5 1.2-3.4.3 1.1 1.1 1.8 1.9 1.8C10.7 9 9.6 6 12 2.6z" /><path d="M12 17.2v4.2M8.2 17.4l-1.4 3.4M15.8 17.4l1.4 3.4" /></>,
  book: <><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v15H5.5A1.5 1.5 0 0 0 4 20.5z" /><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v15h5.5a1.5 1.5 0 0 1 1.5 1.5z" /></>,
  calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" /></>,
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
  pin: <><path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z" /><circle cx="12" cy="10.5" r="2.4" /></>,
  phone: <path d="M6 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5.5 5.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2C10.6 18.4 5.6 13.4 4 6.7A2 2 0 0 1 6 3.5z" />,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="m3.6 7 8.4 6 8.4-6" /></>,
  chat: <path d="M4 5.5h16v10H9l-5 4z" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrow: <path d="M4.5 12h14m-5-5 5 5-5 5" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  chevron: <path d="m8 10 4 4 4-4" />,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c2.3 2.4 3.4 5.2 3.4 8.5s-1.1 6.1-3.4 8.5c-2.3-2.4-3.4-5.2-3.4-8.5s1.1-6.1 3.4-8.5z" /></>,
  image: <><rect x="3.5" y="5" width="17" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m4.5 17 4.5-4 3.5 3 3-2.5 4 3.5" /></>,

  /* Baptism: water falling over the font. */
  water: <>
    <path d="M12 3.2c2.3 2.7 3.5 4.6 3.5 6a3.5 3.5 0 0 1-7 0c0-1.4 1.2-3.3 3.5-6z" />
    <path d="M3.6 16.4q2.1-1.7 4.2 0t4.2 0 4.2 0 4.2 0" />
    <path d="M3.6 19.8q2.1-1.7 4.2 0t4.2 0 4.2 0 4.2 0" />
  </>,
  /* Eucharist: the chalice and the host. */
  chalice: <>
    <circle cx="12" cy="3.9" r="2.1" />
    <path d="M12 3.2v1.4M11.3 3.9h1.4" />
    <path d="M5.9 8.9h12.2c0 3.6-2.7 6.2-6.1 6.2S5.9 12.5 5.9 8.9z" />
    <path d="M12 15.1v3.6M7.9 20.6h8.2" />
  </>,
  /* Marriage: the two interlocked wedding rings. */
  rings: <>
    <circle cx="9" cy="14.4" r="5.1" />
    <circle cx="15" cy="14.4" r="5.1" />
    <path d="M12 2.4v3.4M10.3 4.1h3.4" />
  </>,
  /* Reconciliation: mercy, not sin — a heart with the cross. */
  heart: <>
    <path d="M12 20.6s-7.4-4.6-7.4-9.6a4.2 4.2 0 0 1 7.4-2.7 4.2 4.2 0 0 1 7.4 2.7c0 5-7.4 9.6-7.4 9.6z" />
    <path d="M12 9.8v5.4M9.5 12.1h5" />
  </>,
  /* Anointing of the sick: the vial of holy oil. */
  oil: <>
    <path d="M9.8 2.8h4.4v2.4l1.6 2.2v11a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2v-11l1.6-2.2z" />
    <path d="M8.2 11.6h7.6M12 14.2v3.4M10.3 15.9h3.4" />
  </>,
  cross: <path d="M12 2.8v18.4M6.6 8.2h10.8" />,

  /* Devotions. The Sacred Heart: the heart crowned by the cross, with the band of
     thorns across it. */
  sacredHeart: <>
    <path d="M12 21.2s-7-4.3-7-9a3.9 3.9 0 0 1 7-2.4 3.9 3.9 0 0 1 7 2.4c0 4.7-7 9-7 9z" />
    <path d="M12 2.6v5M10.1 4.6h3.8M7.6 13.4c2.9 1.1 5.9 1.1 8.8 0" />
  </>,
  /* A votive candle, for the faithful departed. */
  candle: <>
    <path d="M9 10.5h6v10H9zM12 10.5V8.6" />
    <path d="M12 3.2s2 1.9 2 3.2a2 2 0 0 1-4 0c0-1.3 2-3.2 2-3.2z" />
  </>,
  /* The night vigil: a crescent moon and a star. */
  moon: <>
    <path d="M19.4 14.6A7.9 7.9 0 1 1 9.4 4.6a6.4 6.4 0 0 0 10 10z" />
    <path d="M17.2 3.6v3M15.7 5.1h3" />
  </>,

  /* Brands: drawn with their recognizable shape, not an initial. */
  facebook: <path d="M13.9 21.4v-8.2h2.8l.5-3.3h-3.3V7.8c0-.9.3-1.6 1.7-1.6h1.7V3.2c-.8-.1-1.7-.2-2.6-.2-2.6 0-4.4 1.6-4.4 4.5v2.4H7.1v3.3h3.2v8.2z" fill="currentColor" stroke="none" />,
  instagram: <>
    <rect x="2.9" y="2.9" width="18.2" height="18.2" rx="5.2" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
  </>,
  youtube: <>
    <rect x="2.4" y="5.4" width="19.2" height="13.2" rx="4" />
    <path d="m10.3 9.2 5.1 2.8-5.1 2.8z" fill="currentColor" stroke="none" />
  </>,
  tiktok: <path d="M14.4 2.9v11.6a3.5 3.5 0 1 1-2.8-3.4V8.2a6.3 6.3 0 1 0 5.6 6.3V8.8a6 6 0 0 0 3.5 1.1V7a3.6 3.6 0 0 1-3.5-4.1z" fill="currentColor" stroke="none" />,
};

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/* ------------------------------------------------------------------ Reveal
 * Soft fade-in when an element enters the screen. Uses IntersectionObserver instead
 * of listening to scroll, so it costs nothing on mobile. If the browser doesn't
 * support it, the content is simply shown.
 */
export function Reveal({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} ${visible ? "animate-reveal" : "opacity-0"}`}
      style={visible && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ Section */
export function Section({ id, className = "", children }: {
  id?: string; className?: string; children: ReactNode;
}) {
  return (
    <section id={id} className={`px-5 py-20 sm:px-8 md:py-28 ${className}`}>
      <div className="mx-auto max-w-content">{children}</div>
    </section>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`text-[0.72rem] font-extrabold uppercase tracking-[0.22em] ${light ? "text-gold-light" : "text-gold"}`}>
      {children}
    </p>
  );
}

export function Title({ children, center = false, light = false }: {
  children: ReactNode; center?: boolean; light?: boolean;
}) {
  return (
    <h2
      className={`mt-3 text-[2rem] leading-[1.15] sm:text-[2.6rem] ${
        light ? "text-white" : "text-wine-deep"
      } ${center ? "text-center rule-gold-center" : "rule-gold"}`}
    >
      {children}
    </h2>
  );
}

export function Lead({ children, center = false, light = false }: {
  children: ReactNode; center?: boolean; light?: boolean;
}) {
  return (
    <p className={`mt-6 max-w-2xl text-[1.02rem] leading-relaxed ${
      light ? "text-white/80" : "text-ink-soft"
    } ${center ? "mx-auto text-center" : ""}`}>
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ Placeholder
 * Photo placeholder. Used on purpose instead of stock photos: the site must not show
 * someone else's images as if they were from this parish. Each placeholder says which
 * photo goes there, and is replaced by setting the photo path in the content file.
 */
export function PhotoPlaceholder({ label, className = "", compact = false }: {
  label: string; className?: string; compact?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-wine-soft ${className}`}
      role="img"
      aria-label={`Fotografía por definir: ${label}`}
    >
      {/* Very faint diagonal hatching, so it doesn't look like an empty block. */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(122,31,53,0.06) 0 2px, transparent 2px 11px)",
        }}
      />
      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <Icon name="image" size={compact ? 20 : 28} className="text-wine/40" />
        {!compact && (
          <>
            <span className="text-[0.7rem] font-extrabold uppercase tracking-[0.18em] text-wine/45">
              Fotografía por definir
            </span>
            <span className="text-sm text-wine/60">{label}</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Misc */
/**
 * What everything that opens on top of the page has in common: it closes with Escape
 * and locks the background scroll while open (otherwise, on the phone, whatever is
 * behind scrolls instead of the content). It's a hook because both the image viewer
 * and the priest profile need it, and duplicating it guarantees one of them will
 * forget.
 *
 * Layers can stack (the photo viewer opens over the profile), so they're kept in a
 * stack: Escape closes only the top one, and the scroll is unlocked when the LAST one
 * closes. Saving and restoring `overflow` per layer broke with stacking: depending on
 * the order the effects ran, the profile saved "hidden" and restored it on close,
 * leaving the page unable to scroll.
 */
const openLayers: { current: () => void }[] = [];

function onLayerKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape") openLayers[openLayers.length - 1]?.current();
}

export function useModalLayer(onClose: () => void) {
  // A ref, so a new `onClose` on every render doesn't close and reopen the layer.
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    if (openLayers.length === 0) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onLayerKeyDown);
    }
    openLayers.push(close);
    return () => {
      openLayers.splice(openLayers.indexOf(close), 1);
      if (openLayers.length === 0) {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onLayerKeyDown);
      }
    };
  }, []);
}

/**
 * Viewer for seeing an image large. Course posters carry small text that can't be read
 * on the card; without this, the image would be mere decoration.
 *
 * Closes with Escape or by tapping the backdrop, and page scroll is locked while it's
 * open: otherwise, on the phone, what's behind scrolls instead of the image.
 */
export function Lightbox({ src, alt, onClose }: {
  src: string; alt: string; onClose: () => void;
}) {
  useModalLayer(onClose);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div
      role="dialog" aria-modal="true" aria-label={alt}
      onClick={onClose}
      /* `overflow-auto` + `touch-pinch-zoom`: when zoomed, the image overflows the
         screen and must be pannable with a finger and pinch-zoomable. */
      className="fixed inset-0 z-[70] flex touch-pinch-zoom items-center justify-center overflow-auto overscroll-contain bg-wine-deep/[0.92] p-4 animate-fade sm:p-8"
    >
      <button
        type="button" onClick={onClose} aria-label="Cerrar"
        className="fixed right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:right-6 sm:top-6"
      >
        <Icon name="close" size={22} />
      </button>

      <img
        src={src} alt={alt}
        onClick={(e) => { e.stopPropagation(); setZoomed((v) => !v); }}
        className={
          zoomed
            ? "max-w-none cursor-zoom-out rounded-xl shadow-lift [width:220vw] sm:[width:150vw]"
            : "max-h-full max-w-full cursor-zoom-in rounded-xl object-contain shadow-lift"
        }
      />

      {/* On the phone, the "fitted" image fills the screen width and looks the same as
          on the card: without this hint, tapping and seeing nothing happen looks broken. */}
      <p className="pointer-events-none fixed inset-x-0 bottom-5 text-center text-[0.76rem] font-semibold uppercase tracking-[0.12em] text-white/70">
        {zoomed ? "Toca la imagen para ajustarla" : "Toca la imagen para ampliarla"}
      </p>
    </div>
  );
}

export function Pill({ children, tone = "wine" }: {
  children: ReactNode; tone?: "wine" | "gold" | "sage" | "red";
}) {
  const tones = {
    wine: "bg-wine-soft text-wine",
    gold: "bg-gold-soft text-[#8a6d22]",
    sage: "bg-sage-soft text-sage",
    red: "bg-[#fbe3e3] text-[#b23636]",
  } as const;
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] ${tones[tone]}`}>
      {children}
    </span>
  );
}

/**
 * Highlights any uppercase bracketed marker — "[CONTENIDO POR DEFINIR]", "[PRÓXIMAMENTE]", etc. —
 * in amber so they don't slip into production. The text inside the brackets is what shows.
 */
export function Provisional({ text }: { text: string }) {
  // The capture group keeps the markers in the array, at odd indexes.
  const parts = text.split(/\[([A-ZÁÉÍÓÚÜÑ0-9 .,:¡!¿?-]+)\]/);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-gold-soft px-1.5 py-0.5 text-[0.82em] font-bold uppercase tracking-wide text-[#8a6d22]">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}
