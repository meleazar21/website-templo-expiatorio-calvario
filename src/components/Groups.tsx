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
    { name: "YouTube", icon: "youtube" as IconName, url: g.youtube, background: brand("YouTube") },
    { name: "TikTok", icon: "tiktok" as IconName, url: g.tiktok, background: brand("TikTok") },
  ].filter((l): l is typeof l & { url: string } => hasLink(l.url));
}

/**
 * One meeting line from the panel, "Día · Horario (Tipo)", split into its parts so the
 * card can lay them out. Any part may be missing: "Solemnidades · (Servicio)" has no
 * time, and a line without "·" is all day.
 */
function parseMeeting(line: string): { day: string; time: string; kind: string } {
  const kindMatch = line.match(/\(([^)]+)\)\s*$/);
  const kind = kindMatch ? kindMatch[1].trim() : "";
  const rest = kindMatch ? line.slice(0, kindMatch.index).trim() : line;
  const dot = rest.indexOf("·");
  return dot < 0
    ? { day: rest, time: "", kind }
    : { day: rest.slice(0, dot).trim(), time: rest.slice(dot + 1).trim(), kind };
}

/**
 * The group's meetings, one row each: the day on top with its kind as a tag, and the
 * time below. With up to seven lines per group, a block of plain text was hard to scan.
 * "Servicio" is gold (when they serve at Mass); meetings and formation are wine.
 */
function GroupMeetings({ text }: { text: string }) {
  const rows = text.split("\n").map((l) => l.trim()).filter(Boolean).map(parseMeeting);

  return (
    <ul className="mt-2.5 space-y-2">
      {rows.map((m, k) => (
        <li key={k} className="rounded-xl border-l-2 border-gold bg-ivory-deep/70 px-3.5 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <p className="font-bold leading-snug text-wine-deep"><Provisional text={m.day} /></p>
            {m.kind && (
              <span className={`max-w-[55%] rounded-xl px-2.5 py-0.5 text-right text-[0.62rem] font-extrabold uppercase leading-snug tracking-[0.1em] ${
                /servicio/i.test(m.kind) ? "bg-gold-soft text-[#8a6d22]" : "bg-wine-soft text-wine"
              }`}>
                {m.kind}
              </span>
            )}
          </div>
          {m.time && (
            <p className="mt-1 flex items-start gap-1.5 text-[0.85rem] font-medium tabular-nums text-ink-soft">
              {/\d/.test(m.time) && <Icon name="clock" size={14} className="mt-[3px] shrink-0 text-gold" />}
              <span><Provisional text={m.time} /></span>
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * The card's header: the logo, then the group's photos, changed by hand with the arrows
 * or dots (several cards rotating at once would pull the eye all over). The logo is
 * shown whole on ivory; photos fill the frame. A group with photos but no logo gets the
 * cross placeholder in the logo's place, so its first slide still says "parish group".
 * The frame has a fixed height so the card doesn't jump between a tall logo and a wide
 * photo. Tapping opens the current image large.
 */
function GroupMedia({ logo, photos, name, onOpen }: {
  logo?: string; photos: string[]; name: string; onOpen: (src: string) => void;
}) {
  const [index, setIndex] = useState(0);
  // "" in the first slot = the cross placeholder.
  const slides = [logo ?? "", ...photos];
  const count = slides.length;
  const go = (i: number) => setIndex((i + count) % count);

  if (count === 1) {
    return (
      <button type="button" onClick={() => onOpen(slides[0])} title="Ver la imagen en grande"
        className="group block w-full bg-ivory-deep">
        <img src={slides[0]} alt={name} loading="lazy"
          className="max-h-64 w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]" />
      </button>
    );
  }

  const current = slides[index];
  return (
    <div className="relative h-64 bg-ivory-deep" aria-roledescription="carrusel" aria-label={name}>
      <button type="button" onClick={() => current && onOpen(current)}
        title={current ? "Ver la imagen en grande" : undefined}
        className={`group absolute inset-0 block overflow-hidden ${current ? "" : "cursor-default"}`}>
        {slides.map((src, i) => {
          const fade = `transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`;
          return src ? (
            <img key={src} src={src} alt={i === 0 ? name : `${name}, foto ${i}`} loading="lazy"
              aria-hidden={i !== index}
              className={`absolute inset-0 h-full w-full transition-transform group-hover:scale-[1.03] ${
                i === 0 ? "object-contain" : "object-cover"
              } ${fade}`} />
          ) : (
            <span key="placeholder" aria-hidden="true"
              className={`absolute inset-0 flex items-center justify-center ${fade}`}>
              <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gold-soft text-[#8a6d22] ring-1 ring-gold/30">
                <Icon name="cross" size={44} />
              </span>
            </span>
          );
        })}
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
        {slides.map((_, i) => (
          <button key={i} type="button" onClick={() => go(i)}
            aria-label={i === 0 ? "Ver el inicio" : `Ver foto ${i}`} aria-current={i === index}
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
          const photos = (g.fotos ?? []).filter(Boolean);
          const hasMedia = Boolean(g.imagen) || photos.length > 0;
          return (
            <Reveal key={g.nombre} delay={(i % 3) * 90} className="h-full">
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-wine/[0.08] bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                {hasMedia && (
                  <GroupMedia logo={g.imagen || undefined} photos={photos} name={g.nombre}
                    onOpen={(src) => setPoster({ src, alt: g.nombre })} />
                )}

                <div className="flex flex-1 flex-col p-7">
                  {!hasMedia && (
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
                            <div key={f.k}>
                              <dt className="text-[0.7rem] font-extrabold uppercase tracking-[0.12em] text-ink-faint">
                                {f.k}
                              </dt>
                              {/* One row per meeting: each line typed in the panel is a row. */}
                              <dd><GroupMeetings text={f.v} /></dd>
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
