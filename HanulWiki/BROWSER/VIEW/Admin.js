HanulWiki.Admin = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// button style
		buttonStyle = {
			marginBottom : 10,
			color : CONFIG.HanulWiki.baseColor
		},
		
		// wrapper
		wrapper = UL({
			c : [LI({
				style : buttonStyle,
				c : A({
					c : '작성/수정 제한 항목 관리',
					href : HanulWiki.HREF('func/blocktag'),
					on : {
						tap : function(e) {
							HanulWiki.GO('func/blocktag');
						}
					}
				})
			}), LI({
				style : buttonStyle,
				c : A({
					c : 'IP 차단 관리',
					href : HanulWiki.HREF('func/ban'),
					on : {
						tap : function(e) {
							HanulWiki.GO('func/ban');
						}
					}
				})
			})]
		}).appendTo(HanulWiki.Layout.getContent());
		
		TITLE('관리 - ' + CONFIG.title);

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
