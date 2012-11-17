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

/* keep track of tabs that have already loaded extension files */
var mytabs = {};

function req_action_handler(request, sender, sendResponse) {
	var urls = request['urls'];
	var action = request['action'];
	var tabId = request['tabId'];

	if (action == 'window') {
		/*
		 * TODO:
		 * - incognito window
		 * - selected
		 */
		chrome.windows.create({'url': urls});
	} else {
		if (action == 'download')
			chrome.tabs.create({
				'url': 'chrome://downloads',
				'selected': true,
				'openerTabId': sender.tab.id,
			});
		urls.forEach(function (url) {
			switch (action) {
			case 'tabs':
				chrome.tabs.create({
					'url': url,
					'selected': false,
					'openerTabId': sender.tab.id,
				});
				break;
			case 'download':
				chrome.experimental.downloads.download({
					'url': url,
				});
				break;
			}
		});
	}
}

function req_toggle_handler(request, sender, sendResponse) {
	var idtab = request['idtab'];
	if (idtab == null)
		idtab = sender.tab.id;
	if (!mytabs.hasOwnProperty(idtab)) {
		chrome.tabs.executeScript(idtab, {file: 'js/statemachine.js'}, function () {
			chrome.tabs.executeScript(idtab, {file: 'js/overlay.js'}, function () {
				mytabs[idtab] = true;
				chrome.tabs.sendMessage(idtab, 'toggle');
			});
		});
	} else {
		chrome.tabs.sendMessage(idtab, 'toggle');
	}
}

/**
 * Demultiplex requests using the '__req__' property of the request object
 */
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if (request['__req__'] == 'action')
		req_action_handler(request, sender, sendResponse);
	else if (request['__req__'] == 'toggle-extension')
		req_toggle_handler(request, sender, sendResponse);
});

chrome.browserAction.onClicked.addListener(function (tab) {
	req_toggle_handler({'idtab': tab.id}, null, null);
});
