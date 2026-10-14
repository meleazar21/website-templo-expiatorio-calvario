import { useCallback, useEffect, useState } from "react";
import { heroSlides, site } from "../data/site";
import { Icon } from "./ui";

/** How long each slide stays before moving on. */
const SLIDE_MS = 5000;

/**
 * Hero with a photo carousel. The slides are set from the panel
 * (/admin → Configuración del sitio → Portada); with none, a composed wine gradient is
 * shown, which is a worthy background on its own.
 *
 * The slides cross-fade instead of sliding sideways: the text sits on top and stays
 * still, and a sideways slide behind it reads as the whole page moving. It advances on
 * its own every SLIDE_MS, and only waits while the tab is hidden. It doesn't pause on
 * hover: the hero fills the screen, so on a desktop the pointer is almost always over it.
 * Using the arrows or dots restarts the count.
 */
export function Hero() {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(() => document.visibilityState === "hidden");
  const count = heroSlides.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    const onChange = () => setHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  useEffect(() => {
    if (count < 2 || hidden) return;
    const t = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => window.clearTimeout(t);
  }, [index, hidden, count, go]);

  return (
    <section
      id="inicio"
      className="relative flex min-h-[82svh] items-center overflow-hidden sm:min-h-[100svh]"
      aria-roledescription="carrusel"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-wine-deep">
        {count > 0 ? (
          heroSlides.map((s, i) => (
            <div
              key={s.photo}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
                i === index ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={i !== index}
            >
              <img
                src={s.photo}
                alt={s.caption}
                // Only the first slide is urgent; the rest load while it's on screen.
                loading={i === 0 ? "eager" : "lazy"}
                className={`h-full w-full object-cover object-[center_40%] ${i === index ? "animate-kenburns" : ""}`}
              />
            </div>
          ))
        ) : (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(120% 90% at 78% 8%, #9e3049 0%, transparent 55%)," +
                "radial-gradient(90% 70% at 8% 95%, #5e1628 0%, transparent 60%)," +
                "linear-gradient(160deg, #5e1628 0%, #3e0d1a 100%)",
            }}
          />
        )}

        {/* Readability overlay: dark at the bottom and on the left, behind the text. */}
        <div className="absolute inset-0 bg-gradient-to-t from-wine-deep via-wine-deep/70 to-wine-deep/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-wine-deep/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative mx-auto w-full max-w-content px-5 pb-20 pt-32 sm:px-8 md:pb-24 md:pt-36">
        <div className="max-w-3xl animate-reveal">
          <h1 className="text-[2.4rem] leading-[1.08] text-white sm:text-[3.5rem] lg:text-[4.1rem]">
            <span className="block font-sans text-[0.72rem] font-extrabold uppercase leading-normal tracking-[0.3em] text-gold-light">
              Bienvenidos
            </span>
            <span className="mt-5 block">{site.brandLine1}</span>
            <span className="mt-2 block text-[1.6rem] font-normal text-white/85 sm:text-[2.1rem]">
              {site.brandLine2}
            </span>
          </h1>

          <figure className="mt-9 border-l-2 border-gold pl-5">
            <blockquote className="font-serif text-[1.3rem] italic leading-snug text-white/90 sm:text-[1.65rem]">
              “{site.verse.text}”
            </blockquote>
            <figcaption className="mt-2 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-gold-light">
              {site.verse.reference}
            </figcaption>
          </figure>

          <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#horarios"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-4 text-[0.85rem] font-extrabold uppercase tracking-[0.14em] text-wine-deep shadow-lift transition-transform hover:-translate-y-0.5 hover:bg-gold-light"
            >
              Horarios de Misa <Icon name="arrow" size={17} />
            </a>
            <a
              href="#nosotros"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/35 px-8 py-4 text-[0.85rem] font-extrabold uppercase tracking-[0.14em] text-white transition-colors hover:border-white/70 hover:bg-white/10"
            >
              Conoce nuestro templo
            </a>
          </div>
        </div>

        {/* Carousel controls. In the flow under the buttons, not pinned to the bottom:
            on a phone the text is taller than the screen and pinned controls landed
            on top of the buttons. */}
        {count > 1 && (
          <div className="mt-12 flex items-center gap-4 md:mt-16">
            <button
              type="button" onClick={() => go(index - 1)} aria-label="Foto anterior"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
            >
              <Icon name="arrow" size={17} className="rotate-180" />
            </button>
            <div className="flex items-center gap-2">
              {heroSlides.map((s, i) => (
                <button
                  key={s.photo} type="button" onClick={() => go(i)}
                  aria-label={`Ver foto ${i + 1}${s.caption ? `: ${s.caption}` : ""}`}
                  aria-current={i === index}
                  // A bigger hit area than the visible dot, for fingers.
                  className="group p-1.5"
                >
                  <span className={`block h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-8 bg-gold" : "w-3 bg-white/45 group-hover:bg-white/80"
                  }`} />
                </button>
              ))}
            </div>
            <button
              type="button" onClick={() => go(index + 1)} aria-label="Foto siguiente"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
            >
              <Icon name="arrow" size={17} />
            </button>
            {heroSlides[index].caption && (
              <p className="ml-2 hidden text-[0.72rem] font-bold uppercase tracking-[0.16em] text-white/70 sm:block">
                {heroSlides[index].caption}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Curve that blends into the ivory of the next section. */}
      <svg
        className="absolute inset-x-0 bottom-[-1px] h-10 w-full text-ivory sm:h-14"
        viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true"
      >
        <path d="M0 60V28c240 26 480 32 720 18S1200 6 1440 24v36z" fill="currentColor" />
      </svg>
    </section>
  );
}
