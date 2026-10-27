import { useState } from "react";
import { announcements, type Category } from "../data/parish";
import { Eyebrow, Lead, Lightbox, Pill, Provisional, Reveal, Section, Title } from "./ui";

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
  const [poster, setPoster] = useState<{ src: string; alt: string } | null>(null);

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
          <Reveal key={a.titulo + i} delay={(i % 2) * 90} className={`h-full ${a.imagen ? "md:col-span-2" : ""}`}>
            <article className={`h-full overflow-hidden rounded-2xl border bg-white shadow-card transition-shadow hover:shadow-lift ${
              a.destacado ? "border-gold/60" : "border-wine/[0.08]"
            } ${a.imagen ? "md:flex md:items-start" : ""}`}>
              {/* Notices are often posters with text on them, so the image is never
                  cropped: full width on the phone, and on desktop a column beside the
                  text (the notice takes the whole row). Tapping opens it large. */}
              {a.imagen && (
                <button
                  type="button" onClick={() => setPoster({ src: a.imagen!, alt: a.titulo })}
                  title="Ver la imagen en grande"
                  className="block w-full cursor-zoom-in md:w-[38%] md:max-w-sm md:shrink-0"
                >
                  <img src={a.imagen} alt={a.titulo} loading="lazy" decoding="async"
                    className="block h-auto w-full" />
                </button>
              )}
              <div className={`p-6 sm:p-7 ${a.imagen ? "md:flex-1 md:self-center md:p-9" : ""}`}>
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
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      {poster && <Lightbox src={poster.src} alt={poster.alt} onClose={() => setPoster(null)} />}
    </Section>
  );
}
