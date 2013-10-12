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
 * @version 0.1.5
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
		/**
		 * 指定された名称のプロパティを直接持つか取得する.
		 * 
		 * @since 0.1.5
		 * @memberof at.pkgs.Object#
		 * @function
		 * @name immediate
		 * @param {String} プロパティ名.
		 * @returns {Boolean} 持つならばtrue.
		 */
		_class_.prototype.immediate = function(name) {
			return this.self.prototype.hasOwnProperty(name);
		};
		return _class_;
	})(this);
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
			 * @since 0.1.0
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
			 * @param {Boolean=} top ハンドラを末尾でなく先頭に追加する場合はtrueを指定.
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
	this.ObservableValue = (function(_namespace_) {
		var _class_;

		_class_ = _namespace_.EventBinder.extend((
			/**
			 * @since 0.1.5
			 * @class at.pkgs.ObservableValue
			 * @classdesc
			 *     値変更通知クラス.
			 *     チュートリアル: {@tutorial at.pkgs.EventBinder}
			 *     このクラスのイベントハンドラは第1引数に変更前の値、第2引数に変更後の値を受け取る.
			 * @extends {at.pkgs.EventBinder}
			 * @param {*=} value 初期値.
			 * @param {at.pkgs.ObservableValue=} instance インスタンス.
			 */
			function(value, instance) {
				instance = instance || this;
				this.parent.self(instance);
				instance.value = value;
			}
		), {
			/**
			 * 現在値.
			 * 
			 * @since 0.1.5
			 * @memberof at.pkgs.ObservableValue#
			 * @type {*}
			 */
			value: null,
			/**
			 * 値を設定する.
			 * 
			 * @since 0.1.5
			 * @memberof at.pkgs.ObservableValue#
			 * @param {*} value 新しい値.
			 */
			set: function(value) {
				var previous;

				previous = this.value;
				this.value = value;
				if (this.changed(previous, value))
					this.fire(previous, value);
			},
			/**
			 * 値を取得する.
			 * 
			 * @since 0.1.5
			 * @memberof at.pkgs.ObservableValue#
			 * @returns {*} 現在の値.
			 */
			get: function() {
				return this.value;
			},
			/**
			 * 値を比較する.
			 * 
			 * 継承するか、インスタンスの本メソッドを上書きすることで比較方法を変更可能.
			 * 
			 * @since 0.1.5
			 * @memberof at.pkgs.ObservableValue#
			 * @param {*} previous 以前の値.
			 * @param {*} current 現在の値.
			 * @returns {Boolean} 変化した場合はtrue;
			 */
			changed: function(previous, current) {
				return previous !== current;
			}
		});
		return _class_;
	})(this);
	/**
	 * @since 0.1.4
	 * @namespace at.pkgs.escape
	 */
	this.escape = new (function() {
		this.empty = (function(_namespace_) {
			var _function_;

			/**
			 * null及びundefinedを空文字にエスケープする.
			 * 
			 * @since 0.1.4
			 * @method at.pkgs.escape.empty
			 * @param {*} source エスケープ対象.
			 * @returns {String} エスケープ済文字列.
			 */
			_function_ = function(source) {
				return (source === null || source === void 0) ? '' : source.toString();
			};
			return _function_;
		})(this);
		this.html = (function(_namespace_) {
			var _function_;

			/**
			 * HTML内のテキストとしてエスケープする.
			 * 
			 * @since 0.1.4
			 * @method at.pkgs.escape.html
			 * @param {*} source エスケープ対象.
			 * @returns {String} エスケープ済文字列.
			 */
			_function_ = function(source) {
				return _namespace_.empty(source).replace(/[&<>"']/g, function(matched) {
					switch (matched) {
					case '&' :
						return '&amp;';
					case '<' :
						return '&lt;';
					case '>' :
						return '&gt;';
					case '"' :
						return '&quot;';
					case "'" :
						return '&#039;';
					}
				});
			};
			return _function_;
		})(this);
	})();
	this.Template = (function(_namespace_) {
		var _class_;

		_class_ = _namespace_.Object.extend((
			/**
			 * @since 0.1.4
			 * @class at.pkgs.Template
			 * @classdesc
			 *     テンプレートクラス.
			 *     チュートリアル: {@tutorial at.pkgs.Template}
			 * @extends {at.pkgs.Object}
			 * @param {String} source テンプレートソース.
			 * @param {at.pkgs.TemplateEngine} engine テンプレートエンジン.
			 * @param {at.pkgs.Template=} instance インスタンス.
			 */
			function(source, engine, instance) {
				instance = instance || this;
				this.parent.self(instance);
				instance.engine = engine;
				instance.texts = new Array();
				instance.prepare(source);
			}
		), { /* prototype */
			/**
			 * テンプレートエンジン.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @type {at.pkgs.TemplateEngine}
			 */
			engine: null,
			/**
			 * テキストノードの配列.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @type {String[]}
			 */
			texts: null,
			/**
			 * テンプレート実行スクリプト.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @type {String}
			 */
			code: null,
			/**
			 * テンプレートソースを処理し、実行可能にする.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @param {String} テンプレートソース.
			 */
			prepare: function(source) {
				var self;
				var codes;
				var last;

				self = this;
				codes = new Array();
				if (source === null || source === void 0 || !source.replace) throw new Error('invalid template source');
				last = 0;
				source.replace(this.engine.pattern, function(matched, code, escape, raw, offset) {
					var expression;

					if (last != offset) {
						codes.push('_text_ += _this_.text(' + self.texts.length + ');');
						self.texts.push(source.slice(last, offset));
					}
					last = offset + matched.length;
					expression = code || escape || raw;
					if (code)
						codes.push(expression);
					if (escape)
						codes.push('_text_ += _this_.escape(' + expression + ');');
					if (raw)
						codes.push('_text_ += _this_.raw(' + expression + ');');
					return matched;
				});
				this.code = codes.join('\n');
			},
			/**
			 * 指定されたインデックスのテキストを取得する.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @param {Number} index テキストノードインデックス.
			 * @returns {String} テキスト.
			 */
			text: function(index) {
				return this.texts[index];
			},
			/**
			 * 文字列をエスケープする.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @param {*} source エスケープ対象.
			 * @returns {String} エスケープ済文字列.
			 */
			escape: function(source) {
				return this.engine.escape(source);
			},
			/**
			 * 文字列化する.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @param {*} source 対象.
			 * @returns {String} 文字列.
			 */
			raw: function(source) {
				return this.engine.raw(source);
			},
			/**
			 * テンプレートを実行する.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.Template#
			 * @param {Object} _data_ テンプレートパラメタ.
			 * @returns {String} 出力文字列.
			 */
			render: function(_data_) {
				var _this_;
				var _text_;

				_this_ = this;
				_text_ = '';
				with (_data_ || {}) {
					eval(_this_.code);
				}
				return _text_;
			}
		});
		return _class_;
	})(this);
	this.TemplateEngine = (function(_namespace_) {
		var _class_;

		_class_ = _namespace_.Object.extend((
			/**
			 * @since 0.1.4
			 * @class at.pkgs.TemplateEngine
			 * @classdesc
			 *     テンプレートエンジンクラス.
			 *     チュートリアル: {@tutorial at.pkgs.Template}
			 * @extends {at.pkgs.Object}
			 * @param {at.pkgs.TemplateEngine=} instance インスタンス.
			 */
			function(instance) {
				instance = instance || this;
				this.parent.self(instance);
			}
		), { /* prototype */
			/**
			 * @since 0.1.4
			 * @typedef {Function} at.pkgs.TemplateEngine~Renderer
			 * @param {Object} data テンプレートパラメタ.
			 * @returns {String} 出力文字列.
			 */
			/**
			 * テンプレートデリミタパターン.
			 * 
			 * `/スクリプトブロックパターン|エスケープ出力ブロックパターン|直接出力ブロックパターン|$/g`形式
			 * 
			 * インスタンスの本メソッドを上書きすることでデリミタを変更可能.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.TemplateEngine#
			 * @type {RegExp}
			 */
			pattern: /\{%([\s\S]*?)%\}|\{=([\s\S]*?)=\}|\{@([\s\S]*?)@\}|$/g,
			/**
			 * エスケープ関数.
			 * 
			 * インスタンスの本メソッドを上書きすることでエスケープ処理を変更可能.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.TemplateEngine#
			 * @method
			 * @param {*} source エスケープ対象.
			 * @returns {String} エスケープ済文字列.
			 */
			escape: _namespace_.escape.html,
			/**
			 * 直接出力関数.
			 * 
			 * インスタンスの本メソッドを上書きすることで直接出力処理を変更可能.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.TemplateEngine#
			 * @method
			 * @param {*} source 対象.
			 * @returns {String} 文字列.
			 */
			raw: _namespace_.escape.empty,
			/**
			 * テンプレートソースを処理しテンプレート実行関数を生成する.
			 * 
			 * @since 0.1.4
			 * @memberof at.pkgs.TemplateEngine#
			 * @param {String} source テンプレートソース.
			 * @returns {at.pkgs.TemplateEngine~Renderer} テンプレート実行関数.
			 */
			prepare: function(source) {
				var template;
				var renderer;

				template = new _namespace_.Template(source, this);
				renderer = function(data) {
					return template.render(data);
				};
				renderer.template = template;
				return renderer;
			}
		});
		/**
		 * デフォルトテンプレートエンジンインスタンス.
		 * 
		 * 本インスタンスの各メソッドを上書きすることでat.pkgs.template()の振舞いを変更可能.
		 * 
		 * @since 0.1.4
		 * @member at.pkgs.TemplateEngine.instance
		 * @type {at.pkgs.TemplateEngine}
		 */
		_class_.instance = new _class_();
		return _class_;
	})(this);
	this.template = (function(_namespace_) {
		var _function_;

		/**
		 * デフォルトテンプレートエンジンを使用してテンプレートを処理し、テンプレート実行関数を生成する.
		 * 
		 * チュートリアル: {@tutorial at.pkgs.Template}
		 * 
		 * @since 0.1.4
		 * @method at.pkgs.template
		 * @param {String} source テンプレートソース.
		 * @returns {at.pkgs.TemplateEngine~Renderer} テンプレート実行関数.
		 */
		_function_ = function(source) {
			return _namespace_.TemplateEngine.instance.prepare(source);
		};
		return _function_;
	})(this);
})(this);
