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
	if (window.uSelect_iDownload !== undefined) {
		uSelect_iDownload.toggle();
		return;
	}
	chrome.extension.sendMessage({__req__: 'inject'}, function () {
		uSelect_iDownload.toggle();
	});
}

chrome.extension.onMessage.addListener(function (msg) {
	switch (msg) {
	case 'toggle':
		toggle_extension();
		break;
	}
});

})();
