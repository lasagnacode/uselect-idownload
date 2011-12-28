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

function executeExtension(idtab) {
	chrome.tabs.executeScript(idtab, {code: 'browserActionClicked()'});
}

chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
	var reqtype = request['type'];

	if (reqtype == 'open_urls') {
		var urls = request['urls'];
		for (var i in urls)
			chrome.tabs.create({'url': urls[i], 'selected': false});
	} else if (reqtype == 'get_shortcut') {
		var data = null;
		try {
			var settings = JSON.parse(localStorage['settings']);
			if (settings['shortcut_enable'])
				data = settings['shortcut'];
		} catch (x) {
			/* void */
		}
		sendResponse(data);
	} else if (reqtype == 'execute_extension') {
		executeExtension(request['tabid']);
	}
});

chrome.browserAction.onClicked.addListener(function (tab) {
	executeExtension(tab.id);
});
