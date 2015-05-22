HanulWiki.Layout = CLASS(function(cls) {
	'use strict';

	var
	// is authed
	isAuthed = false,
	
	// content
	content,
	
	// check is authed.
	checkIsAuthed,
	
	// get content.
	getContent;
	
	cls.checkIsAuthed = checkIsAuthed = function() {
		return isAuthed;
	};
	
	cls.getContent = getContent = function() {
		return content;
	};

	return {

		preset : function() {
			return VIEW;
		},

		init : function(inner, self) {

			var
			// password store
			passwordStore = HanulWiki.STORE('passwordStore'),
			
			// auth room
			authRoom = HanulWiki.ROOM('authRoom'),
			
			// menu
			menu,
			
			// layout
			layout = DIV({
				c : [menu = DIV(), content = DIV()]
			}).appendTo(BODY);
			
			authRoom.send({
				methodName : 'auth',
				data : passwordStore.get('password')
			}, function(_isAuthed) {
				
				isAuthed = _isAuthed;
				
				if (inner.checkIsClosed() !== true) {
				
					menu.append(UUI.BUTTON_H({
						style : {
							flt : 'left',
							padding : 10
						},
						title : '처음으로',
						on : {
							tap : function() {
								HanulWiki.GO('');
							}
						}
					}));
					
					menu.append(UUI.BUTTON_H({
						style : {
							flt : 'left',
							padding : 10
						},
						title : isAuthed === true ? '글 작성' : '로그인',
						on : {
							tap : function() {
								HanulWiki.GO(isAuthed === true ? 'func/new' : 'func/login');
							}
						}
					}));
					
					menu.append(CLEAR_BOTH());
				}
			
				inner.on('uriChange', function(uri) {
					if (CONFIG.HanulWiki !== undefined && CONFIG.HanulWiki.isPrivate === true && isAuthed !== true && uri !== 'func/login') {
						HanulWiki.GO('func/login');
					}
				});
			});
			
			inner.on('close', function() {
				authRoom.exit();
				layout.remove();
				content = undefined;
			});
		}
	};
});
