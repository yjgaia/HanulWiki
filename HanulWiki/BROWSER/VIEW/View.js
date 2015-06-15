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
			id = HanulWiki.descapeId(params.id.trim().replace(/ /g, '').toLowerCase());
			
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
					HanulWiki.GO('func/new/' + HanulWiki.escapeId(id));
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
					
					wrapper.append(DIV({
						style : {
							flt : 'right',
							color : CONFIG.HanulWiki.baseColor
						},
						c : [A({
							style : {
								marginLeft : 5
							},
							c : '수정 내역',
							on : {
								tap : function() {
									HanulWiki.GO(HanulWiki.escapeId(articleData.id) + '/history');
								}
							}
						})]
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
										HanulWiki.GO('func/update/' + HanulWiki.escapeId(articleData.id));
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
									HanulWiki.GO(HanulWiki.escapeId(articleData.id) + '/backlinks');
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
							
							// extras
							i, contentIndex;
							
							if (el.tagName !== 'A') {
								
								if (el.tagName === undefined) {
									
									textContent = el.textContent;
									
									EACH(el.textContent, function(ch, i) {
										if (ch !== ' ') {
											contentIndexSet[cleanedContent.length] = i;
											cleanedContent += ch.toLowerCase();
										}
									});
									
									for (i = 0; i <= contentIndexSet.length; i += 1) {
										contentIndex = contentIndexSet[i];
				
										EACH(articleData.keywords, function(keyword) {
											
											var
											// href
											href;
											
											if (cleanedContent.substring(i, i + keyword.length) === keyword) {
			
												textContent = textContent.substring(0, contentIndex + appendCount)
												+ '<a href="' + HanulWiki.escapeId(keyword) + '" onclick="HanulWiki.GO(\'' + HanulWiki.escapeId(keyword) + '\'); return false;">' + textContent.substring(contentIndex + appendCount, contentIndexSet[i + keyword.length - 1] + appendCount + 1) + '</a>'
												+ textContent.substring(contentIndexSet[i + keyword.length - 1] + appendCount + 1);
												
												appendCount += 15 + 42 + HanulWiki.escapeId(keyword).length * 2;
												i += keyword.length - 1;
												
												return false;
											}
										});
									}
									
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
						
						TITLE(CONFIG.title + ' :: ' + articleData.id);
						
						GET({
							host : 'tagengine.btncafe.com',
							uri : '__REP_TAG',
							paramStr : 'tag=' + encodeURIComponent(articleData.id)
						}, function(id) {
							
							idDom.empty();
							idDom.append(id);
							
							TITLE(CONFIG.title + ' :: ' + id);
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
