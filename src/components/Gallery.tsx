import { useRef, useState } from "react";
import { gallery, type GalleryPhoto } from "../data/parish";
import { Eyebrow, Icon, Lead, Lightbox, PhotoPlaceholder, Reveal, Section, Title } from "./ui";

/** Photos per page: one featured and four smaller around it. */
const PAGE_SIZE = 5;

/**
 * Where each photo of a page goes. Phone: the first across the top, then a 2×2 grid.
 * Desktop: the first large on the left, the other four in a 2×2 grid beside it.
 */
const SLOT = [
  "col-span-2 h-56 sm:row-span-2 sm:h-auto",
  "h-36 sm:h-auto",
  "h-36 sm:h-auto",
  "h-36 sm:h-auto",
  "h-36 sm:h-auto",
];

const pages: GalleryPhoto[][] = [];
for (let i = 0; i < gallery.length; i += PAGE_SIZE) pages.push(gallery.slice(i, i + PAGE_SIZE));

/**
 * Gallery in pages of five, changed with the arrows or by swiping. With dozens of photos,
 * a full mosaic made the page very long on the phone; this keeps the section one screen
 * tall however many photos are added. Tapping a photo opens it large.
 */
export function Gallery() {
  const [open, setOpen] = useState<{ src: string; alt: string } | null>(null);
  const [page, setPage] = useState(0);
  const touchX = useRef<number | null>(null);
  const count = pages.length;
  const go = (p: number) => setPage((p + count) % count);

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

      {count > 0 && (
        <Reveal delay={90}>
          <div
            aria-roledescription="carrusel"
            aria-label="Galería de fotos"
            onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) go(page + (dx < 0 ? 1 : -1));
            }}
            className="mt-12 sm:mt-14"
          >
            {/* `key` remounts the grid on each page, so it fades in instead of popping. */}
            <div
              key={page}
              className="grid animate-fade grid-cols-2 gap-3 sm:h-[30rem] sm:grid-cols-4 sm:grid-rows-2 sm:gap-4 lg:h-[34rem]"
            >
              {pages[page].map((f, i) =>
                f.foto ? (
                  <button
                    key={f.titulo}
                    type="button"
                    onClick={() => setOpen({ src: f.foto!, alt: f.titulo })}
                    aria-label={`Ver en grande: ${f.titulo}`}
                    className={`group overflow-hidden rounded-xl shadow-card cursor-zoom-in sm:rounded-2xl ${SLOT[i]}`}
                  >
                    <img
                      src={f.foto}
                      alt={f.titulo}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </button>
                ) : (
                  <PhotoPlaceholder
                    key={f.titulo}
                    label={f.titulo}
                    compact
                    className={`rounded-xl shadow-card sm:rounded-2xl ${SLOT[i]}`}
                  />
                )
              )}
            </div>

            {count > 1 && (
              <div className="mt-6 flex items-center justify-center gap-5">
                <button
                  type="button" onClick={() => go(page - 1)} aria-label="Fotos anteriores"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-wine/20 text-wine transition-colors hover:border-gold hover:bg-gold hover:text-white"
                >
                  <Icon name="arrow" size={18} className="rotate-180" />
                </button>
                <p className="min-w-[4.5rem] text-center text-[0.8rem] font-extrabold tabular-nums tracking-[0.14em] text-ink-soft" aria-live="polite">
                  {page + 1} / {count}
                </p>
                <button
                  type="button" onClick={() => go(page + 1)} aria-label="Fotos siguientes"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-wine/20 text-wine transition-colors hover:border-gold hover:bg-gold hover:text-white"
                >
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {open && <Lightbox src={open.src} alt={open.alt} onClose={() => setOpen(null)} />}
    </Section>
  );
}
