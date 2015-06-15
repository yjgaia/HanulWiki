HanulWiki.Layout = CLASS(function(cls) {
	'use strict';

	var
	// license style
	licenseStyle = {
		fontSize : 12,
		marginTop : 10
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
			// scroll store
			scrollStore = HanulWiki.STORE('scroll'),
			
			// password store
			passwordStore = HanulWiki.STORE('passwordStore'),
			
			// auth room
			authRoom = HanulWiki.ROOM('authRoom'),
			
			// tap event
			tapEvent = EVENT('tap', function() {
				if (searchResult !== undefined) {
					searchResult.remove();
					searchResult = undefined;
				}
			}),
			
			// menu
			menu,
			
			// count dom
			countDom,
			
			// footer
			footer,
			
			// search result
			searchResult,
			
			// layout
			layout = DIV({
				style : {
					backgroundColor : '#fff',
					color : '#000'
				},
				c : [menu = DIV({
					style : {
						backgroundColor : CONFIG.HanulWiki.baseColor,
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
						padding : '0 10px 10px 10px'
					}
				})]
			}).appendTo(BODY);
				
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
			
			if (CONFIG.HanulWiki.copyright !== undefined) {
				footer.append(DIV({
					style : licenseStyle,
					c : CONFIG.HanulWiki.copyright
				}));
			}
			
			footer.append(DIV({
				style : licenseStyle,
				c : [CONFIG.title + '는 ', A({
					target : '_blank',
					href : 'https://github.com/Hanul/HanulWiki',
					c : '하늘 위키'
				}), '를 기반으로 합니다. ', A({
					target : '_blank',
					href : 'https://github.com/Hanul/HanulWiki',
					c : '하늘 위키'
				}), '는 오픈소스 소프트웨어 입니다.']
			}));
			
			authRoom.send({
				methodName : 'auth',
				data : passwordStore.get('password')
			}, function(_isAuthed) {
				
				isAuthed = _isAuthed;
				
				if (inner.checkIsClosed() !== true) {
					
					if (CONFIG.HanulWiki.logo !== undefined) {
					
						menu.append(IMG({
							style : {
								flt : 'left',
								cursor : 'pointer'
							},
							src : HanulWiki.R(CONFIG.HanulWiki.logo),
							on : {
								tap : function() {
									scrollStore.remove('top');
									HanulWiki.GO('');
								}
							}
						}));
					}
					
					menu.append(H1({
						style : {
							flt : 'left',
							padding : 10,
							cursor : 'pointer',
							fontWeight : 'bold'
						},
						c : CONFIG.title,
						on : {
							tap : function() {
								scrollStore.remove('top');
								HanulWiki.GO('');
							}
						}
					}));
				
					menu.append(FORM({
						style : {
							flt : 'left'
						},
						c : [UUI.FULL_INPUT({
							style : {
								margin : '5px 0',
								flt : 'left',
								width : 100
							},
							name : 'id',
							on : {
								keyup : function(e, input) {
									
									if (searchResult !== undefined) {
										searchResult.remove();
									}
									
									if (input.getValue().trim() !== '') {
									
										searchResult = DIV({
											style : {
												position : 'absolute',
												left : input.getLeft(),
												top : input.getTop() + input.getHeight(),
												backgroundColor : '#eee',
												color : '#000'
											}
										}).appendTo(BODY);
										
										HanulWiki.ArticleModel.searchIds(input.getValue(), EACH(function(id) {
											searchResult.append(UUI.BUTTON_H({
												style : {
													border : '1px solid #ccc',
													marginBottom : -1,
													padding : 5
												},
												c : id,
												on : {
													tap : function() {
														HanulWiki.GO(id.replace(/\//g, '@!'));
													}
												}
											}));
										}));
									}
								}
							}
						}), UUI.FULL_SUBMIT({
							style : {
								margin : '5px 0',
								flt : 'left',
								width : 50,
								padding : 5,
								backgroundColor : '#ccc'
							},
							value : '이동'
						}), CLEAR_BOTH()],
						on : {
							submit : function(e, form) {
								HanulWiki.GO(form.getData().id.replace(/\//g, '@!'));
							}
						}
					}));
					
					menu.append(UUI.BUTTON_H({
						style : {
							marginLeft : 10,
							flt : 'left',
							padding : 10
						},
						title : '처음으로',
						on : {
							tap : function() {
								scrollStore.remove('top');
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
					
					if (isAuthed === true) {
					
						menu.append(UUI.BUTTON_H({
							style : {
								flt : 'left',
								padding : 10
							},
							title : '토론',
							on : {
								tap : function() {
									HanulWiki.GO('func/talk');
								}
							}
						}));
					}
					
					menu.append(UUI.BUTTON_H({
						style : {
							flt : 'left',
							padding : 10
						},
						title : '랜덤',
						on : {
							tap : function() {
								HanulWiki.ArticleModel.get({
									isRandom : true
								}, function(articleData) {
									HanulWiki.GO(articleData.id.replace(/\//g, '@!'));
								});
							}
						}
					}));
					
					menu.append(countDom = DIV({
						style : {
							flt : 'right',
							padding : 10
						},
						title : '전체 항목 수: 로딩중...'
					}));
					
					HanulWiki.ArticleModel.count(function(count) {
						if (inner.checkIsClosed() !== true) {
							countDom.empty();
							countDom.append('전체 항목 수: ' + count);
						}
					});
					
					menu.append(CLEAR_BOTH());
				}
			
				inner.on('uriChange', function(uri) {
					if (CONFIG.HanulWiki.isPrivate === true && isAuthed !== true && uri !== 'func/login') {
						HanulWiki.GO('func/login');
					}
				});
				
				HanulWiki.ArticleModel.get({
					sort : {
						createTime : 1
					}
				}, function(firstArticleData) {
					if (inner.checkIsClosed() !== true) {
						footer.before(DIV({
							style : {
								fontSize : 12,
								color : '#666',
								padding : 10
							},
							c : '첫 글이 작성된지 ' + INTEGER((new Date().getTime() - TIME(firstArticleData.createTime).getTime()) / 24 / 60 / 60 / 1000) + '일이 지났습니다.'
						}));
					}
				});
			});
			
			inner.on('close', function() {
				scrollStore.remove();
				authRoom.exit();
				tapEvent.remove();
				layout.remove();
				content = undefined;
			});
		}
	};
});
