import { useState } from "react";
import { priests, type Priest } from "../data/parish";
import { Eyebrow, Icon, Lead, Lightbox, PhotoPlaceholder, Reveal, Section, useModalLayer } from "./ui";

const paragraphs = (text: string) => text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

/**
 * Two groups: "Nuestro Pastor" (the archbishop, alone and centered) and, below it,
 * "Nuestros Sacerdotes" (the parish priest and the vicar, side by side). Each card opens
 * the full bio in a profile, where long text reads better than stretched inside the card.
 */
export function Priests() {
  const [profile, setProfile] = useState<Priest | null>(null);
  const pastors = priests.filter((p) => p.seccion === "pastor");
  const others = priests.filter((p) => p.seccion !== "pastor");

  return (
    <Section id="sacerdotes">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Guías espirituales</Eyebrow>
          <Lead center>
            Quienes acompañan y guían espiritualmente a nuestra comunidad.
          </Lead>
        </div>
      </Reveal>

      {pastors.length > 0 && (
        <>
          <GroupHeading first>Nuestro Pastor</GroupHeading>
          <div className="mx-auto mt-8 grid max-w-4xl gap-6">
            {pastors.map((p, i) => <PriestCard key={p.nombre} p={p} delay={i * 110} onOpen={setProfile} featured />)}
          </div>
        </>
      )}

      {others.length > 0 && (
        <>
          <GroupHeading>{pastors.length > 0 ? "Nuestros Sacerdotes" : null}</GroupHeading>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {others.map((p, i) => <PriestCard key={p.nombre} p={p} delay={i * 110} onOpen={setProfile} />)}
          </div>
        </>
      )}

      {profile && <PriestProfile p={profile} onClose={() => setProfile(null)} />}
    </Section>
  );
}

/** Subheading for each group: the title between two short gold rules. */
function GroupHeading({ children, first = false }: { children: string | null; first?: boolean }) {
  if (!children) return <div className="mt-14" />;
  return (
    <Reveal>
      <h3 className={`${first ? "mt-8" : "mt-14"} flex items-center justify-center gap-4 text-center font-serif text-[1.7rem] leading-tight text-wine-deep sm:text-[1.9rem]`}>
        <span className="h-px w-10 bg-gold/60 sm:w-16" aria-hidden="true" />
        {children}
        <span className="h-px w-10 bg-gold/60 sm:w-16" aria-hidden="true" />
      </h3>
    </Reveal>
  );
}

/**
 * `featured` is the pastor's card: alone and wider, with a vertical (portrait) photo
 * beside the text from the tablet up, so he's seen whole, mitre included. The priests'
 * photos are landscape (at the altar or ambo), so theirs go across the top at 3:2.
 */
function PriestCard({ p, delay, onOpen, featured = false }: {
  p: Priest; delay: number; onOpen: (p: Priest) => void; featured?: boolean;
}) {
  const photo = featured
    ? "aspect-[4/5] w-full object-cover object-top sm:w-[40%] sm:shrink-0"
    : "aspect-[3/2] w-full object-cover object-[center_30%]";
  return (
    <Reveal delay={delay} className="h-full">
      <button
        type="button"
        onClick={() => onOpen(p)}
        className={`group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-wine/[0.08] bg-white text-left shadow-card transition-all hover:-translate-y-1 hover:shadow-lift ${featured ? "sm:flex-row" : ""}`}
      >
        {p.foto ? (
          <img src={p.foto} alt={p.nombre} loading="lazy" decoding="async" className={photo} />
        ) : (
          <PhotoPlaceholder label={p.nombre} className={photo} />
        )}

        <div className={`flex flex-1 flex-col p-7 ${featured ? "sm:justify-center sm:p-10" : ""}`}>
          <p className="text-[0.72rem] font-extrabold uppercase tracking-[0.16em] text-gold">{p.cargo}</p>
          <h4 className={`mt-1.5 font-serif leading-tight text-wine-deep ${featured ? "text-[1.6rem] sm:text-[2rem]" : "text-[1.6rem]"}`}>{p.nombre}</h4>
          <p className={`mt-4 text-[0.94rem] leading-relaxed text-ink-soft ${featured ? "line-clamp-6 sm:line-clamp-[8]" : "line-clamp-5"}`}>
            {paragraphs(p.biografia)[0]}
          </p>
          {/* Pinned to the bottom of the card, except in the pastor's, where the text is
              centered beside the photo and the link follows it. */}
          <span className={`${featured ? "mt-auto sm:mt-2" : "mt-auto"} inline-flex items-center gap-1.5 pt-5 text-[0.75rem] font-extrabold uppercase tracking-[0.13em] text-wine transition-colors group-hover:text-gold`}>
            Conocer más <Icon name="arrow" size={15} />
          </span>
        </div>
      </button>
    </Reveal>
  );
}

/** A priest's full profile: the photo large and the whole bio. */
function PriestProfile({ p, onClose }: { p: Priest; onClose: () => void }) {
  const [enlarged, setEnlarged] = useState(false);
  const [portrait, setPortrait] = useState(false);
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
                className={`block w-full cursor-zoom-in ${portrait ? "bg-ivory-deep" : ""}`}
              >
                {/* A vertical photo (the pastor's) in the 16:9 strip lost the mitre, so it's
                    shown whole instead, centered on the card's ivory. */}
                <img
                  src={p.foto} alt={p.nombre}
                  onLoad={(e) => setPortrait(e.currentTarget.naturalHeight > e.currentTarget.naturalWidth)}
                  className={portrait
                    ? "mx-auto max-h-[60vh] w-auto object-contain"
                    : "aspect-[16/9] w-full object-cover object-[center_15%]"}
                />
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
