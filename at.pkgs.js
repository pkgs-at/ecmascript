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

/**
 * @file Core components of at.pkgs ECMAScript / JavaScript library.
 * @version 0.1.3
 * @author 鈴木 聰太郎 <sotaro.suzuki@architector.jp>
 * @copyright 2009-2013, Architector Inc., Japan
 * @namespace at.pkgs
 */

(at = this.at || {}).pkgs = new (function(_root_) {
	this.Object = (function(_namespace_) {
		var _class_;

		/**
		 * @since 0.1.0
		 * @class at.pkgs.Object
		 * @classdesc
		 *     継承に関する基本機能を提供するベースクラス.
		 *     チュートリアル: {@tutorial at.pkgs.Object}
		 * @param {at.pkgs.Object=} instance インスタンス.
		 */
		_class_ = function(instance) {};
		/**
		 * このクラスのサブクラスを作成する.
		 * 
		 * @since 0.1.0
		 * @memberof at.pkgs.Object.
		 * @name extend
		 * @function
		 * @param {Function} constructor コンストラクタ.
		 * @param {Object} prototype インスタンスメンバ.
		 * @param {Object=} statics クラスメンバ.
		 * @returns {Function} サブクラス.
		 */
		_class_.extend = function(constructor, prototype, statics) {
			var closure;
			var name;

			closure = new Function();
			closure.prototype = this.prototype;
			constructor.prototype = new closure();
			name = null;
			if (prototype)
				for (name in prototype) constructor.prototype[name] = prototype[name];
			constructor.prototype.self = constructor;
			constructor.prototype.parent = this.prototype;
			for (name in this) {
				if (name == 'prototype') continue;
				constructor[name] = this[name];
			}
			if (statics)
				for (name in statics) constructor[name] = statics[name];
			return constructor;
		};
		/**
		 * コンストラクタへの参照.
		 * 
		 * @since 0.1.0
		 * @readonly
		 * @memberof at.pkgs.Object#
		 * @name self
		 * @type {Function}
		 */
		_class_.prototype.self = _class_;
		/**
		 * 親クラスのプロトタイプへの参照.
		 * 
		 * @since 0.1.3
		 * @readonly
		 * @memberof at.pkgs.Object#
		 * @name parent
		 * @type {Object}
		 */
		_class_.prototype.parent = null;
		return _class_;
	})(this);
	/*
	 * log class
	 */
	this.Log = (function(_namespace_) {
		var _class_;

		_class_ = _namespace_.Object.extend((
			/**
			 * @since 0.1.0
			 * @class at.pkgs.Log
			 * @classdesc
			 *     ログクラス.
			 *     チュートリアル: {@tutorial at.pkgs.Log}
			 * @extends {at.pkgs.Object}
			 * @param {String} name ログ名称.
			 * @param {at.pkgs.Log=} instance インスタンス.
			 */
			function(name, instance) {
				instance = instance || this;
				this.parent.self(instance);
				instance.level = this.self.INFO;
				instance.name = name;
			}
		), { /* prototype */
			/**
			 * 出力対象となる最詳のログレベル.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @type {Number}
			 */
			level: null,
			/**
			 * ログ名称.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @type {String}
			 */
			name: null,
			/**
			 * 例外からコールスタックを取得する.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param {Error} error 例外.
			 * @returns {String|Boolean} コールスタックまたはfalse.
			 */
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
			/**
			 * ログを出力する.
			 * 
			 * メッセージフォーマットパラメタを指定しない場合はログを出力せずに、ログの有効確認のみを行う.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param level ログレベル.
			 * @param {Function.Arguments=} parameters メッセージフォーマットパラメタ.
			 * @param {String=} trace コールスタック.
			 * @returns {Boolean} ログ出力が有効であればtrue.
			 */
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
			/**
			 * デバッグログを出力する.
			 * 
			 * メッセージを指定しない場合はログを出力せずに、ログの有効確認のみを行う.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param {String=} template メッセージテンプレート.
			 * @param {...*} parameter テンプレートパラメタ.
			 * @returns {Boolean} ログ出力が有効であればtrue.
			 */
			debug: function(template, parameter) {
				return this.log(this.self.DEBUG, arguments);
			},
			/**
			 * 情報ログを出力する.
			 * 
			 * メッセージを指定しない場合はログを出力せずに、ログの有効確認のみを行う.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param {String=} template メッセージテンプレート.
			 * @param {...*} parameter テンプレートパラメタ.
			 * @returns {Boolean} ログ出力が有効であればtrue.
			 */
			info: function(template, parameter) {
				return this.log(this.self.INFO, arguments);
			},
			/**
			 * エラーログを出力する.
			 * 
			 * メッセージを指定しない場合はログを出力せずに、ログの有効確認のみを行う.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param {String=} template メッセージテンプレート.
			 * @param {...*} parameter テンプレートパラメタ.
			 * @returns {Boolean} ログ出力が有効であればtrue.
			 */
			error: function(template, parameter) {
				return this.log(this.self.ERROR, arguments);
			},
			/**
			 * 例外ログを出力し、例外を無視する.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param {Error} error 例外.
			 * @returns {at.pkgs.Log} ログ.
			 */
			_catch_: function(error) {
				this.log(this.self.ERROR, [ error.toString() ], error.stack);
				return this;
			},
			/**
			 * 例外ログを出力し、例外を再throwする.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param {Error} error 例外.
			 * @throws {Error} パラメタの例外を再throwする.
			 */
			_throw_: function(error) {
				this._catch_(error);
				throw error;
			},
			/**
			 * 関数をラップし、例外ログの捕捉を有効にする.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log#
			 * @param {Function} callback ラップ対象の関数.
			 * @param {Boolean=} suppress 例外の再throwを行わない場合はtrueを指定.
			 * @param {Boolean=} inject ログインスタンスの注入を行う場合はtrueを指定.
			 * @returns {Function} ラップ匿名関数.
			 */
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
			/**
			 * ログレベル名称の配列.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @const
			 * @type {String[]}
			 */
			LEVELS: [ 'ERROR', 'INFO', 'DEBUG' ],
			/**
			 * エラーログレベル.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @const
			 * @type {Number}
			 */
			ERROR: 0,
			/**
			 * 情報ログレベル.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @const
			 * @type {Number}
			 */
			INFO: 1,
			/**
			 * デバッグログレベル.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @const
			 * @type {Number}
			 */
			DEBUG: 2,
			/**
			 * ログ名称をキーとするログインスタンスのマップ.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @type {Object}
			 */
			instances: {},
			/**
			 * ログ名称を指定してログを取得する.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @param {String} name ログ名称.
			 * @returns {at.pkgs.Log} ログ.
			 */
			get: function(name) {
				if (!this.instances[name])
					this.instances[name] = new this(name);
				return this.instances[name];
			},
			/**
			 * ログ名称を指定してデバッグログを有効にする.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @param {String} name ログ名称.
			 * @returns {at.pkgs.Log} ログ.
			 */
			debug: function(name) {
				this.get(name).level = this.DEBUG;
				return this;
			},
			/**
			 * ログを書込む.
			 * 
			 * メッセージを指定しない場合はログを出力せずに、ログの有効確認のみを行う.
			 * このメソッドを上書きすることでログの出力先を変更可能.
			 * 標準ではconsole.logへ書き込みを行う.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @param {String=} message ローマット済のメッセージ.
			 * @param {?String=} trace コールスタック. 
			 * @returns {Boolean} ログ出力が有効であればtrue.
			 */
			append: function(message, trace) {
				if (!(_root_.console && _root_.console.log)) return false;
				if (arguments.length < 1) return true;
				_root_.console.log(message + (trace ? ('\n' + trace) : ''));
				return true;
			},
			/**
			 * メッセージをフォーマットする.
			 * 
			 * このメソッドを上書きすることでフォーマッタを変更可能.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.Log.
			 * @param {String} template ログ出力メソッドの第1引数.
			 * @param {...*} parameter ログ出力メソッドの第2引数以降.
			 * @returns フォーマット済みの文字列.
			 */
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

		_class_ = _namespace_.Object.extend((
			/**
			 * @since 0.1.0
			 * @class at.pkgs.EventBinder
			 * @classdesc
			 *     イベントバインドクラス.
			 *     チュートリアル: {@tutorial at.pkgs.EventBinder}
			 * @extends {at.pkgs.Object}
			 * @param {at.pkgs.EventBinder=} instance インスタンス.
			 */
			function(instance) {
				instance = instance || this;
				this.parent.self(instance);
				instance.handlers = new Array();
			}
		), { /* prototype */
			/**
			 * イベントバインダで使用するイベントハンドラ.
			 * 
			 * イベント発火時の実行コンテキスト(this)にはイベントハンドラ自身が設定される.
			 * 
			 * @callback at.pkgs.EventBinder~EventHandler
			 * @param {...*} arguments イベント発火時に与えられたパラメタ.
			 * @returns {Boolean=} 後続のイベントハンドラを実行しない場合はfalse.
			 */
			/**
			 * バインドされたイベントハンドラの配列.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.EventBinder#
			 * @type {Function[]}
			 */
			handlers: null,
			/**
			 * イベントハンドラを登録する.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.EventBinder#
			 * @param {at.pkgs.EventBinder~EventHandler} handler イベントハンドラ.
			 * @param {Boolean=} top ハンドラ末尾でなく先頭に追加する場合はtrueを指定.
			 * @returns {at.pkgs.EventBinder} イベントバインダ.
			 */
			bind: function(handler, top) {
				if (top) this.handlers.unshift(handler);
				else this.handlers.push(handler);
				return this;
			},
			/**
			 * イベントハンドラを抹消する.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.EventBinder#
			 * @param {at.pkgs.EventBinder~EventHandler} handler イベントハンドラ.
			 * @returns {at.pkgs.EventBinder} イベントバインダ.
			 */
			unbind: function(handler) {
				var index;

				index = 0;
				while (index < this.handlers.length) {
					if (this.handlers[index] == handler)
						this.handlers.splice(index, 1);
					index ++;
				}
				return this;
			},
			/**
			 * 全てのイベントハンドラを抹消する.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.EventBinder#
			 * @returns {at.pkgs.EventBinder} イベントバインダ.
			 */
			clear: function() {
				this.handlers.length = 0;
				return this;
			},
			/**
			 * イベントを発火(通知)する.
			 * 
			 * @since 0.1.0
			 * @memberof at.pkgs.EventBinder#
			 * @param {...*} arguments イベントハンドラに渡す引数.
			 * @returns {at.pkgs.EventBinder} イベントバインダ.
			 */
			fire: function() {
				var index;
				var handler;

				for (index = 0; index < this.handlers.length; index ++) {
					handler = this.handlers[index];
					if (handler.apply(handler, arguments) === false) break;
				}
				return this;
			}
		});
		return _class_;
	})(this);
})(this);
