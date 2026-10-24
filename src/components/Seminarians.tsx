import { useEffect, useRef, useState } from "react";
import { seminarians, type Seminarian } from "../data/parish";
import { Eyebrow, Icon, Lead, Lightbox, PhotoPlaceholder, Provisional, Reveal, Section, Title } from "./ui";

/** How long each seminarian stays before the next one. */
const SLIDE_MS = 10000;

/** "Sem. Juan Pérez" → "JP": for the small avatar of someone without a photo. */
const initials = (name: string) =>
  name.replace(/^\[|\]$/g, "").replace(/^(sem|seminarista)\.?\s+/i, "").split(/\s+/).slice(0, 2).map((w) => w[0] ?? "").join("").toUpperCase();

const VOCATION = {
  sacerdocio: { label: "Camino al sacerdocio", icon: "chalice" },
  consagrada: { label: "Vida consagrada", icon: "heart" },
} as const;

const STATUS = {
  actual: { label: "En pastoral con nosotros", tone: "bg-gold text-wine-deep" },
  anterior: { label: "Hizo pastoral con nosotros", tone: "bg-wine text-white" },
} as const;

/**
 * A seminarian's photos: the main one large and, if there are more, thumbnails under it
 * that swap into the large frame. Mounted per slide, so it starts on the main photo
 * every time the carousel moves on.
 */
function SeminarianPhotos({ s, onOpen }: { s: Seminarian; onOpen: (src: string) => void }) {
  const pics = [s.foto, ...(s.fotos ?? [])].filter((x): x is string => Boolean(x));
  const [shown, setShown] = useState(0);
  const current = pics[shown];

  return (
    <div className="relative bg-wine-deep p-4 sm:p-5">
      <div className="overflow-hidden rounded-2xl ring-1 ring-gold/50">
        {current ? (
          <button type="button" onClick={() => onOpen(current)}
            aria-label={`Ver en grande: ${s.nombre}`} className="block w-full cursor-zoom-in">
            <img key={current} src={current} alt={s.nombre} decoding="async"
              className="aspect-[4/5] w-full animate-fade object-cover object-top" />
          </button>
        ) : (
          <PhotoPlaceholder label="Seminarista" className="aspect-[4/5] w-full" />
        )}
      </div>
      {pics.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {pics.map((src, i) => (
            <button key={src} type="button" onClick={() => setShown(i)}
              aria-label={`Ver foto ${i + 1} de ${s.nombre}`} aria-current={i === shown}
              className={`overflow-hidden rounded-lg transition-all ${
                i === shown ? "ring-2 ring-gold" : "opacity-55 hover:opacity-100"
              }`}>
              <img src={src} alt="" loading="lazy" className="h-14 w-14 object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * "Nuestras vocaciones": the young people of the parish called to the priesthood
 * (seminarians) or to consecrated life, who do (or did) their pastoral work with us, so
 * the community prays for their vocation.
 *
 * One at a time, large: each gets his moment instead of being one card in a row. It
 * moves on by itself every SLIDE_MS (any arrow, swipe or avatar restarts the count), and
 * the row of round avatars below lets you jump to anyone, which matters once former
 * seminarians add up.
 */
export function Seminarians() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);
  const touchX = useRef<number | null>(null);
  const count = seminarians.length;
  const go = (i: number) => setIndex((i + count) % count);

  useEffect(() => {
    if (count < 2 || open) return;
    const t = window.setTimeout(() => {
      if (document.visibilityState === "visible") go(index + 1);
    }, SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, count, open]);

  if (count === 0) return null;
  const s = seminarians[index];
  const status = STATUS[s.estado] ?? STATUS.actual;
  const vocation = VOCATION[s.vocacion ?? "sacerdocio"] ?? VOCATION.sacerdocio;

  return (
    <Section id="seminaristas" className="bg-gold-soft/60">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Vocaciones</Eyebrow>
          <Title center>Nuestras vocaciones</Title>
          <Lead center>
            Jóvenes de nuestro templo que han respondido al llamado de Dios, al sacerdocio o a
            la vida consagrada, y que hacen o han hecho su pastoral con nosotros. Te invitamos a
            acompañarlos con tu oración.
          </Lead>
        </div>
      </Reveal>

      <Reveal delay={90}>
        <div
          aria-roledescription="carrusel"
          aria-label="Seminaristas"
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
          }}
          className="relative mx-auto mt-12 max-w-4xl overflow-hidden rounded-[2rem] bg-white shadow-lift"
        >
          {/* `key` remounts the slide, so each one fades in. */}
          <div key={index} className="grid animate-fade md:grid-cols-[0.9fr_1.1fr]">
            <SeminarianPhotos s={s} onOpen={(src) => setOpen({ src, alt: s.nombre })} />

            <div className="flex flex-col justify-center p-7 sm:p-10">
              <span className={`self-start rounded-full px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.14em] ${status.tone}`}>
                {status.label}
              </span>
              <p className="mt-5 flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-gold">
                <Icon name={vocation.icon} size={16} /> {vocation.label}
              </p>
              <h3 className="mt-1.5 text-[2rem] leading-tight text-wine-deep sm:text-[2.5rem]">
                <Provisional text={s.nombre} />
              </h3>
              {s.detalle && (
                <p className="mt-2 text-[0.95rem] text-ink-soft"><Provisional text={s.detalle} /></p>
              )}
              <div className="mt-7 rounded-2xl border border-gold/30 bg-gold-soft/50 p-5">
                <p className="flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-gold">
                  <Icon name="heart" size={15} /> Oremos por su vocación
                </p>
                <p className="mt-2 font-serif text-[1.2rem] italic leading-snug text-wine-deep">
                  “Rogad, pues, al Señor de la mies que envíe obreros a su mies.”
                </p>
                <p className="mt-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-gold">Mt 9, 38</p>
              </div>
            </div>
          </div>

          {count > 1 && (
            <>
              {[
                { dir: -1, label: "Seminarista anterior", side: "left-3", flip: "rotate-180" },
                { dir: 1, label: "Seminarista siguiente", side: "right-3", flip: "" },
              ].map((a) => (
                <button key={a.dir} type="button" onClick={() => go(index + a.dir)} aria-label={a.label}
                  className={`absolute top-[45%] ${a.side} inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-wine shadow-card transition-colors hover:bg-gold hover:text-white md:top-1/2`}>
                  <Icon name="arrow" size={18} className={a.flip} />
                </button>
              ))}
            </>
          )}
        </div>
      </Reveal>

      {/* Everyone at a glance: tap a face to go to him. */}
      {count > 1 && (
        <div className="mx-auto mt-6 max-w-4xl overflow-x-auto px-2 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* w-max + mx-auto: centered while they fit, scrollable once they don't. */}
          <div className="mx-auto flex w-max gap-3">
          {seminarians.map((x, i) => (
            <button key={`${x.nombre}-${i}`} type="button" onClick={() => go(i)}
              aria-label={`Ver a ${x.nombre}`} aria-current={i === index} title={x.nombre}
              className={`shrink-0 rounded-full p-0.5 transition-all ${
                i === index ? "scale-110 ring-2 ring-gold ring-offset-2 ring-offset-gold-soft" : "opacity-60 hover:opacity-100"
              }`}>
              {x.foto ? (
                <img src={x.foto} alt="" loading="lazy" className="h-14 w-14 rounded-full object-cover object-top" />
              ) : (
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-wine text-[0.8rem] font-extrabold text-gold-light">
                  {initials(x.nombre) || "·"}
                </span>
              )}
            </button>
          ))}
          </div>
        </div>
      )}

      {open && <Lightbox src={open.src} alt={open.alt} onClose={() => setOpen(null)} />}
    </Section>
  );
}
