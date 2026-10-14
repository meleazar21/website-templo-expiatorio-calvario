import { schedules } from "../data/parish";
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

/**
 * Masses, confessions and spiritual direction, side by side: three short lists read
 * better as three cards than as one long table, and on the phone they stack.
 */
export function Schedules() {
  return (
    <Section id="horarios" className="bg-wine-deep">
      <Reveal>
        <div className="text-center">
          <Eyebrow light>Te esperamos</Eyebrow>
          <Title center light>Horarios</Title>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {schedules.map((s, i) => (
          <Reveal key={s.key} delay={i * 90} className="h-full">
            <article className="h-full rounded-2xl border border-white/[0.12] bg-white/[0.04] p-7">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-light">
                  <Icon name={s.icon} size={22} />
                </span>
                <h3 className="text-[1.5rem] leading-tight text-white">{s.title}</h3>
              </div>

              <dl className="mt-6 divide-y divide-white/10">
                {s.rows.map((r, k) => (
                  <div key={k} className="py-4 first:pt-0 last:pb-0">
                    <dt className="text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-gold-light">
                      <Provisional text={r.dia} />
                    </dt>
                    <dd className="mt-2">
                      <ul className="space-y-1.5">
                        {splitTimes(r.hora).map((t, j) => (
                          <li key={j} className="flex items-start gap-2 font-semibold tabular-nums text-white">
                            <Icon name="clock" size={16} className="mt-1 shrink-0 text-white/50" />
                            <span><Provisional text={t} /></span>
                          </li>
                        ))}
                      </ul>
                    </dd>
                    {r.nota && (
                      <dd className="mt-1 pl-6 text-[0.85rem] text-white/60">
                        <Provisional text={r.nota} />
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
