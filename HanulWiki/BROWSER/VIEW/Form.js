HanulWiki.Form = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// form
		form,
		
		// wrapper
		wrapper = DIV({
			style : {
				padding : 10
			},
			c : [UUI.BUTTON({
				style : {
					flt : 'left',
					color : '#4183c4'
				},
				title : '뒤로가기',
				on : {
					tap : function(e) {
						history.back();
					}
				}
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
					HanulWiki.ArticleModel.get(id, next);
				}
			},
			
			function() {
				return function(articleData) {
					
					var
					// editor
					editor,
					
					// ace editor
					aceEditor;
					
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
							c : [UUI.TEXT_BUTTON({
								style : {
									marginTop : 10,
									flt : 'right'
								},
								title : '기본 폼으로',
								on : {
									tap : function() {
										editor.after(UUI.FULL_TEXTAREA({
											style : {
												marginTop : 10,
												height : 300,
												border : '1px solid #999'
											},
											value : articleData === undefined ? undefined : articleData.content,
											name : 'content'
										}));
										editor.remove();
										editor = undefined;
									}
								}
							}), CLEAR_BOTH(), editor = DIV({
								style : {
									marginTop : 10,
									height : 300
								}
							}), UUI.FULL_SUBMIT({
								style : {
									marginTop : 10,
									backgroundColor : '#4183C4',
									color : '#fff',
									fontWeight : 'bold'
								},
								value : articleData === undefined ? '글 작성' : '글 수정'
							}), UUI.FULL_UPLOAD_FORM({
								style : {
									marginTop : 10
								},
								box : HanulWiki,
								uploadSuccess : function(fileData, form) {
									
									form.after(P({
										c : '![ScreenShot](' + HanulWiki.RF('THUMB/' + fileData.id) + ')'
									}));
								}
							})],
							on : {
								submit : function(e, form) {
									
									var
									// data
									data = form.getData();
									
									if (articleData !== undefined) {
										data.id = articleData.id;
									}
									
									if (editor !== undefined) {
										data.content = aceEditor.getValue();
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
						
						aceEditor = ace.edit(editor.getEl());
					    aceEditor.setTheme('ace/theme/twilight');
					    aceEditor.getSession().setMode('ace/mode/markdown');
						
						if (articleData !== undefined) {
						
							form.setData(articleData);
							aceEditor.setValue(articleData.content, 1);
						
						} else {
							
							form.prepend(UUI.FULL_INPUT({
								style : {
									border : '1px solid #999'
								},
								placeholder : '이름',
								name : 'id'
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
