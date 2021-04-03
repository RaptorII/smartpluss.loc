"use strict";

	let toggle_nav = document.getElementById('toggle-nav');
	let body = document.body;
	let nv = document.getElementsByClassName('navigation__wrapper');

	toggle_nav.onclick = function () {
		body.classList.toggle("open");
		setNavigationHeight();
	}

	function setNavigationHeight() {
		console.log(nv);
		if (body.className === 'open') {
			nv[0].style.height = window.innerHeight - 125 + 'px';
		} else {
			nv[0].style.height = 'auto';
		}
	}
