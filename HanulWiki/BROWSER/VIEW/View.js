HanulWiki.View = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';
		
		var
		// wrapper
		wrapper = DIV().appendTo(HanulWiki.Layout.getContent());
		
		inner.on('paramsChange', function(params) {
			
			var
			// id
			id = params.id.replace(/@!/g, '/');
			
			HanulWiki.ArticleModel.get(id, function(articleData) {
				
				var
				// create time cal
				createTimeCal = CALENDAR(TIME(articleData.createTime)),
				
				// content
				content,
				
				// id dom
				idDom,
				
				// change.
				change;
				
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
							marginTop : 10
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
					
					content.getEl().setAttribute('class', 'markdown-body');
					content.getEl().innerHTML = marked(articleData.content);
					
					change = function(el) {
						
						var
						// text content
						textContent,
						
						// cleaned content
						cleanedContent = '',
						
						// content index set
						contentIndexSet = [],
						
						// append count
						appendCount = 0,
						
						// new el
						newEl,
						
						// i
						i;
						
						if (el.tagName !== 'A') {
							
							if (el.tagName === undefined) {
								
								textContent = el.textContent;
								
								EACH(el.textContent, function(ch, i) {
									if (ch !== ' ') {
										contentIndexSet[cleanedContent.length] = i;
										cleanedContent += ch.toLowerCase();
									}
								});
								
								EACH(contentIndexSet, function(contentIndex, i) {
			
									EACH(articleData.keywords, function(keyword) {
										
										var
										// href
										href;
										
										if (cleanedContent.substring(i, i + keyword.length) === keyword) {
		
											textContent = textContent.substring(0, contentIndex + appendCount)
											+ '<a href="' + keyword.replace(/\//g, '@!') + '" onclick="HanulWiki.GO(\'' + keyword.replace(/\//g, '@!') + '\'); return false;">' + textContent.substring(contentIndex + appendCount, contentIndexSet[i + keyword.length - 1] + appendCount + 1) + '</a>'
											+ textContent.substring(contentIndexSet[i + keyword.length - 1] + appendCount + 1);
											
											appendCount += 15 + 42 + keyword.replace(/\//g, '@!').length * 2;
											
											return false;
										}
									});
								});
								
								newEl = document.createElement('span');
								newEl.innerHTML = textContent;
								
								el.parentNode.insertBefore(newEl, el);
								el.remove();
								
							} else {
								for (i = 0; i < el.childNodes.length; i += 1) {
									change(el.childNodes[i]);
								}
							}
						}
					};
					
					change(content.getEl());
					
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
