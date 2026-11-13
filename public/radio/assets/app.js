/*
 * RADIO LA VOZ DEL CALVARIO — motor del reproductor (sin frameworks)
 *
 * PIEZAS PRINCIPALES:
 * 1. Configuración estática: lee los valores publicados en config.js.
 * 2. Audio HTML5: reproduce directamente el stream de Zeno por HTTPS.
 * 3. Metadatos: escucha Server-Sent Events (SSE) de la API oficial Zeno.
 * 4. Historial: registra solo pistas observadas durante ESTA sesión.
 * 5. Media Session: integra controles multimedia del navegador/SO compatible.
 * 6. Enlaces sociales y PWA: comparten, instalan y abren enlaces autorizados.
 *
 * La pista que se muestra es la que REPORTA Zeno; la app no identifica
 * acústicamente el audio. Si la fuente no publica metadatos, no se inventan.
 */
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const audio = $('radioAudio');
  const appDefaults = Object.freeze({
    name: 'Radio La Voz del Calvario',
    subtitle: 'Una voz de fe y esperanza',
    streamUrl: '', mountPoint: '', metadataUrl: '', metadataFallbackUrl: '',
    websiteUrl: '', facebookUrl: '', instagramUrl: '', tiktokUrl: '', whatsappUrl: '', logoUrl: ''
  });
  const config = { ...appDefaults, ...(window.RADIO_CONFIG || {}) };
  let metadataEvents = null;
  let metadataFallbackTimer = null;
  let currentTrack = null;
  let recentTracks = [];
  let toastTimer = null;
  let deferredInstallPrompt = null;
  let userWantsPlay = false;

  // Las URL reciben validación explícita: nunca se utiliza javascript: ni data:.
  function safeHttpUrl(raw, httpsOnly = false) {
    if (typeof raw !== 'string' || !raw.trim()) return '';
    try {
      const u = new URL(raw.trim());
      if (u.protocol === 'https:' || (!httpsOnly && u.protocol === 'http:')) return u.toString();
    } catch (_) { /* se informa de la URL no válida al guardar */ }
    return '';
  }

  // El número de WhatsApp también se admite en formato internacional (+505...).
  function whatsappUrl(raw) {
    if (!raw || !raw.trim()) return '';
    const input = raw.trim();
    if (/^[+\d\s()\-]+$/.test(input)) {
      const digits = input.replace(/\D/g, '');
      return /^\d{8,15}$/.test(digits) ? `https://wa.me/${digits}` : '';
    }
    return safeHttpUrl(input);
  }

  // El mount point es el ID de stream.zeno.fm/ID, no el /radio/SLUG público.
  function inferMountPoint(streamUrl) {
    try {
      const url = new URL(streamUrl);
      if (url.hostname.toLowerCase() !== 'stream.zeno.fm') return '';
      const segment = url.pathname.split('/').filter(Boolean)[0] || '';
      return /^[A-Za-z0-9_-]{4,100}$/.test(segment) ? segment : '';
    } catch (_) { return ''; }
  }
  function metadataEndpoint() {
    if (config.metadataUrl) return safeHttpUrl(config.metadataUrl, true);
    const mount = (config.mountPoint || '').trim().replace(/\/source\/?$/, '').replace(/^\/+|\/+$/g, '') || inferMountPoint(config.streamUrl);
    if (!/^[A-Za-z0-9_-]{4,100}$/.test(mount)) return '';
    return `https://api.zeno.fm/mounts/metadata/subscribe/${encodeURIComponent(mount)}`;
  }

  function toast(message) {
    const el = $('toast');
    el.textContent = message;
    el.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => el.classList.remove('visible'), 3300);
  }

  function setPlaybackState(label, sublabel, state = 'idle') {
    $('playStatus').textContent = label;
    $('playDescription').textContent = sublabel;
    const isPlaying = state === 'playing';
    $('radioArt').classList.toggle('is-playing', isPlaying);
    $('liveDot').classList.toggle('live', isPlaying);
    $('playButton').setAttribute('aria-label', isPlaying ? 'Detener la radio' : 'Reproducir radio');
    $('playButton').setAttribute('aria-pressed', String(isPlaying));
    $('playIcon').innerHTML = isPlaying
      ? '<rect x="10" y="7" width="5" height="18" rx="1" fill="currentColor" stroke="none"/><rect x="18" y="7" width="5" height="18" rx="1" fill="currentColor" stroke="none"/>'
      : '<path d="m12 7 14 9-14 9V7Z" fill="currentColor" stroke="none"/>';
    if ('mediaSession' in navigator) navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }

  // Se descarta la conexión al parar: al reiniciar se retoma el DIRECTO, no un audio antiguo.
  function stopStream() {
    userWantsPlay = false;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    setPlaybackState(config.streamUrl ? 'Listo para escuchar' : 'Emisora sin configurar',
      config.streamUrl ? 'Pulsa reproducir para sintonizar' : 'Agrega el enlace de Zeno.FM para escuchar');
  }

  async function startStream() {
    const url = safeHttpUrl(config.streamUrl, true);
    if (!url) {
      toast('La señal de la radio no está disponible.');
      return;
    }
    userWantsPlay = true;
    if (audio.src !== url) { audio.src = url; audio.load(); }
    setPlaybackState('Conectando...', 'Sintonizando la transmisión de Zeno.FM', 'loading');
    try {
      await audio.play();
      if (userWantsPlay) setPlaybackState('Escuchando en vivo', 'Conectado a la radio por internet', 'playing');
    } catch (err) {
      if (!userWantsPlay) return;
      console.error('Error de reproducción:', err);
      userWantsPlay = false;
      setPlaybackState('No se pudo reproducir', 'Verifica el enlace de audio y tu conexión');
      toast('No fue posible reproducir el audio. Verifica la URL directa.');
    }
  }

  $('playButton').addEventListener('click', () => {
    if (userWantsPlay) stopStream();
    else startStream();
  });
  audio.addEventListener('playing', () => { if (userWantsPlay) setPlaybackState('Escuchando en vivo', 'Conectado a la radio por internet', 'playing'); });
  audio.addEventListener('waiting', () => { if (userWantsPlay) setPlaybackState('Cargando audio...', 'Esperando datos de la transmisión', 'loading'); });
  audio.addEventListener('stalled', () => { if (userWantsPlay) setPlaybackState('Señal interrumpida', 'Intentando recuperar la conexión', 'loading'); });
  audio.addEventListener('error', () => {
    if (!userWantsPlay) return;
    userWantsPlay = false;
    setPlaybackState('Error de transmisión', 'Comprueba que la URL sea un stream de audio HTTPS');
  });
  audio.addEventListener('volumechange', () => {
    $('volumeSlider').value = String(Math.round(audio.volume * 100));
    $('volumeValue').textContent = `${Math.round(audio.volume * 100)}%`;
    $('muteButton').classList.toggle('is-muted', audio.muted || audio.volume === 0);
    $('muteButton').setAttribute('aria-label', audio.muted || audio.volume === 0 ? 'Activar sonido' : 'Silenciar');
  });
  $('volumeSlider').addEventListener('input', (event) => {
    audio.volume = Number(event.target.value) / 100;
    audio.muted = false;
  });
  $('muteButton').addEventListener('click', () => { audio.muted = !audio.muted; });

// Zeno puede publicar {streamTitle: 'Artista - Título'} o bien
// {metadata: {current: {title: 'Artista - Título'}}} según la versión.
// El reconocimiento NO se hace acústicamente: se muestran datos publicados.
function parseTrack(payload) {
  let data;
  try { data = JSON.parse(payload); } catch (_) { data = payload; }
  if (data && typeof data === 'object' && data.data) data = data.data;
  let title = '';
  let artist = '';
  let rawTitle = '';
  if (typeof data === 'string') rawTitle = data;
  else if (data && typeof data === 'object') {
    const current = data.metadata?.current || data.now_playing?.song || data.current || {};
    // streamTitle es el formato SSE tradicional de Zeno.
    if (typeof data.streamTitle === 'string' && data.streamTitle.trim()) rawTitle = data.streamTitle;
    // En otros canales recientes, el título está en metadata.current.title.
    else if (typeof current.text === 'string') rawTitle = current.text;
    else if (typeof current.title === 'string') rawTitle = current.title;
    else if (typeof data.title === 'string') rawTitle = data.title;
    else if (typeof data.song === 'string') rawTitle = data.song;
    artist = typeof current.artist === 'string' ? current.artist
      : typeof data.artist === 'string' ? data.artist : '';
  }
  if (rawTitle) {
    rawTitle = rawTitle.trim();
    // 'Artista - Canción' se separa solo cuando no viene artista por separado.
    const at = rawTitle.indexOf(' - ');
    if (!artist && at > 0 && at < rawTitle.length - 3) {
      artist = rawTitle.slice(0, at).trim();
      title = rawTitle.slice(at + 3).trim();
    } else title = rawTitle;
  }
  title = title.trim().slice(0, 180);
  artist = artist.trim().slice(0, 120);
  if (!title) return null;
  return { title, artist, detectedAt: new Date() };
}

  function updateMediaSession(track) {
    if (!('mediaSession' in navigator) || !('MediaMetadata' in window)) return;
    try {
      const iconUrl = safeHttpUrl(config.logoUrl, true) || new URL('./icons/icon-512.png', window.location.href).href;
      const iconType = /\.webp(?:[?#]|$)/i.test(iconUrl) ? 'image/webp' : /\.jpe?g(?:[?#]|$)/i.test(iconUrl) ? 'image/jpeg' : 'image/png';
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track?.title || config.name,
        artist: track?.artist || config.subtitle,
        album: config.name,
        artwork: [{ src: iconUrl, sizes: iconUrl.includes('/icons/') ? '512x512' : 'any', type: iconType }]
      });
    } catch (err) { console.warn('Media Session:', err); }
  }
  function renderHistory() {
    const list = $('historyList');
    list.replaceChildren();
    $('historyCount').textContent = `${recentTracks.length} ${recentTracks.length === 1 ? 'pista' : 'pistas'}`;
    if (!recentTracks.length) {
      const li = document.createElement('li');
      li.className = 'history-empty';
      li.textContent = 'Las canciones se registrarán mientras tengas abierta la aplicación.';
      list.append(li);
      return;
    }
    recentTracks.slice(0, 5).forEach((song, i) => {
      const li = document.createElement('li');
      const index = document.createElement('span'); index.className = 'history-index'; index.textContent = String(i + 1).padStart(2, '0');
      const info = document.createElement('span'); info.className = 'history-track';
      const name = document.createElement('strong'); name.textContent = song.title;
      const artist = document.createElement('small'); artist.textContent = song.artist || 'Radio en vivo';
      const time = document.createElement('time'); time.className = 'history-time';
      time.dateTime = song.detectedAt.toISOString();
      time.textContent = song.detectedAt.toLocaleTimeString('es-NI', { hour: '2-digit', minute: '2-digit' });
      info.append(name, artist); li.append(index, info, time); list.append(li);
    });
  }
  function showTrack(next) {
    if (currentTrack && next.title === currentTrack.title && next.artist === currentTrack.artist) return;
    if (currentTrack) recentTracks.unshift(currentTrack);
    recentTracks = recentTracks.slice(0, 5);
    currentTrack = next;
    $('trackTitle').textContent = next.title;
    $('trackArtist').textContent = next.artist || 'Artista no informado';
    $('metadataNote').textContent = 'Título actualizado desde Zeno.FM. Los datos dependen de lo que envía la emisora.';
    $('metadataStatus').classList.add('is-connected');
    renderHistory();
    updateMediaSession(next);
  }
  function resetTracks() {
    currentTrack = null; recentTracks = [];
    $('trackTitle').textContent = 'Esperando señal...';
    $('trackArtist').textContent = 'Los metadatos aparecerán aquí';
    renderHistory();
    updateMediaSession(null);
  }

  /**
   * Suscripción de metadatos:
   * 1) Priorizar el ID del encoder, obtenido en Broadcast Settings.
   * 2) Si falla/no publica una pista tras 18 s, probar ID de escucha.
   * 3) El stream de audio sigue separado y NO depende de esta consulta.
   * 4) No mostrar información inventada cuando Zeno omite la pista.
   */
  function connectMetadata() {
    $('metadataStatus').classList.remove('is-connected');
    if (metadataEvents) { metadataEvents.close(); metadataEvents = null; }
    if (metadataFallbackTimer) { clearTimeout(metadataFallbackTimer); metadataFallbackTimer = null; }
    const primaryUrl = metadataEndpoint();
    const alternateUrl = safeHttpUrl(config.metadataFallbackUrl, true);
    const endpoints = [primaryUrl, alternateUrl].filter((url, index, all) => url && all.indexOf(url) === index);
    if (!endpoints.length) {
      $('metadataNote').textContent = 'No hay una dirección de metadatos configurada.';
      return;
    }
    if (!('EventSource' in window)) {
      $('metadataNote').textContent = 'Este navegador no permite consultar metadatos en tiempo real.';
      return;
    }
    let isMatched = false;
    let activeIndex = 0;
    function useEndpoint(index) {
      if (metadataEvents) { metadataEvents.close(); metadataEvents = null; }
      if (metadataFallbackTimer) { clearTimeout(metadataFallbackTimer); metadataFallbackTimer = null; }
      activeIndex = index;
      $('metadataStatus').classList.remove('is-connected');
      $('metadataNote').textContent = index === 0
        ? 'Consultando metadatos de Zeno.FM...'
        : 'Probando la fuente alternativa de metadatos de Zeno.FM...';
      const es = new EventSource(endpoints[index]);
      metadataEvents = es;
      // El canal puede abrirse sin entregar un título (por ejemplo, en una locución).
      // En ese caso la fuente alternativa se prueba una sola vez.
      if (index === 0 && endpoints.length > 1) {
        metadataFallbackTimer = window.setTimeout(() => {
          if (!isMatched && metadataEvents === es) useEndpoint(1);
        }, 18000);
      }
      es.onmessage = event => {
        if (metadataEvents !== es) return;
        const track = parseTrack(event.data);
        if (track) {
          isMatched = true;
          if (metadataFallbackTimer) { clearTimeout(metadataFallbackTimer); metadataFallbackTimer = null; }
          showTrack(track);
        } else if (!isMatched) {
          $('metadataNote').textContent = 'Conectado a Zeno.FM; esperando que la emisora publique el título de una pista.';
        }
      };
      es.onopen = () => {
        if (metadataEvents !== es) return;
        $('metadataStatus').classList.add('is-connected');
        if (!isMatched) $('metadataNote').textContent = 'Conectado a Zeno.FM. Esperando información de la pista actual.';
      };
      es.onerror = () => {
        if (metadataEvents !== es) return;
        $('metadataStatus').classList.remove('is-connected');
        if (!isMatched && activeIndex === 0 && endpoints.length > 1) {
          useEndpoint(1);
          return;
        }
        $('metadataNote').textContent = isMatched
          ? 'Reconectando los metadatos; la transmisión puede seguir reproduciéndose.'
          : 'No hay títulos disponibles por ahora. Comprueba que el encoder envíe metadatos a Zeno.FM.';
      };
    }
    useEndpoint(0);
  }

  function setSocialLink(id, rawUrl) {
    const el = $(id);
    const url = id === 'whatsappLink' ? whatsappUrl(rawUrl) : safeHttpUrl(rawUrl);
    if (!url) {
      el.removeAttribute('href'); el.removeAttribute('target'); el.removeAttribute('rel');
      el.classList.add('is-disabled'); el.setAttribute('aria-disabled', 'true'); el.tabIndex = -1;
    } else {
      el.href = url; el.target = '_blank'; el.rel = 'noopener noreferrer';
      el.classList.remove('is-disabled'); el.removeAttribute('aria-disabled'); el.tabIndex = 0;
    }
  }
  function updateBranding() {
    const name = config.name.trim() || appDefaults.name;
    $('headerName').textContent = name;
    $('playerStationName').textContent = name;
    $('footerName').textContent = name;
    $('stationSubtitle').textContent = config.subtitle.trim() || 'La compañía de la fe, la palabra y la música. Dondequiera que estés.';
    document.title = `${name} | Radio en vivo`;
    const logo = safeHttpUrl(config.logoUrl, true);
    $('mainStationLogo').src = logo || './icons/icon-512.png';
    $('headerIcon').src = logo || './icons/icon-192.png';
    setSocialLink('whatsappLink', config.whatsappUrl);
    setSocialLink('facebookLink', config.facebookUrl);
    setSocialLink('instagramLink', config.instagramUrl);
    setSocialLink('tiktokLink', config.tiktokUrl);
    setSocialLink('websiteLink', config.websiteUrl);
    $('year').textContent = String(new Date().getFullYear());
  }
  $('mainStationLogo').addEventListener('error', () => { $('mainStationLogo').src = './icons/icon-512.png'; });
  $('headerIcon').addEventListener('error', () => { $('headerIcon').src = './icons/icon-192.png'; });

  // Compartir la dirección de la aplicación, sin enlazar a la página pública de Zeno.FM.
  $('shareButton').addEventListener('click', async () => {
    const url = window.location.href;
    const data = { title: config.name, text: `Escucha ${config.name} en vivo`, url };
    if (navigator.share) {
      try { await navigator.share(data); return; }
      catch (err) { if (err.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url); toast('Enlace copiado para compartir.'); }
    catch (_) { toast(`Comparte este enlace: ${url}`); }
  });

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); deferredInstallPrompt = event;
  });
  window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; toast('Aplicación instalada.'); });
  $('installButton').addEventListener('click', async () => {
    if (deferredInstallPrompt) {
      const prompt = deferredInstallPrompt; deferredInstallPrompt = null;
      await prompt.prompt();
      return;
    }
    toast('Para instalar: abre el menú de tu navegador y elige “Instalar app” o “Añadir a pantalla de inicio”.');
  });

  // Controles en pantalla bloqueada / auriculares, donde el navegador los soporte.
  if ('mediaSession' in navigator) {
    try {
      navigator.mediaSession.setActionHandler('play', () => { void startStream(); });
      navigator.mediaSession.setActionHandler('pause', stopStream);
      navigator.mediaSession.setActionHandler('stop', stopStream);
    } catch (_) { /* algunos navegadores implementan solo parte de Media Session */ }
  }
  window.addEventListener('offline', () => {
    if (userWantsPlay) setPlaybackState('Sin conexión a Internet', 'La señal regresará cuando haya conectividad');
  });
  window.addEventListener('online', () => {
    if (userWantsPlay) { stopStream(); toast('Conexión restaurada. Pulsa reproducir para sintonizar.'); }
  });
  window.addEventListener('pagehide', () => {
    if (metadataEvents) metadataEvents.close();
    if (metadataFallbackTimer) clearTimeout(metadataFallbackTimer);
  });

  // Service worker solo almacena la interfaz, NUNCA el stream ni la API.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(err => console.warn('PWA:', err)));
  }

  // Inicialización.
  audio.volume = 0.85;
  updateBranding();
  resetTracks();
  connectMetadata();
  setPlaybackState(config.streamUrl ? 'Listo para escuchar' : 'Emisora sin configurar',
    config.streamUrl ? 'Pulsa reproducir para sintonizar' : 'Agrega el enlace de Zeno.FM para escuchar');
})();
