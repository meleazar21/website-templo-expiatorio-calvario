import { useState } from "react";
import { sacraments } from "../data/parish";
import { Eyebrow, Icon, Lead, Provisional, Reveal, Section, Title } from "./ui";

/**
 * The sacraments the parish offers. Each card carries the essentials; the requirements (when the
 * parish has listed them) open inside the same card, so on the phone nobody is sent to
 * another screen to see what documents to bring.
 */
export function Sacraments() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Section id="sacramentos">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Encuentro con Cristo</Eyebrow>
          <Title center>Sacramentos</Title>
          <Lead center>
            Signos visibles de la gracia de Dios. Consulta lo que necesitas para recibirlos
            y acércate a la oficina parroquial.
          </Lead>
        </div>
      </Reveal>

      <div className="mt-14 flex flex-wrap justify-center gap-6">
        {sacraments.map((s, i) => {
          const expanded = open === s.nombre;
          const hasDetails = s.requisitos.length > 0 || Boolean(s.nota);
          return (
            <Reveal key={s.nombre} delay={(i % 3) * 90} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]">
              <article className="flex h-full flex-col rounded-2xl border border-wine/[0.08] bg-white p-7 shadow-card transition-shadow hover:shadow-lift">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-wine-soft text-wine">
                  <Icon name={s.icono} size={24} />
                </span>
                <h3 className="mt-5 text-[1.45rem] leading-tight text-wine-deep">{s.nombre}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-ink-soft">{s.descripcion}</p>

                {hasDetails && (
                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? null : s.nombre)}
                      aria-expanded={expanded}
                      className="inline-flex items-center gap-1.5 text-[0.78rem] font-extrabold uppercase tracking-[0.13em] text-wine transition-colors hover:text-gold"
                    >
                      {expanded ? "Ocultar" : "Ver requisitos"}
                      <Icon name="chevron" size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
                    </button>

                    {expanded && (
                      <div className="mt-4 border-t border-wine/[0.08] pt-4 text-[0.88rem]">
                        {s.requisitos.length > 0 && (
                          <ul className="space-y-2 text-ink-soft">
                            {s.requisitos.map((r, k) => (
                              <li key={k} className="flex gap-2">
                                <Icon name="check" size={15} className="mt-1 shrink-0 text-sage" />
                                <span><Provisional text={r} /></span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {s.nota && (
                          <p className="mt-4 rounded-xl bg-gold-soft p-3.5 leading-relaxed text-[#6e5719]">
                            <Provisional text={s.nota} />
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
