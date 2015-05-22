HanulWiki.View = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';
		
		var
		// wrapper
		wrapper = DIV({
			style : {
				padding : 10
			}
		}).appendTo(HanulWiki.Layout.getContent());
		
		inner.on('paramsChange', function(params) {
			
			var
			// id
			id = params.id.replace(/@!/g, '/');
			
			HanulWiki.ArticleModel.get(id, function(articleData) {
				
				var
				// create time cal
				createTimeCal = CALENDAR(TIME(articleData.createTime)),
				
				// cleaned content
				cleanedContent = '',
				
				// content index set
				contentIndexSet = [],
				
				// content
				content,
				
				// id dom
				idDom,
				
				// append count
				appendCount = 0;
				
				if (inner.checkIsClosed() !== true) {
					
					wrapper.empty();
					
					wrapper.append(UUI.BUTTON({
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
					}));
					
					wrapper.append(CLEAR_BOTH());
					
					wrapper.append(UUI.PANEL({
						style : {
							margin : '10px 0'
						},
						contentStyle : {
							border : '1px solid #ccc'
						},
						c : [H3({
							style : {
								padding : 10
							},
							c : [idDom = SPAN({
								c : articleData.id
							}), DIV({
								style : {
									flt : 'right',
									marginTop : 1,
									fontSize : 12,
									color : '#999'
								},
								c : [SPAN({
									c : '조회수 ' + articleData.viewCount
								}), SPAN({
									style : {
										marginLeft : 10
									},
									c : createTimeCal.getYear() + '년 ' + createTimeCal.getMonth() + '월 ' + createTimeCal.getDate() + '일 ' + createTimeCal.getHour() + '시 ' + createTimeCal.getMinute() + '분'
								})]
							}), CLEAR_BOTH()]
						}), DIV({
							style : {
								borderTop : '1px solid #ccc',
								padding : 10
							},
							c : [HanulWiki.Layout.checkIsAuthed() === true ? DIV({
								style : {
									flt : 'right',
									color : '#4183c4',
									marginBottom : 10
								},
								c : [A({
									c : '글 수정',
									on : {
										tap : function() {
											HanulWiki.GO('func/update/' + articleData.id.replace(/\//g, '@!'));
										}
									}
								}), ' ', A({
									c : '글 삭제',
									on : {
										tap : function() {
											
											if (confirm('정말 삭제하시겠습니까?') === true) {
												HanulWiki.ArticleModel.remove(articleData.id, function() {
													HanulWiki.REFRESH('');
												});
											}
										}
									}
								})]
							}) : '', CLEAR_BOTH(), content = P({
								style : {
									fontSize : 14
								}
							})]
						})]
					}));
					
					EACH(articleData.content, function(ch, i) {
						
						if (ch === ' ') {
							return true;
						}
						
						cleanedContent += ch.toLowerCase();
						contentIndexSet.push(i);
					});
					
					REPEAT(articleData.content.length, function(i) {
						
						EACH(articleData.keywords, function(keyword) {
							
							var
							// href
							href;
							
							if (cleanedContent.substring(i, i + keyword.length) === keyword) {
							
								articleData.content = articleData.content.substring(0, contentIndexSet[i] + appendCount)
								+ '[' + articleData.content.substring(contentIndexSet[i] + appendCount, contentIndexSet[i + keyword.length - 1] + 1 + appendCount) + '](' + keyword.replace(/\//g, '@!') + ')'
								+ articleData.content.substring(contentIndexSet[i + keyword.length - 1] + 1 + appendCount);
								
								appendCount += 4 + keyword.length;
								i +=  4 + keyword.length;
							}
						});
					});
					
					content.getEl().setAttribute('class', 'markdown-body');
					content.getEl().innerHTML = marked(articleData.content);
					
					GET({
						host : 'tagengine.btncafe.com',
						uri : '__REP_TAG',
						paramStr : 'tag=' + encodeURIComponent(articleData.id)
					}, function(id) {
						idDom.empty();
						idDom.append(id);
					});
				}
			});
		});

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
