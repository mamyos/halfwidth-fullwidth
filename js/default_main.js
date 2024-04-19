( function()
{
	var init =
	{
		CreateAnchor: function( element, index )
		{
			var text = '';
			var id = '';

			var anchor = element.firstChild;
			if( anchor && anchor.tagName == 'A' )
			{
				text = anchor.innerHTML;

				if( anchor.id )
				{
					id = anchor.id;
				}
				else // example... <a href="">Foo</a>
				{
					id = 'no' + index;
					anchor.id = id;
				}
			}
			else
			{
				text = element.innerHTML;
				id = 'no' + index;

				anchor = document.createElement( 'a' );
				anchor.id = id;
				anchor.innerHTML = element.innerHTML;

				element.innerHTML = '';
				element.appendChild( anchor );
			}

			var link = document.createElement( 'a' );
			link.href = '#' + id;
			link.innerHTML = text;

			var listItem = document.createElement( 'li' );
			listItem.appendChild( link );

			var anchorLink = link.cloneNode( false );
			anchorLink.className = 'anchor';
			element.appendChild( anchorLink );

			return listItem;
		},
		CreateHeadingList: function()
		{
			var box = document.getElementById( 'header-list' );
			if( ! box ) return;

			var nodes = box.parentNode.childNodes;
			var list1 = document.createElement( 'ul' );
			var list2 = null;

			for( var i = 0, index = 0; i < nodes.length; i++ )
			{
				var node = nodes[ i ];
				if( ! node.tagName ) continue;

				switch( node.tagName )
				{
					case 'H2':
						list1.appendChild( this.CreateAnchor( node, ++index ) );
						list2 = null;
						break;

					case 'H3':
						if( list1.lastChild )
						{
							if( list2 == null )
							{
								list2 = document.createElement( 'ul' );
								list1.lastChild.appendChild( list2 );
							}
							list2.appendChild( this.CreateAnchor( node, ++index ) );
						}
						break;
				}
			}

			if( list1.childNodes.length == 0 )
			{
				box.parentNode.removeChild( box );
			}
			else
			{
				var caption = document.createElement( 'div' );
				caption.appendChild( document.createTextNode( 'このページの内容' ) );

				box.appendChild( caption );
				box.appendChild( list1 );
			}
		},
		HighlightCurrentLink: function()
		{
			var highlight =
			{
				PARENT_BACKGROUND_COLOR: '#ffeaea',
				BACKGROUND_COLOR: 'red',
				TEXT_COLOR: 'white',
				GetPathName: function( link )
				{
					var pathname = link.pathname;
					if( pathname.charAt( 0 ) != '/' )
					{
						pathname = '/' + pathname; // for IE
					}
					return pathname;
				},
				LinkToCurrent: function( currentPath, id, isContainUpper )
				{
					var box = document.getElementById( id );
					if( ! box ) return;

					var isLinkExist = false;

					var links = box.getElementsByTagName( 'a' );
					for( var i = links.length - 1; 0 <= i; i-- )
					{
						var link = links[ i ];
						var pathname = this.GetPathName( link );

						if( currentPath == pathname )
						{
							link.style.backgroundColor = this.BACKGROUND_COLOR;
							link.style.color = this.TEXT_COLOR;

							link.removeAttribute( 'href' );
							isLinkExist = true;
						}
						else if( isContainUpper && currentPath.indexOf( pathname ) == 0 )
						{
							link.parentNode.style.backgroundColor = this.PARENT_BACKGROUND_COLOR;

							if( ! isLinkExist )
							{
								var newLink = document.createElement( 'a' );
								newLink.style.backgroundColor = this.BACKGROUND_COLOR;
								newLink.style.color = this.TEXT_COLOR;

								newLink.appendChild( document.createTextNode( document.title ) );

								var listItem = document.createElement( 'li' );
								listItem.appendChild( newLink );

								var list = link.nextElementSibling;
								if( list == null || list.tagName != 'UL' )
								{
									list = document.createElement( 'ul' );
									link.parentNode.appendChild( list );
								}
								list.appendChild( listItem );
							}
							break;
						}
					}
				},
				LinkToUpper: function( currentPath, id )
				{
					var box = document.getElementById( id );
					if( ! box ) return;

					var links = box.getElementsByTagName( 'a' );
					for( var i = 0; i < links.length; i++ )
					{
						var link = links[ i ];
						var pathname = this.GetPathName( link );

						if( currentPath.indexOf( pathname ) == 0 )
						{
							link.style.backgroundColor = this.BACKGROUND_COLOR;
							link.style.border = '1px solid ' + this.BACKGROUND_COLOR;
							link.style.color = this.TEXT_COLOR;

							if( currentPath == pathname )
							{
								link.removeAttribute( 'href' );
							}
						}
					}
				}
			};

			var currentPath = window.location.pathname.replace( /\/index\.(htm|html|php)$/, '/' );

			// highlight.LinkToCurrent( currentPath, 'g-category', false );
			highlight.LinkToCurrent( currentPath, 'g-side', true );

			// highlight.LinkToUpper( currentPath, 'g-link' );
		},
		CopyBreadcrumbs: function()
		{
			var childNodes = document.getElementById( 'g-header' ).childNodes;
			for( var i = 0; i < childNodes.length; i++ )
			{
				var childNode = childNodes[ i ];
				if( childNode.className == 'breadcrumbs' )
				{
					var newBreadcrumbs = childNode.cloneNode( true );

					var box = document.getElementById( 'g-footer' );
					box.insertBefore( newBreadcrumbs, box.firstChild );
					break;
				}
			}
		},
		done: false,
		DelayLoad: function()
		{
			if( ! this.done )
			{
				this.done = true;

				this.HighlightCurrentLink();
				this.CopyBreadcrumbs();
			}
		}
	};

	//
	init.CreateHeadingList();

	if( document.addEventListener )
	{
		document.addEventListener( 'DOMContentLoaded', function() { init.DelayLoad(); }, false );
	}
	else if( document.attachEvent )
	{
		var CheckReadyState = function()
		{
			if( document.readyState == 'complete' )
			{
				document.detachEvent( 'onreadystatechange', CheckReadyState );
				init.DelayLoad();
			}
		}
		document.attachEvent( 'onreadystatechange', CheckReadyState );

		( function()
		{
			try
			{
				document.documentElement.doScroll( 'left' );
			}
			catch( e )
			{
				window.setTimeout( arguments.callee, 10 );
				return;
			}

			document.detachEvent( 'onreadystatechange', CheckReadyState );
			init.DelayLoad();
		} )();
	}
	else
	{
		init.DelayLoad();
	}
} )();