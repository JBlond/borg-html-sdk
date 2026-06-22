document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		closePanel();
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
