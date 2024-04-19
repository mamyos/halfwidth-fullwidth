( function()
{
	var KanaFullMap =
		( 'ヴ ガ ギ グ ゲ ゴ ザ ジ ズ ゼ ゾ ダ ヂ ヅ デ ド バ ビ ブ ベ ボ パ ピ プ ペ ポ '
		+ 'ア イ ウ エ オ カ キ ク ケ コ サ シ ス セ ソ タ チ ツ テ ト ナ ニ ヌ ネ ノ ハ ヒ フ ヘ ホ マ ミ ム メ モ ヤ ユ ヨ ラ リ ル レ ロ ワ ヲ ン '
		+ 'ァ ィ ゥ ェ ォ ャ ュ ョ ッ ー ◌゙ \u3099 ◌゚ \u309A 、 。 「 」' ).split( ' ' );

	var KanaHalfMap =
		( 'ｳﾞ ｶﾞ ｷﾞ ｸﾞ ｹﾞ ｺﾞ ｻﾞ ｼﾞ ｽﾞ ｾﾞ ｿﾞ ﾀﾞ ﾁﾞ ﾂﾞ ﾃﾞ ﾄﾞ ﾊﾞ ﾋﾞ ﾌﾞ ﾍﾞ ﾎﾞ ﾊﾟ ﾋﾟ ﾌﾟ ﾍﾟ ﾎﾟ '
		+ 'ｱ ｲ ｳ ｴ ｵ ｶ ｷ ｸ ｹ ｺ ｻ ｼ ｽ ｾ ｿ ﾀ ﾁ ﾂ ﾃ ﾄ ﾅ ﾆ ﾇ ﾈ ﾉ ﾊ ﾋ ﾌ ﾍ ﾎ ﾏ ﾐ ﾑ ﾒ ﾓ ﾔ ﾕ ﾖ ﾗ ﾘ ﾙ ﾚ ﾛ ﾜ ｦ ﾝ '
		+ 'ｧ ｨ ｩ ｪ ｫ ｬ ｭ ｮ ｯ ｰ ﾞ ﾞ ﾟ ﾟ ､ ｡ ｢ ｣' ).split( ' ' );

	var SymbolFullMap = ( '｟ ｠ ￠ ￡ ￢ ￣ ￤ ￥ ￦ │ ← ↑ → ↓ ■ ○ ・' ).split( ' ' );

	var SymbolHalfMap = ( '⦅ ⦆ ¢ £ ¬ ¯ ¦ ¥ ₩ ￨ ￩ ￪ ￫ ￬ ￭ ￮ ･' ).split( ' ' );

	var result = document.getElementById( 'result' );

	var form = document.getElementById( 'text-form' );
	form.onsubmit = form.text.oninput = function()
	{
		result.parentNode.style.display = '';

		form.submit.nextSibling.nextSibling.style.display = '';
		window.setTimeout( function() { form.submit.nextSibling.nextSibling.style.display = 'none'; }, 100 );

		//
		var fullType = {
			kana: form.kana[ 0 ].checked,
			number: form.number[ 0 ].checked,
			latin: form.latin[ 0 ].checked,
			symbol: form.symbol[ 0 ].checked,
			symbol2: form.symbol2[ 0 ].checked,
			space: form.space[ 0 ].checked
			};

		var halfType = {
			kana: form.kana[ 1 ].checked,
			number: form.number[ 1 ].checked,
			latin: form.latin[ 1 ].checked,
			symbol: form.symbol[ 1 ].checked,
			symbol2: form.symbol2[ 1 ].checked,
			space: form.space[ 1 ].checked
			};

		var text = form.text.value;
		text = Convert( text, false, fullType );
		text = Convert( text, true, halfType );

		result.value = text;
		result.className = ( text === form.text.value )? 'nochange' : '';
		return false;
	}
	form.text.select();

	form.onreset = function()
	{
			form.text.value = '';
			form.onsubmit();
			return false;
	}

	var cookie = document.cookie.split( '; ' )[ 0 ].split( '=' )[ 1 ];
	var checks = cookie? cookie.split( '.' ) : [];

	var inputs = form.getElementsByTagName( 'input' );
	for( var i = 0; i < inputs.length; i ++ )
	{
		if( inputs[ i ].type == 'radio' )
		{
			if( checks.shift() )
			{
				inputs[ i ].checked = true;
			}

			inputs[ i ].onchange = function()
			{
				form.onsubmit();
				UpdateCookie( inputs );
			}
		}
	}

	var links = form.getElementsByTagName( 'a' );
	links[ 0 ].onclick = links[ 1 ].onclick = links[ 2 ].onclick = function()
	{
		var inputsInRow = this.parentNode.parentNode.getElementsByTagName( 'input' );
		for( var i = 0; i < inputsInRow.length; i ++ )
		{
			if( inputsInRow[ i ].type == 'radio' )
			{
				inputsInRow[ i ].checked = true;
			}
		}
		form.onsubmit();
		UpdateCookie( inputs );
	}

	AppendDownloadButton( result, 'fullwidth-halfwidth' );
	AppendCopyButton( result );


	function Convert( text, isHalf, type )
	{
		var Diff = 'Ａ'.charCodeAt( 0 ) - 'A'.charCodeAt( 0 );
		var ToHalf = function( str )
		{
			return String.fromCharCode( str.charCodeAt( 0 ) - Diff );
		}
		var ToFull= function( str )
		{
			return String.fromCharCode( str.charCodeAt( 0 ) + Diff );
		}


		if( type.number )
		{
			if( isHalf ) text = text.replace( /[０-９]/g, ToHalf );
			else text = text.replace( /[0-9]/g, ToFull );
		}

		if( type.latin )
		{
			if( isHalf ) text = text.replace( /[Ａ-Ｚａ-ｚ]/g, ToHalf );
			else text = text.replace( /[a-zA-Z]/g, ToFull );
		}

		if( type.symbol )
		{
			if( isHalf ) text = text.replace( /[！-／：-＠［-｀｛-～]/g, ToHalf );
			else text = text.replace( /[!-/:-@\[-`{-~]/g, ToFull );
		}

		if( type.space )
		{
			if( isHalf ) text = text.replace( /\u3000/g, '\u0020' );
			else text = text.replace( /\u0020/g, '\u3000' );
		}

		if( type.kana )
		{
			if( isHalf )
			{
				for( var i = 0; i < KanaFullMap.length; i++ )
					text = text.replace( new RegExp( KanaFullMap[ i ], 'g' ), KanaHalfMap[ i ] );
			}
			else
			{
				for( var i = 0; i < KanaHalfMap.length; i++ )
					text = text.replace( new RegExp( KanaHalfMap[ i ], 'g' ), KanaFullMap[ i ] );
			}
		}

		if( type.symbol2 )
		{
			if( isHalf )
			{
				for( var i = 0; i < SymbolFullMap.length; i++ )
					text = text.replace( new RegExp(  SymbolFullMap[ i ], 'g' ),  SymbolHalfMap[ i ] );
			}
			else
			{
				for( var i = 0; i <  SymbolHalfMap.length; i++ )
					text = text.replace( new RegExp(  SymbolHalfMap[ i ], 'g' ),  SymbolFullMap[ i ] );
			}
		}

		return text;	
	}


	function UpdateCookie( inputs )
	{
		var checks = [];
		for( var i = 0; i < inputs.length; i ++ )
		{
			if( inputs[ i ].type == 'radio' )
			{
				checks.push( inputs[ i ].checked? '1' : '' );
			}
		}
		document.cookie = 'convert=' + checks.join( '.' ) + '; max-age=' + ( 3600 * 240 );
	}
} )();