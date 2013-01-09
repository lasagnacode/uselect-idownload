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
		switch (action) {
		case 'download':
			chrome.tabs.create({
				'url': 'chrome://downloads',
				'selected': true,
				'openerTabId': sender.tab.id,
			}, sendResponse);
			break;
		case 'tabs':
			urls.forEach(function (url) {
				chrome.tabs.create({
					'url': url,
					'selected': false,
					'openerTabId': sender.tab.id,
				});
			});
			break;
		}
	}
	// The chrome.extension.onMessage listener must return true if you want to send a response after the listener returns
	return true;
}

function req_inject_handler(request, sender, sendResponse) {
	chrome.tabs.executeScript(sender.tab.id, {file: 'js/statemachine.js'}, function () {
		chrome.tabs.executeScript(sender.tab.id, {file: 'js/overlay.js'}, function () {
			if (sendResponse != null)
				sendResponse();
		});
	});
	// The chrome.extension.onMessage listener must return true if you want to send a response after the listener returns
	return true;
}

/**
 * Demultiplex requests using the '__req__' property of the request object
 */
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	switch (request['__req__']) {
	case 'inject':
		return req_inject_handler(request, sender, sendResponse);
	case 'action':
		return req_action_handler(request, sender, sendResponse);
	default:
		console.log('Unknown message');
	}
});

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.sendMessage(tab.id, 'toggle');
});
