
イベント通知用のバインダを提供します。

+ APIリファレンス: {@link at.pkgs.EventBinder}

## 使用例 ##

### 様々な使用方法 ###

	var binder;
	
	binder = new at.pkgs.EventBinder();
	binder.bind(function(value) {
		console.log('0: fired! ' + value);
	});
	binder.bind(function(value) {
		console.log('1: fired! ' + value);
		// 自分自身をunbindします。
		binder.unbind(this);
		// 後続のハンドラを呼び出しません。
		return false;
	});
	binder.bind(function(value) {
		console.log('2: fired! ' + value);
	});
	binder.bind(function(value) {
		console.log('-1: fired! ' + value);
	}, true); // このハンドラを先頭に追加します。
	
	binder.fire('first');
	// -1: fired! first
	// 0: fired! first
	// 1: fired! first
	
	binder.fire('second');
	// -1: fired! second
	// 0: fired! second
	// 2: fired! second
