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

var obj = window._uselectidownload;
if (obj === undefined) {
	var obj = new Overlay();
	window._uselectidownload = obj;
	obj.show();
} else {
	obj.destroy(); // deletion happens in overlay.js
}
