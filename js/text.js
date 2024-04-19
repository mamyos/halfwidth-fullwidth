function AppendCopyButton( element )
{
	if( typeof element === 'string' )
	{
		element = document.getElementById( element );
	}

	var button = document.createElement( 'a' );
	button.className = 'copy';
	button.href = 'javascript:;';
	button.title = 'クリップボードへコピー';
	button.appendChild( document.createTextNode( 'コピー' ) );

	button.onclick = function()
	{
		element.select();
		if( document.execCommand( 'copy' ) )
		{
			element.style.background = 'url("./images/copied.png") center center no-repeat';
			window.setTimeout( function() { element.style.background = ''; }, 1000 );
		}
		else
		{
			this.removeAttribute( 'href' );
			this.firstChild.data = '失敗';
		}
		return false;
	}
	element.parentNode.insertBefore( button, element.nextSibling );
}

function AppendDownloadButton( element, filename )
{
	if( typeof element === 'string' )
	{
		element = document.getElementById( element );
	}

	var button = document.createElement( 'a' );
	if( 'download' in button )
	{
		button.className = 'download';
		button.href = 'javascript:;';
		button.title = 'ファイルに保存';
		button.download = filename + '.txt';
		button.appendChild( document.createTextNode( '保存' ) );

		button.onclick = function()
		{
			this.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent( element.value );
		}
		element.parentNode.insertBefore( button, element.nextSibling );
	}
}