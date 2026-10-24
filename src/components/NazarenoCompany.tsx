import { useState } from "react";
import { nazarenoCompany } from "../data/parish";
import { paragraphs } from "../data/site";
import { Eyebrow, Icon, Lead, Lightbox, Provisional, Reveal, Section, Title } from "./ui";

/**
 * Where each holy card sits in the fan: the first, larger, in the middle and in front;
 * the others tilted behind it to either side. Hovering a card straightens it and brings
 * it forward.
 */
const CARDS = [
  "left-1/2 top-0 z-20 w-[58%] -translate-x-1/2 -rotate-2",
  "left-[4%] top-[14%] z-10 w-[42%] -rotate-[9deg]",
  "right-[4%] top-[20%] z-10 w-[42%] rotate-[8deg]",
];

/**
 * The Compañía de Jesús Nazareno: the devotees and promesantes who celebrate Jesús
 * Nazareno every year and carry much of Lent. They aren't a parish group, so instead of
 * a group card they get a band of their own, in the purple of Lent, with their photos
 * as holy cards (estampitas) fanned out.
 */
export function NazarenoCompany() {
  const { eyebrow, title, text, motto, photos } = nazarenoCompany;
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);
  if (!title) return null;

  return (
    <Section
      id="compania"
      // The purple of Lent, the Compañía's season; used only here.
      className="relative overflow-hidden bg-[#2a1033] bg-[radial-gradient(60%_70%_at_85%_30%,#5b2a6e_0%,transparent_70%),radial-gradient(50%_60%_at_0%_100%,#3e0d1a_0%,transparent_70%)] text-white"
    >
      <div className="grid items-center gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          {eyebrow && <Eyebrow light>{eyebrow}</Eyebrow>}
          <Title light>{title}</Title>
          {paragraphs(text).map((p, i) => (
            <Lead key={i} light><Provisional text={p} /></Lead>
          ))}
          {motto && (
            <p className="mt-8 border-l-2 border-gold pl-5 font-serif text-[1.45rem] italic leading-snug text-white/90 sm:text-[1.65rem]">
              <Provisional text={motto} />
            </p>
          )}
          <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-white/[0.06] px-4 py-2 text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-gold-light">
            <Icon name="cross" size={14} /> Cuaresma y Semana Santa
          </p>
        </Reveal>

        {photos.length > 0 && (
          <Reveal delay={120}>
            <div className="relative mx-auto h-[23rem] max-w-lg sm:h-[30rem]">
              {photos.slice(0, CARDS.length).map((f, i) => (
                <button
                  key={f.foto}
                  type="button"
                  onClick={() => setOpen({ src: f.foto, alt: f.texto || title })}
                  aria-label={`Ver en grande: ${f.texto || title}`}
                  className={`group absolute cursor-zoom-in rounded-md bg-ivory p-2 pb-9 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.6)] transition-all duration-500 hover:z-30 hover:rotate-0 hover:scale-105 sm:p-2.5 sm:pb-10 ${CARDS[i]}`}
                >
                  <img src={f.foto} alt={f.texto || title} loading="lazy" decoding="async"
                    className="aspect-[3/4] w-full rounded-sm object-cover" />
                  {f.texto && (
                    <span className="absolute inset-x-2 bottom-2 truncate text-center font-serif text-[0.95rem] italic text-wine sm:bottom-2.5 sm:text-[1.05rem]">
                      {f.texto}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </Reveal>
        )}
      </div>

      {open && <Lightbox src={open.src} alt={open.alt} onClose={() => setOpen(null)} />}
    </Section>
  );
}
