HanulWiki.Form = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// license style
		licenseStyle = {
			marginTop : 10,
			fontSize : 12
		},
		
		// form
		form,
		
		// wrapper
		wrapper = DIV({
			c : [UUI.BUTTON({
				style : {
					flt : 'left',
					color : CONFIG.HanulWiki.baseColor
				},
				title : '뒤로가기',
				on : {
					tap : function(e) {
						history.back();
					}
				}
			}), A({
				style : {
					flt : 'right',
					color : CONFIG.HanulWiki.baseColor
				},
				c : '문법 소개',
				target : '_blank',
				href : HanulWiki.HREF('func/markdown-sample')
			}), CLEAR_BOTH()]
		}).appendTo(HanulWiki.Layout.getContent());
		
		inner.on('paramsChange', function(params) {
			
			var
			// id
			id = params.id;
			
			NEXT([
			function(next) {
				
				if (id === undefined) {
					TITLE(CONFIG.title + ' :: 글작성');
					next();
				} else {
					
					id = id.replace(/@!/g, '/');
					TITLE(CONFIG.title + ' :: 글수정');
					
					HanulWiki.ArticleModel.get(id, {
						notExists : function() {
							TITLE(CONFIG.title + ' :: 글작성');
							next();
						},
						success : next
					});
				}
			},
			
			function() {
				return function(articleData) {
					
					if (inner.checkIsClosed() !== true) {
					
						if (form !== undefined) {
							form.remove();
						}
						
						wrapper.append(form = UUI.VALID_FORM({
							style : {
								marginTop : 10
							},
							errorMsgs : {
								id : {
									notEmpty : '이름을 입력해주세요.',
									size : function(validParams) {
										return '이름은 ' + validParams.max + '글자 미만으로 입력해주세요.';
									},
									exists : function() {
										return '이미 존재하는 문서입니다.';
									}
								},
								content : {
									notEmpty : '내용을 입력해주세요.'
								}
							},
							errorMsgStyle : {
								padding : '5px 10px',
								backgroundColor : '#D83F25',
								color : '#fff'
							},
							c : [UUI.FULL_TEXTAREA({
								style : {
									marginTop : 10,
									height : 300,
									backgroundColor : '#000',
									padding : 10
								},
								textareaStyle : {
									color : '#fff',
									lineHeight : '1.4em'
								},
								value : articleData === undefined ? undefined : articleData.content,
								name : 'content'
							}), H3({
								style : {
									marginTop : 10,
									fontWeight : 'bold'
								},
								c : '이미지 업로드'
							}), UUI.FULL_UPLOAD_FORM({
								style : {
									border : '1px solid #999',
									marginTop : 10
								},
								box : HanulWiki,
								accept : 'image/*',
								uploadSuccess : function(fileData, form) {
									
									var
									// input
									input;
									
									form.after(DIV({
										style : {
											marginTop : 10
										},
										c : [P({
											c : '이미지가 업로드 되었습니다. 이미지가 들어갈 위치에 아래 코드를 복사해 붙혀넣어 주시기 바랍니다.'
										}), input = UUI.FULL_INPUT({
											style : {
												marginTop : 10,
												border : '1px solid #999'
											},
											value : '![ScreenShot](' + HanulWiki.RF('THUMB/' + fileData.id) + ')'
										})]
									}));
									
									input.select();
								}
							}), UUI.FULL_SUBMIT({
								style : {
									marginTop : 10,
									backgroundColor : CONFIG.HanulWiki.baseColor,
									color : '#fff',
									fontWeight : 'bold'
								},
								value : articleData === undefined ? '글 작성' : '글 수정'
							})],
							on : {
								submit : function(e, form) {
									
									var
									// data
									data = form.getData();
									
									if (articleData !== undefined) {
										data.id = articleData.id;
									}
									
									(articleData === undefined ? HanulWiki.ArticleModel.create : HanulWiki.ArticleModel.update)(data, {
										notValid : form.showErrors,
										success : function(savedData) {
											HanulWiki.GO(savedData.id.replace(/\//g, '@!'));
										}
									});
								}
							}
						}));
						
						if (articleData !== undefined) {
						
							form.setData(articleData);
						
						} else {
							
							form.prepend(UUI.FULL_INPUT({
								style : {
									border : '1px solid #999'
								},
								placeholder : '이름',
								name : 'id',
								value : id
							}));
						}
			
						if (CONFIG.HanulWiki.license === 'CC BY') {
							form.append(DIV({
								style : licenseStyle,
								c : ['문서를 저장하게 되면 ', A({
									href : 'http://creativecommons.org/licenses/by/4.0/',
									c : '크리에이티브 커먼즈 저작자표시 4.0 국제 라이선스'
								}), '에 따라 이용할 수 있음에 동의하는 것으로 간주합니다. 또한 IP 주소가 서버에 저장되고, 문서의 History에 공개되는것을 동의합니다. 이 동의는 철회할 수 없습니다.']
							}));
						}
						
						else if (CONFIG.HanulWiki.license === 'CC BY-SA') {
							form.append(DIV({
								style : licenseStyle,
								c : ['문서를 저장하게 되면 ', A({
									href : 'http://creativecommons.org/licenses/by-sa/4.0/',
									c : '크리에이티브 커먼즈 저작자표시-동일조건변경허락 4.0 국제 라이선스'
								}), '에 따라 이용할 수 있음에 동의하는 것으로 간주합니다. 또한 IP 주소가 서버에 저장되고, 문서의 History에 공개되는것을 동의합니다. 이 동의는 철회할 수 없습니다.']
							}));
						}
						
						else if (CONFIG.HanulWiki.license === 'CC BY-ND') {
							form.append(DIV({
								style : licenseStyle,
								c : ['문서를 저장하게 되면 ', A({
									href : 'http://creativecommons.org/licenses/by-nd/4.0/',
									c : '크리에이티브 커먼즈 저작자표시-변경금지 4.0 국제 라이선스'
								}), '에 따라 이용할 수 있음에 동의하는 것으로 간주합니다. 또한 IP 주소가 서버에 저장되고, 문서의 History에 공개되는것을 동의합니다. 이 동의는 철회할 수 없습니다.']
							}));
						}
						
						else if (CONFIG.HanulWiki.license === 'CC BY-NC') {
							form.append(DIV({
								style : licenseStyle,
								c : ['문서를 저장하게 되면 ', A({
									href : 'http://creativecommons.org/licenses/by-nc/4.0/',
									c : '크리에이티브 커먼즈 저작자표시-비영리 4.0 국제 라이선스'
								}), '에 따라 이용할 수 있음에 동의하는 것으로 간주합니다. 또한 IP 주소가 서버에 저장되고, 문서의 History에 공개되는것을 동의합니다. 이 동의는 철회할 수 없습니다.']
							}));
						}
						
						else if (CONFIG.HanulWiki.license === 'CC BY-NC-SA') {
							form.append(DIV({
								style : licenseStyle,
								c : ['문서를 저장하게 되면 ', A({
									href : 'http://creativecommons.org/licenses/by-nc-sa/4.0/',
									c : '크리에이티브 커먼즈 저작자표시-비영리-동일조건변경허락 4.0 국제 라이선스'
								}), '에 따라 이용할 수 있음에 동의하는 것으로 간주합니다. 또한 IP 주소가 서버에 저장되고, 문서의 History에 공개되는것을 동의합니다. 이 동의는 철회할 수 없습니다.']
							}));
						}
						
						else if (CONFIG.HanulWiki.license === 'CC BY-NC-ND') {
							form.append(DIV({
								style : licenseStyle,
								c : ['문서를 저장하게 되면 ', A({
									href : 'http://creativecommons.org/licenses/by-nc-nd/4.0/',
									c : '크리에이티브 커먼즈 저작자표시-비영리-변경금지 4.0 국제 라이선스'
								}), '에 따라 이용할 수 있음에 동의하는 것으로 간주합니다. 또한 IP 주소가 서버에 저장되고, 문서의 History에 공개되는것을 동의합니다. 이 동의는 철회할 수 없습니다.']
							}));
						}
					}
				};
			}]);
		});

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
