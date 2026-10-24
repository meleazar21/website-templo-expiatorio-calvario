import { chapelMasses, perpetualAdoration, schedules, type ScheduleRow } from "../data/parish";
import { Eyebrow, Icon, Provisional, Reveal, Section, Title } from "./ui";

/**
 * The panel takes several times in one field ("6:45 am, 8:30 am y 5:30 pm"); each one
 * is shown on its own line, which is easier to scan than a sentence. Only split when
 * every piece has a digit, so free text like "Previa cita y después de Misa" stays whole.
 */
function splitTimes(hora: string): string[] {
  const parts = hora.split(/\s*,\s*|\s+y\s+/i).map((p) => p.trim()).filter(Boolean);
  return parts.length > 1 && parts.every((p) => /\d/.test(p)) ? parts : [hora];
}

/** A list of days, each with its times as gold pills and an optional note. */
function ScheduleRows({ rows, className = "" }: { rows: ScheduleRow[]; className?: string }) {
  return (
    <dl className={`space-y-6 ${className}`}>
      {rows.map((r, k) => (
        <div key={k}>
          <dt className="flex items-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-gold-light">
            <span className="h-1.5 w-1.5 rotate-45 bg-gold" aria-hidden="true" />
            <Provisional text={r.dia} />
          </dt>
          <dd className="mt-3">
            <ul className="flex flex-wrap gap-2">
              {splitTimes(r.hora).map((t, j) => (
                <li key={j} className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-white/[0.06] py-1.5 pl-2.5 pr-3.5 text-[0.95rem] font-semibold tabular-nums text-white">
                  <Icon name="clock" size={15} className="shrink-0 text-gold-light/80" />
                  <Provisional text={t} />
                </li>
              ))}
            </ul>
          </dd>
          {r.nota && (
            <dd className="mt-2.5 text-[0.85rem] italic leading-snug text-white/60">
              <Provisional text={r.nota} />
            </dd>
          )}
        </div>
      ))}
    </dl>
  );
}

/**
 * Masses, confessions and spiritual direction, side by side: three short lists read
 * better as three cards than as one long table, and on the phone they stack.
 *
 * Each time is a gold pill and they sit side by side, so a day with four Masses takes
 * one or two lines instead of four, and the eye finds the hour at a glance.
 */
export function Schedules() {
  return (
    <Section
      id="horarios"
      // A soft glow from the top, like the hero's, so the wine isn't a flat block.
      className="bg-wine-deep bg-[radial-gradient(80%_55%_at_50%_0%,#6b1a2e_0%,transparent_70%)]"
    >
      <Reveal>
        <div className="text-center">
          <Eyebrow light>Te esperamos</Eyebrow>
          <Title center light>Horarios</Title>
        </div>
      </Reveal>

      {/* Perpetual adoration, above every schedule: whatever the time, the temple is open.
          The monstrance glows and a slow ring pulses from it, like a lamp kept burning. */}
      {perpetualAdoration.title && (
        <Reveal delay={60}>
          <div id="adoracion" className="relative mt-14 scroll-mt-28 overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-r from-gold/[0.16] via-gold/[0.05] to-gold/[0.16] p-7 sm:p-9 md:flex md:items-center md:gap-9">
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
            <div className="relative mx-auto h-20 w-20 shrink-0 md:mx-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-gold/20 [animation-duration:3s]" aria-hidden="true" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 bg-wine-deep text-gold-light shadow-[0_0_44px_rgba(226,198,138,0.45)]">
                <Icon name="monstrance" size={42} />
              </span>
            </div>
            <div className="mt-6 text-center md:mt-0 md:flex-1 md:text-left">
              <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.2em] text-gold-light">Adoración perpetua</p>
              <h3 className="mt-1.5 text-[1.7rem] leading-tight text-white sm:text-[2.05rem]">
                <Provisional text={perpetualAdoration.title} />
              </h3>
              {perpetualAdoration.text && (
                <p className="mt-2.5 max-w-2xl leading-relaxed text-white/75 md:max-w-none">
                  <Provisional text={perpetualAdoration.text} />
                </p>
              )}
            </div>
            <div className="mt-5 text-center md:mt-0 md:shrink-0 md:text-right" aria-hidden="true">
              <p className="font-serif text-[3.4rem] leading-none text-gold-light sm:text-[4.4rem]">24/7</p>
              <p className="mt-1 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] text-white/50">de día y de noche</p>
            </div>
          </div>
        </Reveal>
      )}

      <div className={`${perpetualAdoration.title ? "mt-6" : "mt-14"} grid gap-6 md:grid-cols-3`}>
        {schedules.map((s, i) => (
          <Reveal key={s.key} delay={i * 90} className="h-full">
            <article className="relative h-full overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:p-8">
              {/* Gold hairline across the top of the card. */}
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

              <div className="flex items-center gap-4">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-light">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="text-[1.6rem] leading-tight text-white">{s.title}</h3>
              </div>

              <ScheduleRows rows={s.rows} className="mt-7" />
            </article>
          </Reveal>
        ))}
      </div>

      {/* The Capilla Espíritu Santo belongs to the temple: its Masses go right under
          the temple's, in one wide card so it reads as a place of its own. */}
      {chapelMasses.length > 0 && (
        <Reveal delay={120}>
          <article className="relative mt-6 overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-7 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] sm:p-8 md:flex md:items-center md:gap-10">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="flex items-center gap-4 md:w-1/3 md:shrink-0">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold-light">
                <Icon name="flame" size={22} />
              </span>
              <div>
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-gold-light/80">Santa Misa en la</p>
                <h3 className="text-[1.6rem] leading-tight text-white">Capilla Espíritu Santo</h3>
              </div>
            </div>
            <ScheduleRows rows={chapelMasses} className="mt-7 md:mt-0 md:border-l md:border-white/10 md:pl-10" />
          </article>
        </Reveal>
      )}
    </Section>
  );
}
