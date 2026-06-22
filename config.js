const config = {
	center: {id: "core", x: 500, y: 400},
	nodes: [
		{
			id: "p0",
			x: 220,
			y: 250,
			r: 45,
			blink: 'blink-1',
			title: "Sub-Unit 01",
			text: "Neuralfrequenz stabil bei 44.2 Hz.",
			shortcut: "0"
		},
		{
			id: "p1",
			x: 200,
			y: 380,
			r: 32,
			blink: 'blink-2',
			title: "Tactical Hub",
			text: "Scan von Sektor 001 abgeschlossen.",
			shortcut: "1"
		},
		{
			id: "p2",
			x: 780,
			y: 240,
			r: 42,
			blink: 'blink-3',
			title: "Bio-Matrix",
			text: "Kortikalknoten-Status: Optimal.",
			shortcut: "2"
		},
		{
			id: "p3",
			x: 650,
			y: 700,
			r: 35,
			blink: 'blink-1',
			title: "Power Core",
			text: "Energieverteilung auf 104% gesteigert.",
			shortcut: "3"
		},
		{
			id: "p4",
			x: 880,
			y: 420,
			r: 45,
			blink: 'blink-2',
			title: "Comms Relay",
			text: "Interlink-Protokoll aktiv.",
			shortcut: "4"
		},
		{
			id: "p5",
			x: 180,
			y: 550,
			r: 50,
			blink: 'blink-3',
			title: "Memory Bank",
			text: "Verschlüsselung läuft.",
			closetext: "OKAY",
			shortcut: "5"
		},
		{
			id: "sub1",
			parentId: "p0",
			x: 100,
			y: 150,
			r: 25,
			blink: 'blink-2',
			title: "Sensor A",
			text: "Langstreckenscan aktiv.",
			shortcut: "6"
		},
		{
			id: "sub2",
			parentId: "p5",
			x: 120,
			y: 450,
			r: 20,
			blink: 'blink-1',
			shortcut: "7"
		},
		{
			id: "sub3",
			parentId: "p2",
			x: 900,
			y: 200,
			r: 28,
			blink: 'blink-1',
			title: "Relay 04",
			text: "Datenweiterleitung aktiv.",
			shortcut: "8"
		}
	]
};
