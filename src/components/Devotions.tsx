import { useState } from "react";
import { devotions, perpetualAdoration, type RosaryDay } from "../data/parish";
import { Eyebrow, Icon, Lead, Provisional, Reveal, Section, Title } from "./ui";

/** "Miércoles" → "miercoles": to compare day names without accents or case. */
const plain = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/** The mysteries of the Rosary and the day each set is prayed (Rosarium Virginis Mariae). */
const MYSTERIES = {
  Gozosos: [
    "La Anunciación del ángel a María",
    "La Visitación de María a su prima Isabel",
    "El Nacimiento del Hijo de Dios",
    "La Presentación de Jesús en el Templo",
    "El Niño Jesús perdido y hallado en el Templo",
  ],
  Luminosos: [
    "El Bautismo de Jesús en el Jordán",
    "Jesús en las bodas de Caná",
    "El anuncio del Reino de Dios y la invitación a la conversión",
    "La Transfiguración del Señor",
    "La institución de la Eucaristía",
  ],
  Dolorosos: [
    "La oración de Jesús en el Huerto",
    "La flagelación del Señor",
    "La coronación de espinas",
    "Jesús con la Cruz a cuestas camino del Calvario",
    "La crucifixión y muerte de Jesús",
  ],
  Gloriosos: [
    "La Resurrección del Señor",
    "La Ascensión del Señor al cielo",
    "La venida del Espíritu Santo",
    "La Asunción de María al cielo",
    "La coronación de María como Reina del cielo y de la tierra",
  ],
} as const;
const MYSTERIES_BY_DAY: Record<string, keyof typeof MYSTERIES> = {
  lunes: "Gozosos", martes: "Dolorosos", miercoles: "Gloriosos", jueves: "Luminosos",
  viernes: "Dolorosos", sabado: "Gozosos", domingo: "Gloriosos",
};

/** Today's weekday in Nicaragua, whatever the visitor's own time zone. */
const today = plain(new Intl.DateTimeFormat("es", { weekday: "long", timeZone: "America/Managua" }).format(new Date()));

/** A dotted gold line: the small beads strung between the large ones. */
const BEADS_H = "bg-[radial-gradient(circle,#c8a04a_1.6px,transparent_2.2px)] bg-[length:13px_6px] bg-repeat-x bg-center";
const BEADS_V = "bg-[radial-gradient(circle,#c8a04a_1.6px,transparent_2.2px)] bg-[length:6px_13px] bg-repeat-y bg-center";

/** The mysteries prayed on the chosen day. */
function RosaryDayDetail({ r }: { r: RosaryDay }) {
  const set = MYSTERIES_BY_DAY[plain(r.dia)];
  if (!set) return null;
  return (
    <div className="rounded-2xl border border-gold/25 bg-white/[0.05] p-5 animate-fade sm:p-6">
      <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-gold-light">
        {r.dia} · se rezan los
      </p>
      <h4 className="mt-1 font-serif text-[1.6rem] leading-tight text-white">Misterios {set}</h4>
      <ol className="mt-4 grid gap-x-8 gap-y-2.5 md:grid-cols-2">
        {MYSTERIES[set].map((m, i) => (
          <li key={m} className="flex gap-3 text-[0.92rem] leading-snug text-white/85">
            <span className="font-serif text-[1.15rem] leading-none text-gold">{i + 1}.</span>
            {m}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * "Oración y reparación": the life of prayer of an expiatory temple.
 *
 * The daily Rosary is drawn as a rosary: each day is a large bead on a gold string
 * (the small beads between them are the dotted line), ending in a cross, and today's
 * bead glows. Across on desktop, down on the phone. Tapping a day shows its mysteries
 * (under the chain on desktop, under the day on the phone); today is chosen
 * when the page opens. Below it all, the acts of reparation,
 * each card with the date it falls on and its time.
 */
export function Devotions() {
  const { intro, rosary, rosaryReason, rosaryIntentions, items } = devotions;
  const [chosen, setChosen] = useState(() => Math.max(0, rosary.findIndex((r) => plain(r.dia) === today)));

  return (
    <Section id="devociones" className="bg-ivory-deep bg-[radial-gradient(70%_45%_at_50%_0%,#f7f0de_0%,transparent_75%)]">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Vida de devoción</Eyebrow>
          <Title center>Oración y reparación</Title>
          {intro && <Lead center><Provisional text={intro} /></Lead>}
        </div>
      </Reveal>

      {/* Perpetual adoration: the first thing an expiatory temple offers is Jesus exposed
          day and night. Same text as the notice in Horarios (edited in the panel there). */}
      {perpetualAdoration.title && (
        <Reveal delay={60}>
          <div className="relative mt-14 overflow-hidden rounded-3xl border border-gold/40 bg-white p-7 shadow-card sm:p-8 md:flex md:items-center md:gap-8">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="mx-auto flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-wine-deep text-gold-light shadow-[0_0_30px_rgba(200,160,74,0.35)] md:mx-0">
              <Icon name="monstrance" size={34} />
            </span>
            <div className="mt-5 text-center md:mt-0 md:flex-1 md:text-left">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-gold">Adoración perpetua al Santísimo</p>
              <h3 className="mt-1.5 text-[1.5rem] leading-tight text-wine-deep sm:text-[1.8rem]">
                <Provisional text={perpetualAdoration.title} />
              </h3>
              {perpetualAdoration.text && (
                <p className="mt-2 leading-relaxed text-ink-soft"><Provisional text={perpetualAdoration.text} /></p>
              )}
            </div>
            <p className="mt-4 text-center font-serif text-[3rem] leading-none text-gold md:mt-0 md:shrink-0" aria-hidden="true">24/7</p>
          </div>
        </Reveal>
      )}

      {rosary.length > 0 && (
        <Reveal delay={90}>
          <article className={`relative ${perpetualAdoration.title ? "mt-6" : "mt-14"} overflow-hidden rounded-[2rem] bg-wine-deep bg-[radial-gradient(90%_70%_at_50%_0%,#6b1a2e_0%,transparent_70%)] px-6 py-10 text-white shadow-lift sm:px-10 sm:py-12`}>
            <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="text-center">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.22em] text-gold-light">Todos los días</p>
              <h3 className="mt-2 text-[2rem] leading-tight sm:text-[2.4rem]">Santo Rosario</h3>
            </div>

            {/* The rosary. */}
            <div className="relative mx-auto mt-10 max-w-md md:max-w-none">
              {/* The string: down on the phone, across on desktop, through the beads' centers. */}
              <div className={`absolute bottom-10 left-7 top-7 w-2 md:hidden ${BEADS_V}`} aria-hidden="true" />
              <div className={`absolute left-[7%] right-0 top-[3.25rem] hidden h-2 md:block ${BEADS_H}`} aria-hidden="true" />

              <ol className="relative flex flex-col gap-5 md:grid md:grid-cols-[repeat(7,1fr)_auto] md:gap-2">
                {rosary.map((r, i) => {
                  const isToday = plain(r.dia) === today;
                  const isChosen = i === chosen;
                  return (
                    <li key={r.dia} className="md:pt-5">
                      <button
                        type="button" onClick={() => setChosen(i)} aria-pressed={isChosen}
                        aria-label={`${r.dia}: ver los misterios del día`}
                        className="group flex w-full items-center gap-4 text-left md:flex-col md:gap-0 md:text-center"
                      >
                      <span className="relative shrink-0">
                        {isToday && (
                          <span className="absolute -top-5 left-1/2 hidden -translate-x-1/2 text-[0.6rem] font-extrabold uppercase tracking-[0.2em] text-gold-light md:block">
                            Hoy
                          </span>
                        )}
                        <span
                          className={`inline-flex h-14 w-14 items-center justify-center rounded-full border text-[0.68rem] font-extrabold uppercase tracking-[0.08em] transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16 ${
                            isToday
                              ? "border-gold-light bg-gold text-wine-deep shadow-[0_0_0_6px_rgba(200,160,74,0.18),0_0_34px_rgba(226,198,138,0.65)]"
                              : "border-gold/50 bg-wine-dark text-gold-light shadow-[inset_0_2px_6px_rgba(255,255,255,0.08)]"
                          } ${isChosen ? "scale-110 ring-2 ring-gold-light ring-offset-4 ring-offset-wine-deep" : ""}`}
                          aria-current={isToday ? "date" : undefined}
                        >
                          {r.dia.slice(0, 3)}
                        </span>
                      </span>
                      <div className="md:mt-3">
                        <p className="text-[0.95rem] font-bold md:hidden">
                          {r.dia}
                          {isToday && <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[0.6rem] font-extrabold uppercase tracking-[0.14em] text-wine-deep">Hoy</span>}
                        </p>
                        <p className="flex items-center gap-1.5 font-semibold tabular-nums text-white md:justify-center">
                          <Icon name="clock" size={14} className="text-gold-light/80" />
                          <Provisional text={r.hora} />
                        </p>
                        {r.nota && (
                          <p className="mt-0.5 text-[0.78rem] italic leading-snug text-white/60 md:mx-auto md:mt-1.5 md:max-w-[9rem]">
                            <Provisional text={r.nota} />
                          </p>
                        )}
                      </div>
                      </button>
                      {/* On the phone the day's detail opens right under it. */}
                      {isChosen && (
                        <div className="ml-[4.5rem] mt-3 md:hidden"><RosaryDayDetail r={r} /></div>
                      )}
                    </li>
                  );
                })}
                {/* The crucifix that closes the rosary. */}
                <li aria-hidden="true" className="flex items-center pl-[1.1rem] md:items-start md:pl-0 md:pt-5">
                  <span className="inline-flex h-14 w-6 items-center justify-center text-gold md:h-16">
                    <Icon name="cross" size={28} />
                  </span>
                </li>
              </ol>
            </div>

            {/* On desktop, under the whole chain. `key` replays the fade on each change. */}
            {rosary[chosen] && (
              <div key={chosen} className="mt-8 hidden md:block"><RosaryDayDetail r={rosary[chosen]} /></div>
            )}
            <p className="mt-4 text-center text-[0.75rem] text-white/50">Toca un día para ver sus misterios.</p>

            {(rosaryReason || rosaryIntentions.length > 0) && (
              <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
                {rosaryReason && (
                  <p className="border-l-2 border-gold pl-5 font-serif text-[1.25rem] italic leading-snug text-white/90 sm:text-[1.4rem]">
                    <Provisional text={rosaryReason} />
                  </p>
                )}
                {rosaryIntentions.length > 0 && (
                  <div>
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-gold-light">Ofrecemos el Rosario</p>
                    <ul className="mt-3 space-y-2.5">
                      {rosaryIntentions.map((t) => (
                        <li key={t} className="flex gap-3 text-[0.95rem] text-white/85">
                          <Icon name="cross" size={15} className="mt-1 shrink-0 text-gold" />
                          <span><Provisional text={t} /></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </article>
        </Reveal>
      )}

      {/* A card left alone on the last row of three sits in the middle column. */}
      {items.length > 0 && (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:[&>*:last-child:nth-child(3n+1)]:col-start-2">
          {items.map((d, i) => (
            <Reveal key={d.titulo} delay={(i % 3) * 90} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gold/25 bg-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                {/* Gold corner, like the illuminated initial of a missal. */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gold-soft transition-transform duration-500 group-hover:scale-110" aria-hidden="true" />
                <div className="relative flex items-start justify-between gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wine text-gold-light shadow-card">
                    <Icon name={d.icono} size={24} />
                  </span>
                  {d.hora && (
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-white/80 px-3 py-1 text-[0.85rem] font-bold tabular-nums text-wine-deep">
                      <Icon name="clock" size={14} className="text-gold" />
                      {d.hora}
                    </span>
                  )}
                </div>
                <p className="relative mt-5 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-gold">
                  <Provisional text={d.cuando} />
                </p>
                <h3 className="relative mt-1.5 text-[1.45rem] leading-tight text-wine-deep">{d.titulo}</h3>
                <p className="relative mt-3 text-[0.92rem] leading-relaxed text-ink-soft">
                  <Provisional text={d.descripcion} />
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </Section>
  );
}
