/* Reproductor independiente para iframe. Reutiliza config.js de la PWA v5. */
(() => {
  'use strict';
  const config = window.RADIO_CONFIG || {};
  const audio = document.getElementById('audio');
  const play = document.getElementById('play');
  const mute = document.getElementById('mute');
  const vol = document.getElementById('volume');
  const out = document.getElementById('volumeValue');
  const status = document.getElementById('state');
  const desc = document.getElementById('description');
  const playSvg = document.getElementById('playSvg');
  const streamUrl = config.streamUrl || 'https://stream.zeno.fm/xtwg2arx6hhvv';
  const playIcon = '<path d="M11 6 L26 16 L11 26 Z"/>';
  const pauseIcon = '<rect x="10" y="7" width="4" height="18" rx="1"/><rect x="19" y="7" width="4" height="18" rx="1"/>';
  let requested = false;
  let previousVolume = .85;
  audio.volume = .85;
  const setText = (main, sub) => {status.textContent=main;desc.textContent=sub;};
  const render = () => {
    playSvg.innerHTML = requested ? pauseIcon : playIcon;
    play.setAttribute('aria-label',requested?'Pausar la radio':'Reproducir la radio');
    play.setAttribute('aria-pressed', String(requested));
    mute.setAttribute('aria-pressed', String(audio.muted));
    mute.setAttribute('aria-label',audio.muted?'Activar sonido':'Silenciar');
  };
  play.addEventListener('click', async () => {
    if (requested) {
      requested=false;
      audio.pause();
      setText('Radio en pausa', 'Pulsa reproducir para continuar');
      render();
      return;
    }
    requested=true;
    render();
    setText('Conectando con la radio…', 'Estableciendo la señal en directo');
    if (!audio.src) audio.src = streamUrl;
    try { await audio.play(); }
    catch (err) {
      // Un enlace inválido o bloqueo de red no debe mantener el botón en estado de reproducción.
      if (!requested) return;
      requested=false;
      setText('No se pudo reproducir', 'Comprueba la conexión y vuelve a pulsar');
      render();
    }
  });
  audio.addEventListener('playing', () => {
    if (requested) setText('Escuchando en vivo', 'Conectado a la radio por internet');
  });
  audio.addEventListener('waiting', () => {
    if (requested) setText('Cargando señal…', 'Esperando audio de Zeno.FM');
  });
  audio.addEventListener('stalled', () => {
    if (requested) setText('Señal interrumpida', 'Intentando recuperar la transmisión');
  });
  audio.addEventListener('error', () => {
    requested=false;
    setText('Señal no disponible', 'Comprueba la conexión y vuelve a pulsar');
    render();
  });
  vol.addEventListener('input', () => {
    const value=Number(vol.value)/100;
    audio.volume=value;
    audio.muted=false;
    if (value>0) previousVolume=value;
    out.textContent=Math.round(value*100)+'%';
    render();
  });
  mute.addEventListener('click', () => {
    if (!audio.muted) {
      previousVolume=audio.volume||previousVolume;
      audio.muted=true;
    } else {
      audio.muted=false;
      if (!audio.volume) audio.volume=previousVolume;
      vol.value=String(Math.round(audio.volume*100));
      out.textContent=vol.value+'%';
    }
    render();
  });
  render();
})();
