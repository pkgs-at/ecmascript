/*
 * Copyright (c) 2009-2013, Architector Inc., Japan
 * All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 * core components of at.pkgs ECMAScript / JavaScript library
 */
(at = this.at || {}).pkgs = new (function(_root_) {
	/*
	 * base object class
	 */
	this.Object = (function(_namespace_) {
		var _class_;

		_class_ = function() {};
		_class_.extend = function(constructor, prototype, statics) {
			var closure;

			closure = new Function();
			closure.prototype = this.prototype;
			constructor.prototype = new closure();
			if (prototype)
				for (var name in prototype) constructor.prototype[name] = prototype[name];
			constructor.prototype.self = constructor;
			constructor.prototype.parent = this.prototype;
			for (var name in this) {
				if (name == 'prototype') continue;
				constructor[name] = this[name];
			}
			if (statics)
				for (var name in statics) constructor[name] = statics[name];
			return constructor;
		};
		_class_.prototype.self = _class_;
		return _class_;
	})(this);
	/*
	 * log class
	 */
	this.Log = (function(_namespace_) {
		var _class_;

		_class_ = _namespace_.Object.extend(function(name) {
			this.parent.self();
			this.level = this.self.INFO;
			this.name = name;
		}, { /* prototype */
			level: null,
			name: null,
			stack: function(error) {
				var stack;

				if (!error.stack) return false; // <= IE9
				stack = error.stack.toString().match(/^.*$/gm);
				if (stack[0].match(/^Error/)) { // GC, IE10
					stack.shift();
				}
				else { // FX
					// do nothing
				}
				stack.shift();
				stack.shift();
				return stack.join('\n');
			},
			log: function(level, parameters, trace) {
				var message;

				if (this.level < level) return false;
				if (!this.self.append()) return false;
				if (parameters.length < 1) return true;
				message = '[' + this.self.LEVELS[level] + '] ';
				message += this.name + ': ';
				message += this.self.format.apply(this, parameters);
				try {
					if (!trace) throw new Error();
				}
				catch (error) {
					trace = this.stack(error);
				}
				return this.self.append(message, trace);
			},
			debug: function(template, parameter) {
				return this.log(this.self.DEBUG, arguments);
			},
			info: function(template, parameter) {
				return this.log(this.self.INFO, arguments);
			},
			error: function(template, parameter) {
				return this.log(this.self.ERROR, arguments);
			},
			_catch_: function(error) {
				this.log(this.self.ERROR, [ error.toString() ], error.stack);
				return this;
			},
			_throw_: function(error) {
				this._catch_(error);
				throw error;
			},
			trap: function(callback, suppress, inject) {
				var log;

				log = this;
				return function() {
					try {
						if (inject) callback.log = log;
						callback.apply(this, arguments);
					}
					catch (error) {
						suppress ? log._catch_(error) : log._throw_(error);
					}
				};
			}
		}, { /* statics */ 
			LEVELS: [ 'ERROR', 'INFO', 'DEBUG' ],
			ERROR: 0,
			INFO: 1,
			DEBUG: 2,
			instances: {},
			get: function(name) {
				if (!this.instances[name])
					this.instances[name] = new this(name);
				return this.instances[name];
			},
			debug: function(name) {
				this.get(name).level = this.DEBUG;
				return this;
			},
			append: function(message, trace) {
				if (!(_root_.console && _root_.console.log)) return false;
				if (arguments.length < 1) return true;
				_root_.console.log(message + (trace ? ('\n' + trace) : ''));
				return true;
			},
			format: function(template, parameter) {
				var parameters;

				if (!parameter) return template;
				parameters = arguments;
				return template.replace(
						/\{(\d*)?(:\w*)?\}/g,
						function(matched, index, name) {
							var value;

							index = index ? parseInt(index, 10) : 0;
							value = parameters[index + 1];
							return name ? value[name.substring(1)] : value;
						});
			}
		});
		return _class_;
	})(this);
	/*
	 * event binder class
	 */
	this.EventBinder = (function(_namespace_) {
		var _class_;

		_class_ = _namespace_.Object.extend(function() {
			this.parent.self();
			this.handlers = new Array();
		}, { /* prototype */
			handlers: null,
			bind: function(handler, top) {
				if (top) this.handlers.unshift(handler);
				else this.handlers.push(handler);
				return this;
			},
			unbind: function(handler) {
				this.handlers.remove(handler);
				return this;
			},
			clear: function() {
				this.handlers.length = 0;
				return this;
			},
			fire: function() {
				var parameters;
				var index;
				var handler;

				parameters = arguments;
				for (index = 0; index < this.handlers.length; index ++) {
					handler = this.handlers[index];
					if (handler.apply(handler, parameters) === false) break;
				}
				return this;
			}
		});
		return _class_;
	})(this);
})(this);
