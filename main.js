function initInterface() {
	// 1. Ghost Layer
	createGhostNetwork();

	// 2. Radar
	const radar = createSVGElement("circle", {cx: 500, cy: 400, r: 0, class: "radar-ring radar-active"});
	document.getElementById('radarContainer').appendChild(radar);

	// 3. Zentrum
	const nodesContainer = document.getElementById('nodesContainer');
	[90, 60, 35].forEach(r => {
		nodesContainer.appendChild(createSVGElement("circle", {
			cx: 500,
			cy: 400,
			r: r,
			class: "core-ring",
			stroke: "var(--borg-green)",
			"stroke-width": "1.2",
			fill: "none"
		}));
	});
	nodesContainer.appendChild(createSVGElement("circle", {
		cx: 500,
		cy: 400,
		r: 20,
		class: "core-dot blink-1",
		fill: "url(#nodePulseGradient)"
	}));

	// 4. Paths & Pulse
	config.nodes.forEach(node => {
		let startX = config.center.x;
		let startY = config.center.y;
		if (node.parentId)
		{
			const parent = config.nodes.find(n => n.id === node.parentId);
			if (parent)
			{
				startX = parent.x;
				startY = parent.y;
			}
		}
		const pathId = `path_${node.id}`;
		const cp1x = startX + (node.x - startX) * 0.5;
		const d = `M${startX},${startY} C${cp1x},${startY} ${cp1x},${node.y} ${node.x},${node.y}`;
		document.getElementById('pathsContainer').appendChild(createSVGElement("path", {d: d, id: pathId}));
		createPulse(pathId);
	});

	// 5. Nodes with rekursive Highlighting
	config.nodes.forEach(node => {
		const isClickable = !!(node.title && node.text);
		const circle = createSVGElement("circle", {
			cx: node.x, cy: node.y, r: node.r,
			class: `node ${node.blink} ${isClickable ? 'clickable' : ''}`,
			fill: "url(#nodePulseGradient)"
		});

		if (isClickable)
		{
			circle.onclick = () => openPanel(node);

			// REKURSIVES HIGHLIGHTING STARTEN
			circle.onmouseenter = () => {
				highlightPathTrace(node.id, true);
				// fire datapacks at Hover along the chain
				fireDataBurst(node.id);
			};
			circle.onmouseleave = () => highlightPathTrace(node.id, false);
		}
		nodesContainer.appendChild(circle);
	});

	startStatusLog();
}

// Neue Funktion für das Verfolgen des Pfades zum Zentrum
function highlightPathTrace(nodeId, active)
{
	let currentNodeId = nodeId;

	// Wir wandern den Baum hoch bis zum Zentrum
	while (currentNodeId)
	{
		const path = document.getElementById(`path_${currentNodeId}`);
		if (path)
		{
			if (active) path.classList.add('path-highlight');
			else path.classList.remove('path-highlight');
		}
		const currentNode = config.nodes.find(n => n.id === currentNodeId);
		currentNodeId = currentNode ? currentNode.parentId : null;
	}
}

// Rekursiver Data-Burst to center
function fireDataBurst(nodeId)
{
	let currentNodeId = nodeId;
	let delay = 0;

	// Wir wandern die Kette hoch
	while (currentNodeId) {
		const pathId = `path_${currentNodeId}`;
		const path = document.getElementById(pathId);

		if (path)
		{
			// Fire 5 data packages
			for (let i = 0; i < 5; i++) {
				createSingleBurstPulse(pathId, delay + (i * 150));
			}
			delay += 400;
		}

		const currentNode = config.nodes.find(n => n.id === currentNodeId);

		// Wenn die Node eine parentId hat, setze die Schleife fort, sonst stop (Zentrum erreicht)
		currentNodeId = currentNode ? currentNode.parentId : null;
	}
}

// single temporary High-Speed-Puls
function createSingleBurstPulse(pathId, delayMs)
{
	setTimeout(() => {
		const container = document.getElementById('pulseContainer');
		const targetPath = document.getElementById(pathId);
		if (!container || !targetPath) return;

		// Wir holen die exakten Pfaddaten
		const pathData = targetPath.getAttribute('d');

		// Wir erstellen einen nackten SVG-Kreis
		const pulse = createSVGElement("circle", {
			r: "3.5",
			class: "burst-pulse-css" // Neue Klasse!
		});

		// Wir weisen dem Kreis den Pfad direkt als CSS-Style zu
		// modernere Browser brauchen kein animateMotion mehr dafür!
		pulse.style.offsetPath = `path('${pathData}')`;

		container.appendChild(pulse);

		// Nach Ablauf der CSS-Animation (500ms) löschen
		setTimeout(() => {
			pulse.remove();
		}, 500);

	}, delayMs);
}

function createGhostNetwork()
{
	const layer = document.getElementById('ghostLayer');
	for (let i = 0; i < 15; i++)
	{
		const gx = Math.random() * 1000;
		const gy = Math.random() * 800;
		layer.appendChild(createSVGElement("line", {
			x1: 500,
			y1: 400,
			x2: gx,
			y2: gy,
			stroke: "var(--borg-green)",
			"stroke-width": "0.5"
		}));
		layer.appendChild(createSVGElement("circle", {
			cx: gx,
			cy: gy,
			r: Math.random() * 5 + 2,
			fill: "none",
			stroke: "var(--borg-green)",
			"stroke-width": "0.5"
		}));
	}
}

function createPulse(pathId) {
	const pulse = createSVGElement("circle", {
		cx: "-100",
		cy: "-100",
		r: "1.8",
		fill: "#fff",
		filter: "url(#glow)",
		class: "data-pulse"
	});
	const anim = createSVGElement("animateMotion", {
		dur: `${Math.random() * 2 + 2}s`,
		repeatCount: "indefinite",
		begin: `${Math.random() * 2}s`
	});
	const mpath = createSVGElement("mpath", {"xlink:href": `#${pathId}`});
	anim.appendChild(mpath);
	pulse.appendChild(anim);
	document.getElementById('pulseContainer').appendChild(pulse);
}

function createSVGElement(type, attrs) {
	const el = document.createElementNS("http://www.w3.org/2000/svg", type);
	for (let key in attrs) el.setAttribute(key, attrs[key]);
	return el;
}

function openPanel(node) {
	document.getElementById('infoTitle').innerText = node.title;
	document.getElementById('infoText').innerText = node.text;
	document.getElementById('closer').innerText = 'DISCONNECT';
	if (typeof node.closetext !== 'undefined')
	{
		document.getElementById('closer').innerText = node.closetext;
	}
	document.getElementById('infoPanel').classList.add('active');
}

function closePanel() {
	document.getElementById('infoPanel').classList.remove('active');
}

function startStatusLog() {
	const log = document.getElementById('statusLog');
	const messages = [
		"SYNCHRONIZING CORE...",
		"DATA STREAM ACTIVE",
		"NEURAL PATHS: STABLE",
		"ENCRYPTING HIVEMIND...",
		"SECTOR 001: SCANNING",
		"NO RESISTANCE DETECTED"
	];
	setInterval(() => {
		const div = document.createElement('div');
		div.innerText = `> ${messages[Math.floor(Math.random() * messages.length)]}`;
		log.appendChild(div);
		if (log.childNodes.length > 8) log.removeChild(log.firstChild);
	}, 2500);
}

initInterface();
