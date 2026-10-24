# Sitio web — Templo Expiatorio Arquidiocesano Parroquia El Calvario

Portal informativo del **Templo Expiatorio Arquidiocesano Parroquia El Calvario**,
Masaya, Nicaragua: horarios de Misa, confesiones y dirección espiritual, sacerdotes,
grupos parroquiales, sacramentos, avisos, galería y contacto.

Es un sitio **estático** (React + Vite + Tailwind): todo se sirve desde el CDN y carga
al instante. Tiene la misma base que el sitio de la Catequesis, con la paleta del
escudo del templo: rojo vino, blanco y dorado.

---

## Cómo editar el contenido

El sitio trae un **panel de administración** (Decap CMS) que se usa de dos formas:

**En línea (la parroquia).** En **https://&lt;dirección-del-sitio&gt;/admin/** se entra con
correo y contraseña. Las cuentas se crean por invitación desde Netlify (Identity →
Invite users): llega un correo, se elige la contraseña y listo. No hace falta cuenta de
GitHub. Cada vez que se guarda, el cambio se publica solo en uno o dos minutos. Los
pasos para activarlo están en `netlify.toml`.

**En esta computadora (el desarrollador).** Dos terminales, ambas en la carpeta del
proyecto:

```bash
npm run admin     # terminal 1 — el backend del panel (déjalo corriendo)
npm run dev       # terminal 2 — el sitio
```

Y se abre **http://localhost:5173/admin/**. No pide usuario ni contraseña: lo que se
guarda escribe directo en `content/` y se publica con un `git push`. **Antes, haz
`git pull`**: la parroquia puede haber guardado cambios en línea.

| Sección del panel         | Qué cambia en la página                                         |
| ------------------------- | --------------------------------------------------------------- |
| Horarios                  | Santa Misa, confesiones y dirección espiritual                  |
| Avisos parroquiales       | La sección de avisos                                            |
| Sacerdotes                | Párroco y vicario (foto y biografía)                            |
| Grupos parroquiales       | Las tarjetas de grupos                                          |
| Sacramentos               | Descripción, requisitos y nota de cada sacramento               |
| Galería                   | El mosaico de fotos                                             |
| Configuración del sitio   | Carrusel de portada, acerca de nuestro templo, contacto, mapa y redes sociales |

### Contenido pendiente

Todo lo que se escribe **[EN MAYÚSCULAS ENTRE CORCHETES]** aparece resaltado en dorado
en la página, para que no se publique por descuido. El contenido inicial usa
`[CONTENIDO POR DEFINIR]` donde falta el dato oficial: horarios,
encuentros de los grupos, etc. Los grupos (salvo Catequesis) son **ejemplos** para
confirmar o borrar.

### Fotos

Comprímelas antes de subirlas: JPG de menos de 300–400 KB y no más de 1600 px de ancho.
Las fotos directas de la cámara hacen que la página cargue muy lento en el teléfono.

---

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera dist/
```

En Windows, si PowerShell bloquea `npm` ("running scripts is disabled"), usa
`npm.cmd install` o ejecuta una vez
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.

## Publicación

Funciona en **Vercel** (`vercel.json`) o **Netlify** (`netlify.toml`): se importa el
repositorio y se publica solo con cada `git push`. Cuando el sitio tenga su dirección
definitiva, agrégala en `index.html` (canonical y og:url) y en `public/robots.txt`.
