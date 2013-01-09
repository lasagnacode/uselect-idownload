/*
 * uSelect iDownload
 *
 * Copyright © 2011-2013 Alessandro Guido
 * Copyright © 2011-2013 Marco Palumbo
 *
 * This file is part of uSelect iDownload.
 *
 * uSelect iDownload is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * uSelect iDownload is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with uSelect iDownload.  If not, see <http://www.gnu.org/licenses/>.
 */

(function () {

/* true if scripts have been injected */
function toggle_extension() {
	if (window.Overlay !== undefined) {
		Overlay.toggle();
		return;
	}
	chrome.extension.sendMessage({__req__: 'inject'}, function () {
		Overlay.toggle();
	});
}

chrome.extension.onMessage.addListener(function (msg) {
	switch (msg) {
	case 'toggle':
		toggle_extension();
		break;
	}
});

var shortcut = new Shortcut();
var handler_installed = false;

function storage_changed(changes, namespace) {
	if (namespace != 'sync' || !changes.hasOwnProperty('shortcut'))
		return;

	shortcut.set(changes['shortcut'].newValue);
	if (shortcut.isEmpty() && handler_installed) {
		window.removeEventListener('keydown', shortcut_handler, true);
		handler_installed = false;
		return;
	}

	if (!handler_installed) {
		window.addEventListener('keydown', shortcut_handler, true);
		handler_installed = true;
	}
}

/*
 * When the event handler is added it is called for every keydown event, which
 * might slow the browser. To optimize we don't add the event handler if the
 * shortcut is not set.
 */
function shortcut_handler(e) {
	if (shortcut.isEmpty()) {
		console.log('EPIC FAILURE: This should not happen!');
		return;
	}
	if (shortcut.matches(e)) {
		toggle_extension();
		/* if the user has used a shortcut defined by the browser
		   (i.e. Ctrl+A) we have to stop the browser to execute the relative
		   action */
		e.preventDefault();
		e.stopPropagation();
	}
}

chrome.storage.onChanged.addListener(storage_changed);
chrome.storage.sync.get('shortcut', function (items) {
	shortcut.set(items['shortcut']);
	if (!shortcut.isEmpty()) {
		window.addEventListener('keydown', shortcut_handler, true);
		handler_installed = true;
	}
});

})();
