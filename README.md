at.pkgs.js
========
ECMAScript/JavaScript向けのライブラリスタックです。

at.pkgs.js (core)
--------
実行環境に依存しないコアコンポーネントを提供します。

### at.pkgs.Object ###
基本的な継承に関わる機能を提供します。

#### parent ####
親クラスのプロトタイプを参照します。
この参照を使用してサブクラスから基底クラスのメソッドを呼び出すことが可能です。

#### self ####
クラスオブジェクト(コンストラクタ)を参照します。

#### static extend() ####
基底クラスを拡張し、サブクラスを生成します。

	SubClass = SuperClass.extend(
			constructor,
			prototype,
			statics);
+ 引数
	+ `constructor`  
		コンストラクタとなるFunctionです。  
		コンストラクタ内では、`this.parent.self()`とすることで基底クラスのコンストラクタを呼び出すことが可能です。  
		コンストラクタ内の自動変数`this`を経由したインスタンスメソッドの呼び出しは避けてください(サブクラスから呼び出された場合に、他のインスタンスメソッドにおける実行コンテキストと異なるコンテキストで実行されるためです)。
	+ `prototype`  
		プロトタイプにコピーされるインスタンスメンバを持つオブジェクトです。  
	+ (省略可能) `statics`  
		サブクラスにコピーされるスタティックメンバを持つオブジェクトです。
+ 戻り値
	+ `SubClass`
		サブクラスです。

### at.pkgs.Log ###
ログに関する機能を提供します。
IE10以前を除くモダンブラウザではコールスタックが出力されます。

#### debug(), info(), error() ####
それぞれのレベルのログを出力します。
フォーマッタに関しては使用例を参照してください。

	enabled = log.debug(message);

+ 引数
	+ (省略可能) `message`  
		ログメッセージです。  
		省略時はログの有効確認のみを行います。
+ 戻り値
	+ `enabled`  
		ログが有効であればtrueを返します。

#### trap() ####
関数をラップし、例外をログに補足可能にします。

	func = log.trap(
			callback,
			supress,
			inject);

+ 引数
	+ `callback`  
		ラップ対象の関数です。
	+ (省略可能) `supress`  
		真が指定された場合、例外の再throwを行いません。
	+ (省略可能) `inject`  
		真が指定された場合、ラップ対象の関数にlogメンバを追加(注入)します。  
		使用例を参照してください。
+ 戻り値
	+ `func`  
		コールバックをラップする匿名関数です。

#### static get() ####
ログの名称を指定してロガーを取得します。

	log = at.pkgs.Log.get(
			name);

+ 引数
	+ `name`  
		ログの名称です。
+ 戻り値
	+ `log`  
		ロガーのインスタンスです。

#### static debug() ####
ログの名称を指定してデバッグ出力を有効にします。

	Log = at.pkgs.Log.debug(
			name);

+ 引数
	+ `name`  
		ログの名称です。
+ 戻り値
	+ `Log`  
		ログクラスです。

#### static format() ####
ログのフォーマットを行います。
このメソッドを上書きすることで任意のフォーマッタを使用可能です。

デフォルトのロガーは{`0から始まる引数番号`:`キー`}形式のフォーマットを解釈します。

	message = at.pkgs.Log.format(
			format,
			parameters);

+ 引数
	+ `format`  
		フォーマット指示子またはメッセージです。
	+ (可変長) `parameters`  
		このメソッドにはインスタンスメソッドdebug()、info()、error()に渡されたすべての引数が渡されます。
+ 戻り値
	+ `message`  
		フォーマットされた文字列です。

#### 使用例 ####

##### デバッグログの切替 #####

	var log;
	
	log = at.pkgs.Log.get('test');
	
	log.error('error: always enabled');
	// [ERROR] test: error: always enabled
	// @http://localhost/test.html:24
	
	log.info('info: always enabled');
	// [INFO] test: info: always enabled
	// @http://localhost/test.html:25
	
	log.debug('debug: disabled by default');
	
	at.pkgs.Log.debug('test');
	
	log.debug('debug: enabled');
	// [DEBUG] test: debug: enabled
	// @http://localhost/test.html:28

##### trap()の使用 #####

	var log;
	var func;
	
	log = at.pkgs.Log.get('test');
	func = function(message) {
		throw Error(message);
	};
	
	log.trap(function() {
		log.debug('debug');
		func('suppressed error');
	}, true)();
	// [ERROR] test: Error: suppressed error
	// func@http://localhost/test.html:31
	// @http://localhost/test.html:35
	// _class_<.trap/<@http://localhost/~/script/vendor/at.pkgs.js?1380014279:120
	// @http://localhost/test.html:36
	
	// 例外は再throwされません。
	
	log.trap(function() {
		func('non-suppressed error');
	})();
	// [ERROR] test: Error: non-suppressed error
	// func@http://localhost:8902/test.html:31
	// @http://localhost:8902/test.html:41
	// _class_<.trap/<@http://localhost:8902/~/script/vendor/at.pkgs.js?1380014279:120
	// @http://localhost:8902/test.html:40
	
	// 例外は再throwされました。
	// Error: non-suppressed error

##### trap()内における注入されたロガーの使用 #####

	at.pkgs.Log.get('test').trap(function() {
		// arguments.calleeを経由して注入されたロガーを参照します。
		arguments.callee.log.debug('optional log instance injection');
	}, false, true)();
	// [DEBUG] test: optional log instance injection
	// @http://localhost/test.html:37
	// _class_<.trap/<@http://localhost/~/script/vendor/at.pkgs.js?1380005535:120
	// @http://localhost/test.html:38

##### デフォルトフォーマッタの使用 #####

	at.pkgs.Log.get('test').debug(
			'this is a formt {} | {:length} | {1:length} | {2}',
			['a', 'b'],
			['c', 'd', 'e'],
			'aaaa');
	// [DEBUG] test: this is a formt a,b | 2 | 3 | aaaa
	// @http://localhost/test.html:28

##### フォーマッタの変更 #####

	// underscore.jsの_.templateを使用します。
	at.pkgs.Log.format = function(format, parameter) {
		return parameter ? (_.template(format))(parameter) : format;
	};
	//
	at.pkgs.Log.get('test').debug('テンプレート', {aaa: 1, bbb: 2})

### at.pkgs.EventBinder ###

TODO

ライセンス
--------
本ライブラリは下記に示す通り Apache License 2.0 にて提供します。
商用・非商用を問わず、使用や頒布、派生物の頒布を制限しません。

	Copyright (c) 2009-2013, Architector Inc., Japan
	All rights reserved.
	
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at
	
		http://www.apache.org/licenses/LICENSE-2.0
	
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
