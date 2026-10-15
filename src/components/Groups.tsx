import { useState } from "react";
import { groups, type Group } from "../data/parish";
import { contact, isPlaceholder, paragraphs } from "../data/site";
import { Eyebrow, Icon, type IconName, Lead, Lightbox, Provisional, Reveal, Section, Title } from "./ui";

const hasLink = (url?: string): url is string => Boolean(url) && !isPlaceholder(url!);

/** A group's links that are filled in: its website first, then its social networks. */
function groupLinks(g: Group): { name: string; icon: IconName; url: string; background: string }[] {
  const brand = (name: string) => contact.socials.find((s) => s.name === name)?.background ?? "";
  return [
    { name: "Página web", icon: "globe" as IconName, url: g.enlace, background: "#7a1f35" },
    { name: "Facebook", icon: "facebook" as IconName, url: g.facebook, background: brand("Facebook") },
    { name: "Instagram", icon: "instagram" as IconName, url: g.instagram, background: brand("Instagram") },
  ].filter((l): l is typeof l & { url: string } => hasLink(l.url));
}

/**
 * The card's header: the logo, then the group's photos, changed by hand with the arrows
 * or dots (several cards rotating at once would pull the eye all over). The logo is shown whole on ivory; photos fill the frame. The frame has a fixed
 * height so the card doesn't jump between a tall logo and a wide photo. Tapping opens
 * the current image large.
 */
function GroupMedia({ images, hasLogo, name, onOpen }: {
  images: string[]; hasLogo: boolean; name: string; onOpen: (src: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (i: number) => setIndex((i + count) % count);

  if (count === 1) {
    return (
      <button type="button" onClick={() => onOpen(images[0])} title="Ver la imagen en grande"
        className="group block w-full bg-ivory-deep">
        <img src={images[0]} alt={name} loading="lazy"
          className="max-h-64 w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
      </button>
    );
  }

  return (
    <div className="relative h-64 bg-ivory-deep" aria-roledescription="carrusel" aria-label={name}>
      <button type="button" onClick={() => onOpen(images[index])} title="Ver la imagen en grande"
        className="group absolute inset-0 block overflow-hidden">
        {images.map((src, i) => (
          <img key={src} src={src} alt={hasLogo && i === 0 ? name : `${name}, foto ${hasLogo ? i : i + 1}`} loading="lazy"
            aria-hidden={i !== index}
            className={`absolute inset-0 h-full w-full transition-[opacity,transform] duration-700 group-hover:scale-[1.03] ${
              hasLogo && i === 0 ? "object-contain" : "object-cover"
            } ${i === index ? "opacity-100" : "opacity-0"}`} />
        ))}
      </button>
      {[
        { label: "Imagen anterior", step: -1, side: "left-2", flip: "rotate-180" },
        { label: "Imagen siguiente", step: 1, side: "right-2", flip: "" },
      ].map((a) => (
        <button key={a.step} type="button" onClick={() => go(index + a.step)} aria-label={a.label}
          className={`absolute top-1/2 ${a.side} inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-wine-deep/55 text-white shadow transition-colors hover:bg-wine-deep/80`}>
          <Icon name="arrow" size={16} className={a.flip} />
        </button>
      ))}
      <div className="absolute inset-x-0 bottom-2.5 flex justify-center gap-1">
        {images.map((_, i) => (
          <button key={i} type="button" onClick={() => go(i)}
            aria-label={hasLogo && i === 0 ? "Ver el logo" : `Ver foto ${hasLogo ? i : i + 1}`} aria-current={i === index}
            className="p-1">
            <span className={`block h-1.5 rounded-full shadow transition-all duration-500 ${
              i === index ? "w-6 bg-gold" : "w-1.5 bg-white/80"
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Parish groups. The card shows the name and description; when they meet lives behind
 * "Ver información", so cards with descriptions of different lengths still line up.
 * If the group has a logo or photos, they head the card (see GroupMedia).
 */
export function Groups() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [poster, setPoster] = useState<{ src: string; alt: string } | null>(null);

  return (
    <Section id="grupos" className="bg-ivory-deep">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Servir en comunidad</Eyebrow>
          <Title center>Nuestros grupos</Title>
          <Lead center>
            Hay un lugar para ti. Conoce los grupos y ministerios de nuestra parroquia y
            acércate al que te llame.
          </Lead>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g, i) => {
          const expanded = openGroup === g.nombre;
          // The first paragraph goes on the card; any others open with "Ver información",
          // so one long description doesn't stretch every card in its row.
          const [intro, ...more] = paragraphs(g.descripcion);
          const images = [g.imagen, ...(g.fotos ?? [])].filter((s): s is string => Boolean(s));
          return (
            <Reveal key={g.nombre} delay={(i % 3) * 90} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-wine/[0.08] bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                {images.length > 0 && (
                  <GroupMedia images={images} hasLogo={Boolean(g.imagen)} name={g.nombre}
                    onOpen={(src) => setPoster({ src, alt: g.nombre })} />
                )}

                <div className="flex flex-1 flex-col p-7">
                  {images.length === 0 && (
                    <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gold-soft text-[#8a6d22]">
                      <Icon name="cross" size={22} />
                    </span>
                  )}
                  <h3 className="text-[1.4rem] leading-tight text-wine-deep">{g.nombre}</h3>
                  <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
                    <Provisional text={intro ?? g.descripcion} />
                  </p>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => setOpenGroup(expanded ? null : g.nombre)}
                      aria-expanded={expanded}
                      className="inline-flex items-center gap-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.13em] text-wine transition-colors hover:text-gold"
                    >
                      {expanded ? "Ocultar" : "Ver información"}
                      <Icon name="chevron" size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </button>

                    {expanded && (
                      <div className="mt-4 border-t border-wine/[0.08] pt-4">
                        {more.map((p, k) => (
                          <p key={k} className="mb-4 text-[0.92rem] leading-relaxed text-ink-soft">
                            <Provisional text={p} />
                          </p>
                        ))}
                        <dl className="space-y-2.5 text-[0.88rem]">
                          {[
                            { k: "Encuentros", v: g.encuentros },
                          ].map((f) => (
                            <div key={f.k} className="flex gap-2">
                              <dt className="w-24 shrink-0 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
                                {f.k}
                              </dt>
                              <dd className="font-semibold text-wine">
                                <Provisional text={f.v} />
                              </dd>
                            </div>
                          ))}
                        </dl>
                        {groupLinks(g).length > 0 && (
                          /* Round buttons with only the logo, like the footer's: a logo is
                             recognized at a glance and several fit on one line. */
                          <>
                          <p className="mt-5 text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
                            Más información en
                          </p>
                          <div className="mt-2.5 flex flex-wrap gap-2.5">
                            {groupLinks(g).map((l) => (
                              <a
                                key={l.name}
                                href={l.url} target="_blank" rel="noopener noreferrer"
                                aria-label={`${l.name} de ${g.nombre}`}
                                title={l.name}
                                style={{ background: l.background }}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5"
                              >
                                <Icon name={l.icon} size={18} />
                              </a>
                            ))}
                          </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      {poster && <Lightbox src={poster.src} alt={poster.alt} onClose={() => setPoster(null)} />}
    </Section>
  );
}
