import { useState } from "react";
import { priests, type Priest } from "../data/parish";
import { Eyebrow, Icon, Lead, Lightbox, PhotoPlaceholder, Reveal, Section, Title, useModalLayer } from "./ui";

const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

/**
 * The parish priest and the vicar. Only two people, so each gets a wide card with the
 * photo beside the start of the bio; the full bio opens in a profile, where long text
 * reads better than stretched inside the card.
 */
export function Priests() {
  const [profile, setProfile] = useState<Priest | null>(null);

  return (
    <Section id="sacerdotes">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Nuestros pastores</Eyebrow>
          <Title center>Sacerdotes</Title>
          <Lead center>
            Los sacerdotes que acompañan y guían espiritualmente a nuestra comunidad.
          </Lead>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-2">
        {priests.map((p, i) => (
          <Reveal key={p.nombre} delay={i * 110} className="h-full">
            <button
              type="button"
              onClick={() => setProfile(p)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-wine/[0.08] bg-white text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              {/* The photos are landscape (the priest at the altar or ambo), so they go
                  across the top at their own 3:2 rather than squeezed into a side column,
                  which cut the priest off at the edge. */}
              {p.foto ? (
                <img src={p.foto} alt={p.nombre} loading="lazy" decoding="async"
                  className="aspect-[3/2] w-full object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.02]" />
              ) : (
                <PhotoPlaceholder label={p.nombre} className="aspect-[3/2] w-full" />
              )}

              <div className="flex flex-1 flex-col p-7">
                <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-gold">{p.cargo}</p>
                <h3 className="mt-1.5 text-[1.6rem] leading-tight text-wine-deep">{p.nombre}</h3>
                <p className="mt-4 line-clamp-5 text-[0.94rem] leading-relaxed text-ink-soft">
                  {paragraphs(p.biografia)[0]}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[0.75rem] font-extrabold uppercase tracking-[0.13em] text-wine transition-colors group-hover:text-gold">
                  Conocer más <Icon name="arrow" size={15} />
                </span>
              </div>
            </button>
          </Reveal>
        ))}
      </div>

      {profile && <PriestProfile p={profile} onClose={() => setProfile(null)} />}
    </Section>
  );
}

/** A priest's full profile: the photo large and the whole bio. */
function PriestProfile({ p, onClose }: { p: Priest; onClose: () => void }) {
  const [enlarged, setEnlarged] = useState(false);
  useModalLayer(onClose);

  return (
    <>
      <div
        role="dialog" aria-modal="true" aria-label={p.nombre}
        onClick={onClose}
        className="fixed inset-0 z-[70] flex items-end justify-center bg-wine-deep/90 p-0 animate-fade sm:items-center sm:p-6"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative max-h-[92vh] w-full max-w-2xl animate-reveal overflow-hidden rounded-t-2xl bg-white shadow-lift sm:max-h-[88vh] sm:rounded-2xl"
        >
          <button
            type="button" onClick={onClose} aria-label="Cerrar"
            className="absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-wine-deep/60 text-white backdrop-blur transition-colors hover:bg-wine-deep"
          >
            <Icon name="close" size={20} />
          </button>

          {/* The landscape photo as a banner across the top, then the bio. Both scroll
              together, so on a short screen the photo moves out of the way of the text. */}
          <div className="max-h-[92vh] overflow-y-auto sm:max-h-[88vh]">
            {p.foto ? (
              <button
                type="button" onClick={() => setEnlarged(true)} aria-label={`Ver la foto de ${p.nombre} en grande`}
                className="block w-full cursor-zoom-in"
              >
                <img src={p.foto} alt={p.nombre} className="aspect-[16/9] w-full object-cover object-[center_30%]" />
              </button>
            ) : (
              <PhotoPlaceholder label={p.nombre} className="aspect-[16/9] w-full" />
            )}

          <div className="p-7 sm:p-9">
            <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-gold">
              {p.cargo}
            </p>
            <h3 className="mt-2 font-serif text-[1.8rem] leading-tight text-wine-deep">{p.nombre}</h3>
            <div className="mt-6 space-y-4 leading-relaxed text-ink-soft">
              {paragraphs(p.biografia).map((t, k) => (
                <p key={k}>{t}</p>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* Outside the profile: its `animate-reveal` leaves a transform on the panel, which
          would trap a `position: fixed` viewer inside it instead of covering the screen. */}
      {enlarged && p.foto && (
        <Lightbox src={p.foto} alt={p.nombre} onClose={() => setEnlarged(false)} />
      )}
    </>
  );
}
