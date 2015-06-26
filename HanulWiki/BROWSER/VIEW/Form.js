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
		
		// existed message
		existedMessage,
		
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
					TITLE('글작성 - ' + CONFIG.title);
					next();
				} else {
					
					id = HanulWiki.descapeId(id);
					TITLE('글수정 - ' + CONFIG.title);
					
					HanulWiki.ArticleModel.get(id, {
						notExists : function() {
							TITLE('글작성 - ' + CONFIG.title);
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
							c : [existedMessage = P({
								style : {
									fontSize : 12
								}
							}), UUI.FULL_TEXTAREA({
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
										notValid : function(validErrors) {
											
											if (validErrors.ban === true) {
												alert('차단된 IP 입니다. 모바일일 경우, 해당 통신사를 쓰는 다른 누구가로 인해 차단된 것일 수 있습니다.');
											}
											
											form.showErrors(validErrors);
										},
										success : function(savedData) {
											HanulWiki.GO(HanulWiki.escapeId(savedData.id));
										}
									});
								}
							}
						}));
						
						if (articleData !== undefined) {
							
							form.prepend(H1({
								style : {
									fontSize : 20,
									fontWeight : 'bold'
								},
								c : articleData.id + ' 수정'
							}));
						
							form.setData(articleData);
						
						} else {
							
							form.prepend(UUI.FULL_INPUT({
								style : {
									border : '1px solid #999'
								},
								placeholder : '이름',
								name : 'id',
								value : id,
								on : {
									change : function(e, input) {
										HanulWiki.ArticleModel.checkIsExists({
											filter : {
												id : input.getValue().trim().replace(/ /g, '').toLowerCase()
											}
										}, function(isExists) {
											
											existedMessage.empty();
											
											if (isExists === true) {
												existedMessage.append(SPAN({
													style : {
														color : 'red'
													},
													c : '이미 존재하는 항목입니다. '
												}));
												existedMessage.append(A({
													style : {
														color : CONFIG.HanulWiki.baseColor
													},
													c : input.getValue() + '으로 이동하기',
													on : {
														tap : function() {
															HanulWiki.GO(input.getValue().trim().replace(/ /g, '').toLowerCase());
														}
													}
												}));
												existedMessage.append(SPAN({
													style : {
														color : 'red'
													},
													c : ' 이동하시면 작성하신 내용은 사라집니다.'
												}));
											}
										});
									}
								}
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
						
						form.append(A({
							style : {
								marginLeft : 5,
								flt : 'right',
								color : '#666',
								fontSize : 12
							},
							c : '글 삭제',
							on : {
								tap : function() {
									
									if (confirm('정말 삭제하시겠습니까?') === true) {
										HanulWiki.ArticleModel.remove(articleData.id, {
											notAuthed : function(validErrors) {
												alert('인증되지 않은 사용자입니다.');
											},
											success : function() {
												HanulWiki.REFRESH('');
											}
										});
									}
								}
							}
						}));
						
						form.append(CLEAR_BOTH());
					}
				};
			}]);
		});

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
