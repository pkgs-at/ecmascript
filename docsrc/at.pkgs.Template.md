
underscore.jsテンプレート相当のテンプレート処理を提供します。

+ APIリファレンス: {@link at.pkgs.Template}
+ APIリファレンス: {@link at.pkgs.TemplateEngine}
+ APIリファレンス: {@link at.pkgs.template}

## テンプレートの記述 ##

デフォルトのテンプレートブロックのデリミタは下記の通りになっています。
このデリミタは変更できます(後述)。

### `{% ... %}` ###

このブロックはJavaScriptコードとして実行されます。

### `{= ... =}` ###

このブロックの式を評価し、エスケープ処理した後出力されます。
エスケープ処理は「`<>'"&`」を実体参照に変換するHTMLエスケープ相当の処理を行いますが、この挙動は変更できます。

### `{@ ... @}` ###

このブロックは式を評価し、直接(エスケープなどされずに)出力されます。
`null`や`undefined`は空文字として出力されますが、この挙動は変更できます。

## 使用例 ##

### テンプレート処理 ###

	var template;

	template = at.pkgs.template('\
	  あいうえお\
	  {% if (a) { %}\
	  aaaa\
	  {% } else { %}\
	  bbbb\
	  {% } %}\
	  cccc\n\
	  {@ b.c + 1 @}\
	  {= d =}\
	  zzzz\
	  cccc');
	console.log(template({ a: false, b: { c:2 }, d:'<a href="sss">aa</a>' }));
	//   あいうえお    bbbb    cccc  3  &lt;a href=&quot;sss&quot;&gt;aa&lt;/a&gt;  zzzz  cccc

### デリミタの変更 ###

下記のようにデリミタが変更できます。
同様にデフォルトのHTMLエスケープ処理を差し替え可能です。
詳細はAPIリファレンスを参照してください。

	var template;
	
	at.pkgs.TemplateEngine.instance.pattern = /<%(.*?)%>|<=(.*?)=>|<@(.*?)@>|$/g;
	template = at.pkgs.template('\
	  あいうえお\
	  <% if (a) { %>\
	  aaaa\
	  <% } else { %>\
	  bbbb\
	  <% } %>\
	  cccc\n\
	  <@ b.c + 1 @>\
	  <= d =>\
	  zzzz\
	  cccc');

### ファクトリの使用 ###

デリミタの変更などをテンプレートエンジンごとに行うためにコンストラクタが使用可能です。

	var engine;
	var template;
	
	engine = new TemplateEngine();
	engine.escape = function (source) { ... };
	template = engine.prepare(source);
