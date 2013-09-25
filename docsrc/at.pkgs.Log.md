
ログに関する機能を提供します。
IE10以前を除くモダンブラウザではコールスタックが出力されます。

+ APIリファレンス: {@link at.pkgs.Log}

## 使用例 ##

### デバッグログの有効化 ###

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

### trap()の使用 ###

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
	// func@http://localhost/test.html:31
	// @http://localhost/test.html:41
	// _class_<.trap/<@http://localhost/~/script/vendor/at.pkgs.js?1380014279:120
	// @http://localhost/test.html:40
	
	// 例外は再throwされました。
	// Error: non-suppressed error

### trap()内における注入されたロガーの使用 ###

	at.pkgs.Log.get('test').trap(function() {
		// arguments.calleeを経由して注入されたロガーを参照します。
		arguments.callee.log.debug('optional log instance injection');
	}, false, true)();
	// [DEBUG] test: optional log instance injection
	// @http://localhost/test.html:37
	// _class_<.trap/<@http://localhost/~/script/vendor/at.pkgs.js?1380005535:120
	// @http://localhost/test.html:38

### デフォルトフォーマッタの使用 ###

	at.pkgs.Log.get('test').debug(
			'this is a formt {} | {:length} | {1:length} | {2}',
			['a', 'b'],
			['c', 'd', 'e'],
			'aaaa');
	// [DEBUG] test: this is a formt a,b | 2 | 3 | aaaa
	// @http://localhost/test.html:28

### フォーマッタの変更 ###

	// underscore.jsの_.templateを使用します。
	at.pkgs.Log.format = function(format, parameter) {
		return parameter ? (_.template(format))(parameter) : format;
	};
	//
	at.pkgs.Log.get('test').debug('テンプレート', {aaa: 1, bbb: 2})
