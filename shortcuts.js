let overdriveIntervals = [];
let isOverdriveActive = false;

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closePanel();
		return;
	}
	if (event.key.toLowerCase() === 'f') {
		startAllBurst();
		return;
	}

	if (event.key.toLowerCase() === 'm') {
		const muteBtn = document.getElementById('mute-btn');
		if (muteBtn) muteBtn.click();
		return;
	}

	const matchingNode = config.nodes.find(node => node.shortcut === event.key);

	if (matchingNode)
	{
		const isClickable = !!(matchingNode.title && matchingNode.text);
		if (isClickable) {
			openPanel(matchingNode);
			if (typeof fireDataBurst === 'function') {
				fireDataBurst(matchingNode.id);
			}
		}
	}
});

function startAllBurst()
{
	// Verhindern, dass der Modus mehrfach gleichzeitig gestartet wird
	if (isOverdriveActive)
	{
		return;
	}
	isOverdriveActive = true;

	// Status-Log-Eintrag (falls die Funktion existiert)
	const log = document.getElementById('statusLog');
	if (log) {
		const div = document.createElement('div');
		div.innerText = "> HIVE OVERDRIVE ACTIVE";
		div.style.color = "#ffffff";
		log.appendChild(div);
	}

	// Für jede Node ein eigenes Intervall starten
	config.nodes.forEach(node => {
		// Wir feuern alle 700ms einen neuen Burst für diese Node ab
		const intervalId = setInterval(() => {
			if (typeof fireDataBurst === 'function') {
				fireDataBurst(node.id);
			}
		}, 300);

		// ID merken, um es später wieder zu stoppen
		overdriveIntervals.push(intervalId);
	});

	// Nach exakt 15 Sekunden (15000 Millisekunden) alles wieder stoppen
	setTimeout(() => {
		// Alle Intervalle löschen
		overdriveIntervals.forEach(id => clearInterval(id));
		overdriveIntervals = []; // Array leeren
		isOverdriveActive = false;

		if (log)
		{
			const div = document.createElement('div');
			div.innerText = "> OVERDRIVE COMPLETED. SYSTEM NOMINAL.";
			log.appendChild(div);
		}
	}, 15000);
}
