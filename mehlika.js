const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const notes = {
  // --- NATUREL NOTALAR (Alt Sıra) ---
  'a': 261.63, // Do (C4)
  's': 293.66, // Re (D4)
  'd': 329.63, // Mi (E4)
  'f': 349.23, // Fa (F4)
  'g': 392.00, // Sol (G4)
  'h': 440.00, // La (A4)
  'j': 493.88, // Si (B4)
  'k': 523.25, // Do (C5)
  'l': 587.33, // Re (D5)
  'ş': 659.25, // Mi (E5)
  'i': 698.46, // Fa (F5)

  // --- DİYEZ / BEMOLLER (Üst Sıra) ---
  'w': 277.18, // Do# / Reb
  'e': 311.13, // Re# / Mib
  't': 369.99, // Fa# / Solb
  'y': 415.30, // Sol# / Lab
  'u': 466.16, // La# / Sib
  'o': 554.37, // Do# / Reb (Üst oktav)
  'p': 622.25, // Re# / Mib (Üst oktav)
  'ğ': 739.99  // Fa# / Solb (Üst oktav)
};

function playViolin(freq) {
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sawtooth'; 
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  // Vibrato (Keman karakteri)
  const vibrato = audioCtx.createOscillator();
  const vGain = audioCtx.createGain();
  vibrato.frequency.value = 5.5; 
  vGain.gain.value = freq * 0.01; 
  vibrato.connect(vGain);
  vGain.connect(osc.frequency);
  vibrato.start();

  filter.type = "lowpass";
  filter.frequency.value = 1300; 

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.08);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.3);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 1.3);
}

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (notes[key]) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    playViolin(notes[key]);
  }
});
