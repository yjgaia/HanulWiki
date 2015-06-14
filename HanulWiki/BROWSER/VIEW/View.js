HanulWiki.View = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';
		
		var
		// browser info
		browserInfo = INFO.getBrowserInfo(),
		
		// wrapper
		wrapper = DIV().appendTo(HanulWiki.Layout.getContent());
		
		inner.on('paramsChange', function(params) {
			
			var
			// id
			id = params.id.trim().replace(/ /g, '').toLowerCase().replace(/@!/g, '/');
			
			HanulWiki.ArticleModel.view(id, function(articleData) {
				
				var
				// last update time cal
				lastUpdateTimeCal,
				
				// content
				content,
				
				// id dom
				idDom,
				
				// change.
				change;
				
				if (articleData === undefined) {
					HanulWiki.GO('func/new/' + id.replace(/\//g, '@!'));
				} else if (inner.checkIsClosed() !== true) {
					
					lastUpdateTimeCal = CALENDAR(TIME(articleData.lastUpdateTime === undefined ? articleData.createTime : articleData.lastUpdateTime)),
					
					wrapper.empty();
					
					wrapper.append(UUI.BUTTON({
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
					}));
					
					if (HanulWiki.Layout.checkIsAuthed() === true) {
						
						wrapper.append(DIV({
							style : {
								marginLeft : 5,
								flt : 'right',
								color : CONFIG.HanulWiki.baseColor
							},
							c : [A({
								c : '글 수정',
								on : {
									tap : function() {
										HanulWiki.GO('func/update/' + articleData.id.replace(/\//g, '@!'));
									}
								}
							}), A({
								style : {
									marginLeft : 5
								},
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
						}));
					}
					
					wrapper.append(DIV({
						style : {
							flt : 'right',
							color : CONFIG.HanulWiki.baseColor
						},
						c : [A({
							c : '역링크',
							on : {
								tap : function() {
									HanulWiki.GO(articleData.id.replace(/\//g, '@!') + '/backlinks');
								}
							}
						}), A({
							style : {
								marginLeft : 5
							},
							c : '수정 내역',
							on : {
								tap : function() {
									HanulWiki.GO(articleData.id.replace(/\//g, '@!') + '/history');
								}
							}
						})]
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
								style : {
									fontSize : 30,
									fontWeight : 'bold'
								},
								c : articleData.id
							}), P({
								style : {
									flt : 'right',
									fontSize : 12,
									color : '#666'
								},
								c : '조회수 ' + articleData.viewCount
							}), CLEAR_BOTH()]
						}), content = P({
							style : {
								padding : '0 10px',
								fontSize : 14
							}
						}), P({
							style : {
								padding : 10,
								fontSize : 12,
								color : '#666',
								textAlign : 'right'
							},
							c : '최근 수정 시각 ' + lastUpdateTimeCal.getYear() + '년 ' + lastUpdateTimeCal.getMonth() + '월 ' + lastUpdateTimeCal.getDate() + '일 ' + lastUpdateTimeCal.getHour() + '시 ' + lastUpdateTimeCal.getMinute() + '분'
						})]
					}));
					
					if (browserInfo.name === 'Internet Explorer' && browserInfo.version < 9) {
						content.append(articleData.content);
					} else {
						
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
									el.parentNode.removeChild(el);
								
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
				}
			});
		});

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
