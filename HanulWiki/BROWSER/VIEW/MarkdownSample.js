HanulWiki.MarkdownSample = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';
		
		var
		// editor
		editor,
		
		// content
		content,
		
		// wrapper
		wrapper = DIV({
			c : [DIV({
				style : {
					flt : 'left',
					width : '50%',
					height : '100%'
				},
				c : editor = UUI.FULL_TEXTAREA({
					style : {
						backgroundColor : '#000',
						padding : 10,
						onDisplayResize : function(width, height) {
							return {
								height : height - 20
							};
						}
					},
					textareaStyle : {
						color : '#fff',
						lineHeight : '1.4em'
					},
					on : {
						keyup : function(e, textarea) {
							content.getEl().innerHTML = marked(textarea.getValue());
						},
						change : function(e, textarea) {
							content.getEl().innerHTML = marked(textarea.getValue());
						}
					}
				})
			}), UUI.PANEL({
				style : {
					flt : 'right',
					width : '50%',
					backgroundColor : '#fff',
					overflowY : 'scroll',
					onDisplayResize : function(width, height) {
						return {
							height : height
						};
					}
				},
				contentStyle : {
					padding : 10
				},
				c : content = P({
					style : {
						fontSize : 14
					}
				})
			}), CLEAR_BOTH()]
		}).appendTo(BODY);
		
		content.getEl().setAttribute('class', 'markdown-body');
		
		HanulWiki.R('sample.md', function(md) {
			editor.setValue(md);
		});
		
		TITLE('문법 소개 - ' + CONFIG.title);

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
