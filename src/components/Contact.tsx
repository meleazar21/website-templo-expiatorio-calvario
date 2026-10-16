import { contact, isPlaceholder, whatsappUrl } from "../data/site";
import { Eyebrow, Icon, Lead, Provisional, Reveal, Section, Title, type IconName } from "./ui";

/**
 * Contact. Each item becomes a link (tel:, wa.me, Google Maps) **only** when it exists;
 * while it's provisional it's shown as text, so no broken links are generated.
 */
export function Contact() {
  const socials = contact.socials.filter((r) => r.url);
  // "Día: horas", one per line. Split on ": " (with the space) so "8:30" stays whole.
  const officeHours = contact.officeHours
    .split("\n").map((l) => l.trim()).filter(Boolean)
    .map((l) => { const i = l.indexOf(": "); return i < 0 ? [l, ""] : [l.slice(0, i), l.slice(i + 2)]; });

  const details: { icon: IconName; k: string; v: string; href?: string }[] = [
    { icon: "phone", k: "Teléfono", v: contact.phone, href: isPlaceholder(contact.phone) ? undefined : `tel:+${contact.phone.replace(/\D/g, "")}` },
    { icon: "chat", k: "WhatsApp", v: contact.whatsapp || "[CONTENIDO POR DEFINIR]", href: whatsappUrl || undefined },
    { icon: "pin", k: "Dirección", v: contact.address, href: contact.mapDirectionsUrl || undefined },
    { icon: "clock", k: "Horario de oficina parroquial", v: contact.officeHours },
  ];

  return (
    <Section id="contacto" className="bg-ivory-deep">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow>Estamos para servirte</Eyebrow>
          <Title>¿Tienes alguna pregunta?</Title>
          <Lead>
            Llámanos, escríbenos por WhatsApp o visítanos en el templo. Con gusto te
            orientamos sobre los sacramentos, los horarios y la vida de la parroquia.
          </Lead>

          <dl className="mt-10 space-y-5">
            {details.map((d) => (
              <div key={d.k} className="flex gap-4">
                <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wine-soft text-wine">
                  <Icon name={d.icon} size={19} />
                </span>
                <div className="min-w-0">
                  <dt className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink-faint">{d.k}</dt>
                  <dd className="mt-1 break-words font-semibold text-wine-deep">
                    {d.k === "Horario de oficina parroquial" && officeHours.length > 1 ? (
                      <table className="mt-1 text-[0.95rem]">
                        <tbody>
                          {officeHours.map(([day, hours]) => (
                            <tr key={day}>
                              <th scope="row" className="py-0.5 pr-4 text-left font-semibold text-wine-deep">{day}</th>
                              <td className={`py-0.5 tabular-nums ${/cerrad/i.test(hours) ? "font-medium text-ink-faint" : "font-semibold text-wine-deep"}`}>
                                {hours}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : d.href ? (
                      <a
                        href={d.href}
                        {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="transition-colors hover:text-gold"
                      >
                        {d.v}
                      </a>
                    ) : (
                      <Provisional text={d.v} />
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>

          {socials.length > 0 && (
            <div className="mt-8 flex gap-4">
              {/* Spacer the width of the icons above, so the label lines up with the
                  other labels in the list. */}
              <span className="w-10 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.14em] text-ink-faint">Síguenos</p>
                {/* Round buttons with only the logo, like the footer's and the groups'. */}
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {socials.map((r) => (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${r.name} de la parroquia`}
                      title={r.name}
                      style={{ background: r.background }}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white shadow-card transition-transform hover:-translate-y-0.5"
                    >
                      <Icon name={r.icon} size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Reveal>

        <Reveal delay={110}>
          {contact.mapEmbedUrl ? (
            <iframe
              src={contact.mapEmbedUrl}
              title="Ubicación del templo"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full min-h-[22rem] w-full rounded-2xl border border-wine/[0.08] shadow-card"
            />
          ) : (
            <div className="flex h-full min-h-[22rem] flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-wine/20 bg-white/60 p-8 text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-wine-soft text-wine">
                <Icon name="pin" size={26} />
              </span>
              <p className="font-serif text-[1.25rem] text-wine-deep">Ubicación del templo</p>
              <p className="max-w-xs text-[0.88rem] leading-relaxed text-ink-soft">
                Aquí se mostrará el mapa. Para activarlo, busca el templo en Google Maps y
                pega en el panel la dirección que aparece en la barra del navegador. Los
                enlaces cortos de “Compartir” no sirven: Google no permite incrustarlos.
              </p>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}
