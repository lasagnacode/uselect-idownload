/*
 * uSelect iDownload
 *
 * Copyright © 2011-2012 Alessandro Guido
 * Copyright © 2011-2012 Marco Palumbo
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

var form = null;

function catch_shortcut(e) {
	for (var m in modifiers) {
		if (m == e.keyIdentifier) {
			e.preventDefault();
			return;
		}
	}
	var s = new Shortcut(e);
	form.shortcut.innerText = s.toString();
	chrome.storage.sync.set({'shortcut': s._data});
	e.preventDefault();
	document.removeEventListener('keydown', catch_shortcut, true);
}

function storage_changed(changes, namespace) {
	console.log(changes);
	if (namespace != 'sync')
		return;


	if (changes.hasOwnProperty('shortcut')) {
		var s = new Shortcut(changes['shortcut'].newValue);
		form.shortcut.innerText = s.toString();
	}
}

document.addEventListener('DOMContentLoaded', function () {
	form = document.forms.sc_form;

	form.shortcut.addEventListener('click', function () {
		document.addEventListener('keydown', catch_shortcut, true);
	});

	form.shortcut_clear.addEventListener('click', function () {
		chrome.storage.sync.remove('shortcut');
	});
	chrome.storage.sync.get(null, function (items) {
		form.shortcut.innerText = (new Shortcut(items['shortcut'])).toString();
	});
	chrome.storage.onChanged.addListener(storage_changed);
});

})();
