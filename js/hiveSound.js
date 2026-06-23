let audioCtx = null;
let droneOsc1 = null;
let droneOsc2 = null;
let mainGain = null;
let isMuted = false;

function startHiveDrone() {
	if (audioCtx) return;

	audioCtx = new (window.AudioContext || window.webkitAudioContext)();

	mainGain = audioCtx.createGain();
	mainGain.gain.setValueAtTime(0.15, audioCtx.currentTime);

	const lowpass = audioCtx.createBiquadFilter();
	lowpass.type = 'lowpass';
	lowpass.frequency.setValueAtTime(120, audioCtx.currentTime);

	droneOsc1 = audioCtx.createOscillator();
	droneOsc1.type = 'sawtooth';
	droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

	droneOsc2 = audioCtx.createOscillator();
	droneOsc2.type = 'triangle';
	droneOsc2.frequency.setValueAtTime(55.5, audioCtx.currentTime);

	droneOsc1.connect(lowpass);
	droneOsc2.connect(lowpass);
	lowpass.connect(mainGain);
	mainGain.connect(audioCtx.destination);

	droneOsc1.start();
	droneOsc2.start();
}

function modulateDrone() {
	// Wenn stummgeschaltet, reagiert das Brummen auch nicht auf die Maus
	if (!audioCtx || isMuted) return;
	mainGain.gain.cancelScheduledValues(audioCtx.currentTime);
	mainGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
	mainGain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.4);
}

// 1. Erster Klick startet das Brummen
document.body.addEventListener('click', (e) => {
	// Verhindert, dass der erste Klick auf den Mute-Button das Audio direkt wieder verwirrt
	if (e.target.id === 'mute-btn') return;
	startHiveDrone();
}, { once: true });

// 2. Mute/Unmute Logik
document.getElementById('mute-btn').addEventListener('click', (e) => {
	e.stopPropagation(); // Verhindert Konflikte mit dem Body-Klick

	// Falls das Audio noch gar nicht gestartet wurde, starten wir es jetzt direkt
	if (!audioCtx) {
		startHiveDrone();
		return;
	}

	const btn = document.getElementById('mute-btn');

	if (!isMuted) {
		// Lautstärke auf 0 setzen
		mainGain.gain.setValueAtTime(0, audioCtx.currentTime);
		btn.innerText = '[AUDIO: MUTED]';
		btn.style.color = '#ff3333'; // Wird rot zur Warnung
		isMuted = true;
	} else {
		// Lautstärke zurück auf den Standardwert
		mainGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
		btn.innerText = '[AUDIO: ACTIVE]';
		btn.style.color = 'var(--borg-green)';
		isMuted = false;
	}
});

document.querySelectorAll('.interactive-node').forEach(node => {
	node.addEventListener('mouseenter', modulateDrone);
});
