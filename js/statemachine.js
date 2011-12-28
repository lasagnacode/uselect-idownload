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

function StateMachine() {
	this._states = {};
	this._initialState = undefined;
	this._current = null;
}

StateMachine.prototype.addState = function (state) {
	this._states[state._name] = state;
}

StateMachine.prototype._fireEvent = function (self, name, args) {
	if (self._current == null)
		throw "State machine not started or already terminated";

	var state = self._states[self._current];

	var ret = state.fireEvent(name, args);

	if (ret === undefined) // state unchanged
		return;
	state.exit();

	self._current = ret;
	if (ret === null) // exit from statemachine
		return;

	if (!self._states.hasOwnProperty(ret))
		throw "unknown state " + ret;
	self._states[ret].enter();
}

StateMachine.prototype.fireEvent = function (name, args) {
	setTimeout(this._fireEvent, 0, this, name, args);
}

StateMachine.prototype.setInitialState = function (state) {
	this._initialState = state;
}

StateMachine.prototype.start = function () {
	if (this._initialState == undefined)
		throw "initial state unset";
	this._current = this._initialState;
	setTimeout(function (self) {
		self._states[self._current].enter();
	}, 0, this);
}

StateMachine.prototype.current = function () {
	return this._current;
}

StateMachine.prototype.finished = function () {
    return this.current() == null;
}


function State(name) {
	this._name = name;
	this._enter = null;
	this._exit = null;
	this._events = {};
}

State.prototype.setEnter = function (fun) {
	this._enter = fun;
}

State.prototype.setExit = function (fun) {
	this._exit = fun;
}

State.prototype.enter = function () {
	if (this._enter)
		this._enter();
}

State.prototype.exit = function () {
	if (this._exit)
		this._exit();
}

State.prototype.addEvent = function (name, handler) {
	this._events[name] = handler;
}

State.prototype.fireEvent = function (name, args) {
	if (!this._events.hasOwnProperty(name))
		return undefined;
	var handler = this._events[name];
	if (typeof handler == 'function')
		return handler(args);
	return handler;
}
