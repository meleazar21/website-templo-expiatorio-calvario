import { announcements, type Category } from "../data/parish";
import { Eyebrow, Lead, Pill, Provisional, Reveal, Section, Title } from "./ui";

/** Color for each category; gold is reserved for the liturgy, the heart of parish life. */
const CATEGORY_TONE: Record<Category, "wine" | "gold" | "sage" | "red"> = {
  AVISOS: "wine",
  LITURGIA: "gold",
  SACRAMENTOS: "wine",
  ACTIVIDADES: "sage",
  FESTIVIDADES: "gold",
};

/** Parish announcements: what changes week to week. */
export function Announcements() {
  return (
    <Section id="avisos" className="bg-ivory-deep">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Al día</Eyebrow>
          <Title center>Avisos parroquiales</Title>
          <Lead center>
            Lo más reciente de nuestra parroquia: celebraciones, actividades y anuncios
            importantes.
          </Lead>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {announcements.map((a, i) => (
          <Reveal key={a.titulo + i} delay={(i % 2) * 90} className="h-full">
            <article className={`h-full rounded-2xl border bg-white p-6 shadow-card transition-shadow hover:shadow-lift sm:p-7 ${
              a.destacado ? "border-gold/60" : "border-wine/[0.08]"
            }`}>
              <div className="flex flex-wrap items-center gap-3">
                <Pill tone={CATEGORY_TONE[a.categoria] ?? "wine"}>{a.categoria}</Pill>
                {a.destacado && <Pill tone="gold">Destacado</Pill>}
                <span className="text-[0.8rem] text-ink-faint">
                  <Provisional text={a.fecha} />
                </span>
              </div>
              <h3 className="mt-4 font-serif text-[1.35rem] leading-tight text-wine-deep">
                <Provisional text={a.titulo} />
              </h3>
              {/* pre-line keeps the line breaks typed in the panel's text box. */}
              <p className="mt-3 whitespace-pre-line leading-relaxed text-ink-soft">
                <Provisional text={a.descripcion} />
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
