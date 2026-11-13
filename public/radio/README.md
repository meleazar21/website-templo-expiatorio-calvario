# Radio La Voz del Calvario — Versión 5

Aplicación web progresiva (PWA) de la Parroquia El Calvario de Masaya, con diseño en tonos granate/dorado, reproductor de audio, información de pistas cuando Zeno la publique, historial local y enlaces oficiales.

## Configuración pública confirmada

- **Nombre mostrado en la aplicación:** `Radio La Voz del Calvario`.
- **URL de audio para oyentes** (enviada por la parroquia): `https://stream.zeno.fm/xtwg2arx6hhvv`.
- **Punto de montaje del encoder** (captura Broadcast Settings): `g8nayarx6hhvv/source`. El nombre antes de `/source` es `g8nayarx6hhvv`.
- **Metadatos principal** (deducido del punto de montaje): `https://api.zeno.fm/mounts/metadata/subscribe/g8nayarx6hhvv`.
- **Metadatos alternativos** (deducidos de la URL de escucha): `https://api.zeno.fm/mounts/metadata/subscribe/xtwg2arx6hhvv`.

El reproductor **utiliza siempre la URL de audio confirmada**. La consulta de metadatos es independiente y prueba el canal alternativo si no obtiene ninguna pista en los primeros 18 segundos o se produce un error en el canal principal. No se ha podido comprobar en este entorno qué canal publica datos válidos en tiempo real. Si no hay títulos, la app lo indica, sin inventarlos.

## Nombre e identidad visual

La interfaz y el nombre instalable se identifican exclusivamente como **Radio La Voz del Calvario**. El nombre alternativo que pueda mostrar Zeno.FM en su propio portal no se utiliza en la aplicación. El logotipo se obtiene de `https://www.templo-expiatorio-calvario.com/logo.webp` y los iconos de respaldo se suministran dentro del paquete.

## Redes sociales y contacto

- [Sitio parroquial](https://www.templo-expiatorio-calvario.com/)
- [Facebook](https://www.facebook.com/ParroquiaElCalvarioMasaya/)
- [Instagram](https://www.instagram.com/parroquiaelcalvariomasaya?igsh=YWg1c3pxOW1reXhm)
- [TikTok](https://www.tiktok.com/@temploexpiatoriocalvario?_r=1&_t=ZM-921aURTQYl1)
- [WhatsApp](https://wa.me/50583525200)

## Probar localmente

Desde la carpeta que contiene `index.html`, ejecuta:

```bash
python3 -m http.server 8080
```

Abre `http://localhost:8080/` en tu navegador y pulsa Reproducir. Para comprobar metadatos, revisa «Sonando ahora» mientras el encoder transmite títulos. Si hay una locución o Zeno no envía títulos, la pantalla permanecerá a la espera.

## Publicar e instalar

Sube la **carpeta completa** al hosting con HTTPS, por ejemplo como ruta `/radio/` de la web parroquial. Los certificados HTTPS son necesarios para instalar la aplicación como PWA (excepto durante pruebas en localhost). Al publicarla, usa la opción de **Instalar** o **Añadir a pantalla de inicio** de tu navegador. No es un archivo APK compilado.

La configuración es **estática** y está definida en `config.js`. No existen controles de configuración para los oyentes.

## Advertencia de seguridad

La captura compartida anteriormente mostraba una contraseña de montaje del encoder. Es aconsejable **cambiarla (Reset) en Zeno.FM** y configurarla de nuevo únicamente en AirLink u otro encoder. No la pongas en ningún archivo de la PWA. Este paquete no contiene contraseñas.

## Estructura

- `index.html`: interfaz de usuario.
- `config.js`: marca, audio, URL principal/alternativa de metadatos y redes.
- `assets/app.js`: motor de audio, SSE, historial, controles del sistema y eventos.
- `assets/style.css`: estética y disposición adaptable.
- `manifest.webmanifest`: instalación de la PWA.
- `sw.js`: archivos de interfaz disponibles sin conexión; **nunca audio ni metadatos**.
- `icons/`: recursos visuales para instalación.

La señal del audio requiere acceso activo a Internet y un stream válido. El acceso SSE depende de la política de red de Zeno.FM/CORS del navegador.

## Cambios solicitados en la versión 5

- Se retiró el enlace público a Zeno.FM de los accesos de contacto, sin afectar la reproducción del audio ni la consulta de metadatos.
- Los cinco accesos restantes se distribuyen en dos columnas y el enlace al sitio web ocupa el ancho de la última fila; en móviles se muestran en una columna.
- Se eliminó la configuración editable por los oyentes (botón, ventana y personalización local).
- El eslogan ahora es **«Vive la fe, donde quiera que estés»**.
- El logotipo y nombre en el encabezado conducen al sitio oficial de la parroquia.

## Publicación paso a paso (hosting existente)

No reemplaces los archivos de la página parroquial principal. Crea una subcarpeta `/radio/` bajo la raíz pública (`DocumentRoot`) del sitio `www.templo-expiatorio-calvario.com`.

1. Descomprime el ZIP y abre la carpeta `radio-la-voz-del-calvario/`.
2. Desde el administrador de archivos del hosting, abre la raíz pública del dominio (p. ej., `public_html`, `wwwroot` o la indicada en la configuración del sitio).
3. Crea `radio` y sube **el contenido** de la carpeta descomprimida allí, conservando `assets/`, `icons/`, `index.html`, `config.js`, `manifest.webmanifest` y `sw.js` en su estructura original.
4. Comprueba `https://www.templo-expiatorio-calvario.com/radio/`. El certificado SSL/TLS debe ser válido para el sitio; no se instala la PWA desde un sitio HTTP ordinario.
5. Prueba el botón de reproducción, los cinco enlaces y el módulo «Sonando ahora» mientras exista transmisión y se envíen metadatos desde el encoder.

**Ejemplo desde una terminal Linux** (sustituye `RUTA_DOCUMENTROOT` por la ruta real de tu dominio):

```bash
unzip radio-la-voz-del-calvario-movil-v5.zip
sudo mkdir -p RUTA_DOCUMENTROOT/radio
sudo cp -a radio-la-voz-del-calvario/. RUTA_DOCUMENTROOT/radio/
```

Si usas Apache, puedes identificar la raíz publicada con:

```bash
sudo apachectl -S
sudo grep -R 'DocumentRoot' /etc/apache2/sites-enabled/
```

Si ya publicaste una versión anterior en `/radio/`, sustituye sus archivos por los de esta versión manteniendo la misma dirección; `sw.js` incluye una nueva versión de caché para distribuir la actualización. Comprueba permisos de lectura del usuario del servidor y no subas ninguna contraseña de Zeno.FM a estos archivos públicos.

## Instalar en dispositivos móviles

- **Android / Chrome:** abre la URL HTTPS de la app, pulsa el menú ⋮ y elige **Instalar aplicación** o **Añadir a pantalla principal**; confirma. También puedes pulsar «Instalar aplicación» en la pantalla de la radio si el navegador ofrece la instalación.
- **iPhone / Safari:** abre la URL HTTPS en Safari, toca **Compartir** (puede estar dentro del menú de la página), elige **Añadir a pantalla de inicio**, activa **Abrir como app** si aparece, y confirma con **Añadir**.

La app instalable es una **PWA**, no un archivo APK de Android ni una app nativa de la App Store. El streaming y la lectura de títulos requieren conexión a Internet y que Zeno.FM publique el audio/metadatos.
