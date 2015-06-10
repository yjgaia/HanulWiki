HanulWiki.Layout = CLASS(function(cls) {
	'use strict';

	var
	// license style
	licenseStyle = {
		fontSize : 12
	},
	
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
			
			// footer
			footer,
			
			// layout
			layout = DIV({
				style : {
					backgroundColor : '#fff',
					color : '#000'
				},
				c : [menu = DIV({
					style : {
						backgroundColor : '#4183C4',
						color : '#fff',
						fontWeight : 'bold'
					}
				}),
				
				content = DIV({
					style : {
						padding : 10
					}
				}),
				
				footer = DIV({
					style : {
						borderTop : '1px solid #ccc',
						backgroundColor : '#eee',
						padding : 10
					}
				})]
			}).appendTo(BODY);
			
			if (CONFIG.HanulWiki !== undefined) {
				
				if (CONFIG.HanulWiki.license === 'CC BY') {
					footer.append(DIV({
						style : licenseStyle,
						c : [A({
							href : 'http://creativecommons.org/licenses/by/4.0/',
							c : IMG({
								src : 'https://i.creativecommons.org/l/by/4.0/88x31.png'
							})
						}), BR(), '이 저작물은 ', A({
							href : 'http://creativecommons.org/licenses/by/4.0/',
							c : '크리에이티브 커먼즈 저작자표시 4.0 국제 라이선스'
						}), '에 따라 이용할 수 있습니다.']
					}));
				}
				
				else if (CONFIG.HanulWiki.license === 'CC BY-SA') {
					footer.append(DIV({
						style : licenseStyle,
						c : [A({
							href : 'http://creativecommons.org/licenses/by-sa/4.0/',
							c : IMG({
								src : 'https://i.creativecommons.org/l/by-sa/4.0/88x31.png'
							})
						}), BR(), '이 저작물은 ', A({
							href : 'http://creativecommons.org/licenses/by-sa/4.0/',
							c : '크리에이티브 커먼즈 저작자표시-동일조건변경허락 4.0 국제 라이선스'
						}), '에 따라 이용할 수 있습니다.']
					}));
				}
				
				else if (CONFIG.HanulWiki.license === 'CC BY-ND') {
					footer.append(DIV({
						style : licenseStyle,
						c : [A({
							href : 'http://creativecommons.org/licenses/by-nd/4.0/',
							c : IMG({
								src : 'https://i.creativecommons.org/l/by-nd/4.0/88x31.png'
							})
						}), BR(), '이 저작물은 ', A({
							href : 'http://creativecommons.org/licenses/by-nd/4.0/',
							c : '크리에이티브 커먼즈 저작자표시-변경금지 4.0 국제 라이선스'
						}), '에 따라 이용할 수 있습니다.']
					}));
				}
				
				else if (CONFIG.HanulWiki.license === 'CC BY-NC') {
					footer.append(DIV({
						style : licenseStyle,
						c : [A({
							href : 'http://creativecommons.org/licenses/by-nc/4.0/',
							c : IMG({
								src : 'https://i.creativecommons.org/l/by-nc/4.0/88x31.png'
							})
						}), BR(), '이 저작물은 ', A({
							href : 'http://creativecommons.org/licenses/by-nc/4.0/',
							c : '크리에이티브 커먼즈 저작자표시-비영리 4.0 국제 라이선스'
						}), '에 따라 이용할 수 있습니다.']
					}));
				}
				
				else if (CONFIG.HanulWiki.license === 'CC BY-NC-SA') {
					footer.append(DIV({
						style : licenseStyle,
						c : [A({
							href : 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
							c : IMG({
								src : 'https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png'
							})
						}), BR(), '이 저작물은 ', A({
							href : 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
							c : '크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스'
						}), '에 따라 이용할 수 있습니다.']
					}));
				}
				
				else if (CONFIG.HanulWiki.license === 'CC BY-NC-ND') {
					footer.append(DIV({
						style : licenseStyle,
						c : [A({
							href : 'http://creativecommons.org/licenses/by-nc-nd/4.0/',
							c : IMG({
								src : 'https://i.creativecommons.org/l/by-nc-nd/4.0/88x31.png'
							})
						}), BR(), '이 저작물은 ', A({
							href : 'http://creativecommons.org/licenses/by-nc-nd/4.0/',
							c : '크리에이티브 커먼즈 저작자표시-비영리-변경금지 4.0 국제 라이선스'
						}), '에 따라 이용할 수 있습니다.']
					}));
				}
			}
			
			authRoom.send({
				methodName : 'auth',
				data : passwordStore.get('password')
			}, function(_isAuthed) {
				
				isAuthed = _isAuthed;
				
				if (inner.checkIsClosed() !== true) {
					
					menu.append(H1({
						style : {
							flt : 'left',
							padding : 10,
							cursor : 'pointer'
						},
						c : CONFIG.title,
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
