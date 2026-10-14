import { useState } from "react";
import { gallery } from "../data/parish";
import { Eyebrow, Lead, Lightbox, PhotoPlaceholder, Reveal, Section, Title } from "./ui";

/**
 * Height of each tile: the uneven heights are what give it the mosaic look. The keys
 * are the `alto` values stored in `content/galeria/`. Phones get shorter tiles because
 * they show two columns.
 */
const TILE_HEIGHT = {
  corto: "h-32 sm:h-60",
  medio: "h-44 sm:h-80",
  alto: "h-60 sm:h-[26rem]",
} as const;

/**
 * Mosaic gallery (CSS columns). Two columns even on phones, where most visitors are: a
 * single column turned nine photos into a very long scroll. Tapping a photo opens it
 * large, since the tiles are small there.
 */
export function Gallery() {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);

  return (
    <Section id="galeria">
      <Reveal>
        <div className="text-center">
          <Eyebrow>Nuestra vida en comunidad</Eyebrow>
          <Title center>Galería</Title>
          <Lead center>
            Celebraciones, momentos de oración y la vida de nuestra comunidad parroquial.
          </Lead>
        </div>
      </Reveal>

      <Reveal delay={90}>
        <div className="mt-12 columns-2 gap-3 sm:mt-14 sm:gap-5 lg:columns-3 [&>*]:mb-3 sm:[&>*]:mb-5">
          {gallery.map((f) =>
            f.foto ? (
              <button
                key={f.titulo}
                type="button"
                onClick={() => setOpen({ src: f.foto!, alt: f.titulo })}
                aria-label={`Ver en grande: ${f.titulo}`}
                className="block w-full break-inside-avoid cursor-zoom-in"
              >
                <img
                  src={f.foto}
                  alt={f.titulo}
                  loading="lazy"
                  decoding="async"
                  className={`w-full rounded-xl object-cover shadow-card sm:rounded-2xl ${TILE_HEIGHT[f.alto]}`}
                />
              </button>
            ) : (
              <PhotoPlaceholder
                key={f.titulo}
                label={f.titulo}
                compact
                className={`w-full break-inside-avoid rounded-xl shadow-card sm:rounded-2xl ${TILE_HEIGHT[f.alto]}`}
              />
            )
          )}
        </div>
      </Reveal>

      {open && <Lightbox src={open.src} alt={open.alt} onClose={() => setOpen(null)} />}
    </Section>
  );
}
