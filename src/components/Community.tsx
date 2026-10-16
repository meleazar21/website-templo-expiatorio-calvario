import { useState } from "react";
import { community } from "../data/site";
import { Eyebrow, Icon, Lead, Lightbox, PhotoPlaceholder, Provisional, Reveal, Section, Title } from "./ui";

/** About the temple: what the expiatory temple is and what it is for, under "Nosotros". */
export function Community() {
  const [enlarged, setEnlarged] = useState(false);

  return (
    <Section id="nosotros">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <Eyebrow>Conócenos</Eyebrow>
          <Title>{community.title}</Title>
          {community.paragraphs.map((p, i) => (
            <Lead key={i}><Provisional text={p} /></Lead>
          ))}
          <a
            href="#horarios"
            className="mt-8 inline-flex items-center gap-2 text-[0.82rem] font-extrabold uppercase tracking-[0.14em] text-wine transition-colors hover:text-gold"
          >
            Ver horarios <Icon name="arrow" size={16} />
          </a>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative">
            {community.photo ? (
              <button
                type="button" onClick={() => setEnlarged(true)}
                aria-label={`Ver en grande: ${community.title}`} title="Ver la imagen en grande"
                className="group block w-full cursor-zoom-in overflow-hidden rounded-2xl shadow-card"
              >
                {/* Its own proportions, not a fixed frame: a group photo cropped to 4:3
                    lost the people at both ends. */}
                <img src={community.photo} alt={community.title} loading="lazy"
                  className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]" />
              </button>
            ) : (
              <PhotoPlaceholder label="La comunidad reunida en el templo"
                className="aspect-[4/3] w-full rounded-2xl shadow-card" />
            )}
            {/* Gold corner rule: a discreet detail, without heavy iconography. */}
            <div className="pointer-events-none absolute -bottom-3 -right-3 hidden h-24 w-24 rounded-br-2xl border-b-2 border-r-2 border-gold/60 sm:block" />
          </div>
        </Reveal>
      </div>

      {enlarged && community.photo && (
        <Lightbox src={community.photo} alt={community.title} onClose={() => setEnlarged(false)} />
      )}
    </Section>
  );
}
