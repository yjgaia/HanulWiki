HanulWiki.Ban = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';
		
		var
		// ban room
		banRoom = HanulWiki.ROOM('banRoom'),
		
		// wrapper
		wrapper = DIV({
			c : FORM({
				c : [INPUT({
					name : 'ip'
				}), INPUT({
					type : 'submit'
				})],
				on : {
					submit : function(e, form) {
						
						var
						// data
						data = form.getData();
						
						banRoom.send({
							methodName : 'ban',
							data : data.ip
						}, function() {
							createBan(data.ip);
							form.setData({});
						});
					}
				}
			})
		}).appendTo(HanulWiki.Layout.getContent()),
		
		// create ban.
		createBan = function(ip) {
			
			var
			// dom
			dom;
			
			wrapper.append(dom = DIV({
				style : {
					marginTop : 10
				},
				c : [ip, A({
					style : {
						marginLeft : 10,
						fontSize : 12,
						color : CONFIG.HanulWiki.baseColor
					},
					c : '삭제',
					on : {
						tap : function() {
							if (confirm('정말 삭제하시겠습니까?') === true) {
								banRoom.send({
									methodName : 'noBan',
									data : ip
								}, function() {
									dom.remove();
								});
							}
						}
					}
				})]
			}));
		};
		
		banRoom.send({
			methodName : 'getBanList'
		}, EACH(createBan));
		
		TITLE(CONFIG.title + ' :: 제한 IP');
		
		inner.on('close', function() {
			banRoom.exit();
			wrapper.remove();
		});
	}
});
