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

chrome.extension.sendRequest({'type': 'get_shortcut'}, function (data) {
	if (data === null)
		return;

	var shortcut = new Shortcut(data);

	window.addEventListener('keydown', function (e) {
		if (shortcut.matches(e)) {
			chrome.extension.sendRequest({
				'type': 'execute_extension',
				'tabid': null
			});
			/* if the user has used a shortcut defined by the browser
			   (i.e. Ctrl+A) we have to stop the browser to execute the relative
			   action */
			e.preventDefault();
			e.stopPropagation();
		}
	}, true);
});
