// ==UserScript==
// @name         Scryfall Tagger Button Overlay
// @version      1.0
// @description  Add a subtle Tagger button to Scryfall search results
// @author       Patty
// @match        https://scryfall.com/search*
// ==/UserScript==

(function () {
	'use strict';

	function transformHref(href) {
		//		https://scryfall.com/card/znr/93/blood-price
		// -> https://tagger.scryfall.com/card/znr/93
		try {
			const url = new URL(href);
			if (url.hostname !== 'scryfall.com') return null;

			const parts = url.pathname.split('/').filter(Boolean);
			if (parts.length < 3 || parts[0] !== 'card') return null;

			const set = parts[1];
			const number = parts[2];

			return `https://tagger.scryfall.com/card/${set}/${number}`;
		} catch (e) {
			return null;
		}
	}

	function createIcon() {
		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		svg.setAttribute('viewBox', '0 0 512 512');
		svg.setAttribute('width', '20');
		svg.setAttribute('height', '20');
		svg.style.display = 'block';

		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute(
			'd',
			'M457.7 11.9c0-3.1-1.2-6.1-3.5-8.4-4.5-4.5-12-4.5-16.6 0l-24.2 25.3h-148l-249 249.5c-2.4 2.4-3.9 5.6-3.9 9-.1 3.4 1.2 6.7 3.6 9.1l.4.4c2.4 2.4 5.6 3.9 9 3.9 3.4.1 6.7-1.2 9.1-3.6l67.1-64.8c2.4-2.4 5.7-3.6 9.1-3.6 3.4.1 6.6 1.5 9 3.9l.9 1c2.4 2.4 3.6 5.7 3.6 9.1-.1 3.4-1.5 6.6-3.9 9l-86.7 83.5c-2.4 2.4-3.9 5.6-3.9 9-.1 3.4 1.2 6.7 3.6 9.1l.4.4c2.4 2.4 5.6 3.9 9 3.9 3.4.1 6.7-1.2 9.1-3.6l39.7-38.3c2.4-2.4 5.7-3.6 9.1-3.6 3.4.1 6.6 1.5 9 3.9l.4.4c2.4 2.4 3.6 5.7 3.6 9.1-.1 3.4-1.5 6.6-3.9 9l-68.4 65.8c-2.4 2.4-3.9 5.6-3.9 9-.1 3.4 1.2 6.7 3.6 9.1l.4.4c2.4 2.4 5.6 3.9 9 3.9 3.4.1 6.7-1.2 9.1-3.6l92.7-89.2c2.4-2.4 5.7-3.6 9.1-3.6 3.4.1 6.6 1.5 9 3.9l.4.4c2.4 2.4 3.6 5.7 3.6 9.1-.1 3.4-1.5 6.6-3.9 9L113 404.1c-2.4 2.4-3.9 5.6-3.9 9-.1 3.4 1.2 6.7 3.6 9.1l.4.4c2.4 2.4 5.6 3.9 9 3.9 3.4.1 6.7-1.2 9.1-3.6l72.3-69.5c2.4-2.4 5.7-3.6 9.1-3.6 3.4.1 6.6 1.5 9 3.9 4.9 5 4.8 13.1-.2 18L155 437.5c-2.4 2.4-3.8 5.6-3.9 9-.1 3.4 1.2 6.7 3.6 9.1v-.1l.5.5c2.4 2.4 5.6 3.9 9 3.9 3.4.1 6.7-1.2 9.1-3.6L432 202V43.5l22.2-23.3c2.3-2.2 3.5-5.2 3.5-8.3zM344.9 151.3c-19.5 0-35.2-15.9-35.2-35.2 0-19.4 15.9-35.2 35.2-35.2 5.4 0 10.5 1.4 15.2 3.5l-14.9 14.8c-4.5 4.5-4.5 12 0 16.6 2.3 2.3 5.2 3.5 8.4 3.5 3.1 0 6.1-1.2 8.4-3.5l14.9-14.8c2.3 4.5 3.5 9.6 3.5 15.2-.3 19.3-16.2 35.1-35.5 35.1z'
		);
		path.setAttribute('fill', 'currentColor');
		svg.appendChild(path);
		return svg;
	}

	function addButtons() {
		const items = document.querySelectorAll('.card-grid-item');

		items.forEach((item) => {
			if (item.querySelector('.tm-tagger-btn')) return;

			const link = item.querySelector('a.card-grid-item-card');
			if (!link || !link.href) return;

			const taggerUrl = transformHref(link.href);
			if (!taggerUrl) return;

			if (getComputedStyle(item).position === 'static') {
				item.style.position = 'relative';
			}

			const btn = document.createElement('a');
			btn.className = 'tm-tagger-btn';
			btn.href = taggerUrl;
			btn.title = 'Open on Tagger';
			btn.appendChild(createIcon());

			Object.assign(btn.style, {
				position: 'absolute',
				display: 'flex',
				top: '7px',
				left: '4px',
				width: '20px',
				height: '20px',
				padding: '0',
				margin: '0',
				color: '#fff',
				opacity: '0',
				transition: 'opacity 0.15s ease',
				filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.8))',
			});

			btn.addEventListener('mouseenter', () => {
				btn.style.opacity = '1';
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.opacity = '0';
			});

			item.appendChild(btn);
		});
	}

	addButtons();

	const observer = new MutationObserver(() => {
		addButtons();
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
	});
})();