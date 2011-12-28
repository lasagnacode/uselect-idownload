/*
 * uSelect iDownload
 *
 * Copyright © 2011 Alessandro Guido
 * Copyright © 2011 Marco Palumbo
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

var fields = {
	'ctrlKey': undefined,
	'altKey': undefined,
	'altGraphKey': undefined,
	'shiftKey': undefined,
	'metaKey': undefined,
	'keyIdentifier': undefined
};

var modifiers = {
	'Control': undefined,
	'Alt': undefined,
	'Meta': undefined,
	'Shift': undefined
};

function Shortcut(shortcut) {
	this._data = {};
	for (var f in fields)
		this._data[f] = null;
	this.set(shortcut);
}

Shortcut.prototype.matches = function (e) {
	for (var f in fields) {
		if (!e.hasOwnProperty(f))
			return false;
		if (this._data[f] != e[f])
			return false;
	}
	return true;
}

Shortcut.prototype.set = function (e) {
	if (e === undefined || e === null)
		return;
	for (var f in fields) {
		if (!e.hasOwnProperty(f))
			continue;
		this._data[f] = e[f];
	}
}

Shortcut.prototype.toString = function () {
	var s = [];
	if (this._data.ctrlKey)
		s.push('Ctrl');
	if (this._data.altKey)
		s.push('Alt');
	if (this._data.altGraphKey)
		s.push('AltGr');
	if (this._data.shiftKey)
		s.push('Shift');
	if (this._data.metaKey)
		s.push('Meta');
	var key = this._data.keyIdentifier;
	if (key.indexOf('U+') == 0) {
		var code = parseInt(key.slice(2), 16); // unicode
		if (code == 27)
			s.push('Esc');
		else
			s.push(String.fromCharCode(code));
	} else {
		s.push(this._data.keyIdentifier);
	}
	return s.join('+');
}
