import { contact, isPlaceholder, navigation, site } from "../data/site";
import { Icon } from "./ui";

export function Footer() {
  const year = new Date().getFullYear();
  const socials = contact.socials.filter((r) => r.url);

  return (
    <footer className="bg-wine-deep text-white">
      <div className="mx-auto max-w-content px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          {/* Identity */}
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-14 w-14 object-contain" />
              <div className="leading-tight">
                <p className="font-serif text-[1.25rem]">{site.brandLine1}</p>
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-gold-light">
                  {site.brandLine2}
                </p>
              </div>
            </div>
            <p className="mt-6 text-[0.92rem] leading-relaxed text-white/70">
              {contact.address}
              <br />
              {site.city}
              {!isPlaceholder(contact.phone) && (
                <>
                  <br />
                  <a href={`tel:+${contact.phone.replace(/\D/g, "")}`} className="transition-colors hover:text-white">
                    {contact.phone}
                  </a>
                </>
              )}
            </p>
            <p className="mt-6 border-l-2 border-gold pl-4 font-serif text-[1.1rem] italic text-white/85">
              {site.motto}
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Pie de página">
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-gold-light">
              Secciones
            </p>
            <ul className="mt-5 space-y-2.5">
              {navigation.map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    className="text-[0.92rem] text-white/70 transition-colors hover:text-white"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Social networks */}
          <div>
            <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-gold-light">
              Síguenos
            </p>
            {socials.length > 0 ? (
              /* Round buttons instead of a list of names: an icon is recognized at a
                 glance and takes less room in a footer that's already busy. */
              <ul className="mt-5 flex flex-wrap gap-3">
                {socials.map((r) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={r.name}
                      title={r.name}
                      style={{ background: r.background }}
                      /* The faint white ring lifts TikTok's circle off the footer's
                         blue; it's nearly black and would get lost otherwise. */
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white ring-1 ring-inset ring-white/25 transition-transform hover:-translate-y-0.5"
                    >
                      <Icon name={r.icon} size={19} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-[0.88rem] text-white/45">
                Enlaces de redes sociales por definir.
              </p>
            )}

            <a
              href="#horarios"
              className="mt-8 inline-block rounded-full bg-gold px-6 py-3 text-[0.78rem] font-extrabold uppercase tracking-[0.13em] text-wine-deep transition-colors hover:bg-gold-light"
            >
              Horarios de Misa
            </a>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.12] pt-7 text-center text-[0.8rem] text-white/45">
          © {year} {site.brand}
        </div>
      </div>
    </footer>
  );
}
