
基本的な継承に関わる機能を提供します。

+ APIリファレンス: {@link at.pkgs.Object}

## 使用例 ##

### 基底クラスのメソッド呼び出し(正しい方法) ###

基底クラスのメソッドを呼び出すメソッドはインスタンス変数を伝播するように設計してください。

	var A, B, C;
	
	A = at.pkgs.Object.extend((
		function(num, instance) {
			instance = instance || this;
			this.parent.self(instance);
			console.log('A(' + num + ')');
			instance.x = num;
		}
	), { /* prototype */
		x: null,
		f: function() {
			console.log('A.x: ' + this.x);
		}
	}, { /* statics */
		
	});
	
	B = A.extend((
		function(num, instance) {
			instance = instance || this;
			this.parent.self(num, instance);
			console.log('B');
		}
	), { /* prototype */
		
	}, { /* statics */
		
	});
	
	C = B.extend((
		function(num, instance) {
			instance = instance || this;
			this.parent.self(num, instance);
			console.log('C');
		}
	), { /* prototype */
		
	}, { /* statics */
		
	});
	
	var c0, c1;
	
	c0 = new C(0);
	// A(0)
	// B
	// C
	c1 = new C(1);
	// A(1)
	// B
	// C
	c0.f();
	// A.x: 0
	c1.f();
	// A.x: 1

### 基底クラスのメソッド呼び出し: 誤った方法#1: 親クラスのプロトタイプ汚染 ###

基底クラスへインスタンス変数を渡さないため親クラスのプロトタイプが汚染されます。

	var A, B, C;
	
	A = at.pkgs.Object.extend((
		function(num) {
			this.parent.self();
			console.log('A(' + num + ')');
			// !!!!!!!!!!
			this.x = num;
		}
	), { /* prototype */
		x: null,
		f: function() {
			console.log('A.x: ' + this.x);
		}
	}, { /* statics */
		
	});
	
	B = A.extend((
		function(num) {
			this.parent.self(num);
			console.log('B');
		}
	), { /* prototype */
		
	}, { /* statics */
		
	});
	
	C = B.extend((
		function(num) {
			this.parent.self(num);
			console.log('C');
		}
	), { /* prototype */
		
	}, { /* statics */
		
	});
	
	var c0, c1;
	
	c0 = new C(0);
	// A(0)
	// B
	// C
	c1 = new C(1);
	// A(1)
	// B
	// C
	c0.f();
	// !!!!!!
	// A.x: 1
	c1.f();
	// A.x: 1

### 基底クラスのメソッド呼び出し: 誤った方法#2: 親クラスから親クラスのメソッドが呼び出せない ###

基底クラスへインスタンス変数を渡さないため親クラスのプロトタイプが汚染されます。

	var A, B, C;
	
	A = at.pkgs.Object.extend((
		function(num) {
			this.parent.self.call(this);
			console.log('A(' + num + ')');
			this.x = num;
		}
	), { /* prototype */
		x: null,
		f: function() {
			console.log('A.x: ' + this.x);
		}
	}, { /* statics */
		
	});
	
	B = A.extend((
		function(num) {
			this.parent.self.call(this, num);
			console.log('B');
		}
	), { /* prototype */
		
	}, { /* statics */
		
	});
	
	C = B.extend((
		function(num) {
			this.parent.self.call(this, num);
			console.log('C');
		}
	), { /* prototype */
		
	}, { /* statics */
		
	});
	
	var c0;
	
	c0 = new C(0);
	// B
	// B
	// B
	// B
	// B
	// ...
