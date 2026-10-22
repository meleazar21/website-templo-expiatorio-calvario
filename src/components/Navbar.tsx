import { useEffect, useState } from "react";
import { navigation, site } from "../data/site";
import { Icon } from "./ui";

/**
 * Fixed bar. Over the hero it's transparent and, once you scroll, it turns solid: that
 * way the hero's white text stays readable and the rest of the page keeps its contrast.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // With the menu open, the background must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-ivory/95 shadow-[0_1px_0_rgba(122,31,53,0.08)] backdrop-blur" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-2 sm:px-8">
        <a href="#inicio" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          {/* The crest is the star: it grows with the screen width and shrinks a bit on
              scroll so the bar doesn't take up half the screen. */}
          <img
            src="/logo.webp"
            alt={site.brand}
            className={`w-auto object-contain transition-all duration-300 ${
              /* On the phone the crest gives up some size: it now shares the bar with
                 the name, where before it had the bar to itself. */
              solid ? "h-12 sm:h-[4.5rem]" : "h-14 sm:h-24"
            }`}
          />
          {/* The name shows on the phone too: with only the crest and the menu button,
              the bar didn't say whose site this is. On small screens the second line
              wraps onto two lines instead of shrinking until it's unreadable. */}
          <span className="block leading-tight">
            <span className={`block font-serif text-[0.98rem] font-semibold sm:text-[1.15rem] ${solid ? "text-wine-deep" : "text-white"}`}>
              {site.brandLine1}
            </span>
            <span className={`block text-[0.58rem] font-bold uppercase leading-snug tracking-[0.1em] sm:whitespace-nowrap sm:text-[0.64rem] sm:tracking-[0.14em] ${solid ? "text-gold" : "text-gold-light"}`}>
              {site.brandLine2}
            </span>
          </span>
        </a>

        <span className="flex-1" />

        {/* Desktop */}
        <ul className="hidden items-center gap-0.5 xl:flex">
          {navigation.map((n) => (
            <li key={n.id}>
              <a
                href={`#${n.id}`}
                className={`rounded-lg px-2.5 py-2 text-[0.78rem] font-bold uppercase tracking-[0.06em] transition-colors ${
                  solid ? "text-ink-soft hover:bg-wine-soft hover:text-wine" : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="#horarios"
          className="ml-2 hidden shrink-0 rounded-full bg-gold px-5 py-2.5 text-[0.78rem] font-extrabold uppercase tracking-[0.1em] text-wine-deep shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-gold-light 2xl:inline-block"
        >
          Horarios de Misa
        </a>

        {/* Mobile */}
        <button
          type="button"
          className={`rounded-lg p-2 xl:hidden ${solid ? "text-wine" : "text-white"}`}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-wine/10 bg-ivory xl:hidden">
          <ul className="mx-auto max-w-content px-5 py-3">
            {navigation.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  onClick={() => setOpen(false)}
                  className="block border-b border-wine/5 py-3.5 text-[0.95rem] font-bold uppercase tracking-[0.1em] text-wine"
                >
                  {n.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <a
                href="#horarios"
                onClick={() => setOpen(false)}
                className="block rounded-full bg-gold px-5 py-3.5 text-center text-[0.9rem] font-extrabold uppercase tracking-[0.12em] text-wine-deep"
              >
                Horarios de Misa
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
