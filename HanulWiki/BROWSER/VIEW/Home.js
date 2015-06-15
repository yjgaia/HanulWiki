HanulWiki.Home = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// scroll store
		scrollStore = HanulWiki.STORE('scroll'),
		
		// is manually scroll
		isManuallyScroll = false,
		
		// scroll event
		scrollEvent = EVENT('scroll', function() {
			
			if (isManuallyScroll === true) {
				isManuallyScroll = false;
			} else {
			
				scrollStore.save({
					name : 'top',
					value : SCROLL_TOP(),
					isToSession : true
				});
			}
		}),
		
		// browser info
		browserInfo = INFO.getBrowserInfo(),
		
		// popular list
		popularList,
		
		// recent list
		recentList,
		
		// recent update list
		recentUpdateList,
		
		// wrapper
		wrapper = DIV({
			c : [DIV({
				c : [DIV({
					style : {
						marginRight : 10,
						marginBottom : 10,
						flt : 'left',
						border : '1px solid #ccc'
					},
					c : [H2({
						style : {
							backgroundColor : CONFIG.HanulWiki.baseColor,
							color : '#fff',
							fontWeight : 'bold',
							padding : 5,
							textAlign : 'center'
						},
						c : '인기글'
					}), popularList = DIV({
						c : '로딩중...'
					})]
				}), DIV({
					style : {
						marginRight : 10,
						marginBottom : 10,
						flt : 'left',
						border : '1px solid #ccc'
					},
					c : [H2({
						style : {
							backgroundColor : CONFIG.HanulWiki.baseColor,
							color : '#fff',
							fontWeight : 'bold',
							padding : 5,
							textAlign : 'center'
						},
						c : '최신글'
					}), recentList = DIV({
						c : '로딩중...'
					})]
				}), DIV({
					style : {
						marginBottom : 10,
						flt : 'left',
						border : '1px solid #ccc'
					},
					c : [H2({
						style : {
							backgroundColor : CONFIG.HanulWiki.baseColor,
							color : '#fff',
							fontWeight : 'bold',
							padding : 5,
							textAlign : 'center'
						},
						c : '최근 수정글'
					}), recentUpdateList = DIV({
						c : '로딩중...'
					})]
				}), CLEAR_BOTH()]
			})]
		}).appendTo(HanulWiki.Layout.getContent()),
		
		// scroll to saved top.
		scrollToSavedTop = function() {
			if (scrollStore.get('top') !== undefined && scrollStore.get('top') !== SCROLL_TOP()) {
				isManuallyScroll = true;
				scrollTo(0, scrollStore.get('top'));
			}
		};
		
		TITLE(CONFIG.title);
		
		HanulWiki.ArticleModel.find({
			count : 20,
			sort : {
				viewCount : -1
			}
		}, function(articleDataSet) {
					
			popularList.empty();
			
			EACH(articleDataSet, function(articleData) {
				
				var
				// article link
				articleLink;
				
				if (inner.checkIsClosed() !== true) {
					
					popularList.append(DIV({
						style : {
							padding : 5
						},
						c : [articleLink = A({
							style : {
								color : CONFIG.HanulWiki.baseColor
							},
							c : articleData.id,
							on : {
								tap : function(e) {
									HanulWiki.GO(articleData.id.replace(/\//g, '@!'));
								}
							}
						}), SPAN({
							style : {
								marginLeft : 5,
								fontSize : 10
							},
							c : '(' + articleData.viewCount + ')'
						})]
					}));
					
					GET({
						host : 'tagengine.btncafe.com',
						uri : '__REP_TAG',
						paramStr : 'tag=' + encodeURIComponent(articleData.id)
					}, function(id) {
						articleLink.empty();
						articleLink.append(id);
					});
					
					scrollToSavedTop();
				}
			});
		});
		
		HanulWiki.ArticleModel.find({
			count : 20
		}, function(articleDataSet) {
					
			recentList.empty();
			
			EACH(articleDataSet, function(articleData) {
				
				var
				// article link
				articleLink;
				
				if (inner.checkIsClosed() !== true) {
					
					recentList.append(DIV({
						style : {
							padding : 5
						},
						c : [articleLink = A({
							style : {
								color : CONFIG.HanulWiki.baseColor
							},
							c : articleData.id,
							on : {
								tap : function(e) {
									HanulWiki.GO(articleData.id.replace(/\//g, '@!'));
								}
							}
						}), SPAN({
							style : {
								marginLeft : 5,
								fontSize : 10
							},
							c : '(' + articleData.viewCount + ')'
						})]
					}));
					
					GET({
						host : 'tagengine.btncafe.com',
						uri : '__REP_TAG',
						paramStr : 'tag=' + encodeURIComponent(articleData.id)
					}, function(id) {
						articleLink.empty();
						articleLink.append(id);
					});
					
					scrollToSavedTop();
				}
			});
		});
		
		HanulWiki.ArticleModel.find({
			count : 20,
			sort : {
				lastUpdateTime : -1
			}
		}, function(articleDataSet) {
					
			recentUpdateList.empty();
			
			EACH(articleDataSet, function(articleData) {
				
				var
				// article link
				articleLink;
				
				if (inner.checkIsClosed() !== true) {
					
					recentUpdateList.append(DIV({
						style : {
							padding : 5
						},
						c : [articleLink = A({
							style : {
								color : CONFIG.HanulWiki.baseColor
							},
							c : articleData.id,
							on : {
								tap : function(e) {
									HanulWiki.GO(articleData.id.replace(/\//g, '@!'));
								}
							}
						}), SPAN({
							style : {
								marginLeft : 5,
								fontSize : 10
							},
							c : '(' + articleData.viewCount + ')'
						})]
					}));
					
					GET({
						host : 'tagengine.btncafe.com',
						uri : '__REP_TAG',
						paramStr : 'tag=' + encodeURIComponent(articleData.id)
					}, function(id) {
						articleLink.empty();
						articleLink.append(id);
					});
					
					scrollToSavedTop();
				}
			});
		});
		
		if (CONFIG.HanulWiki.mainDocument !== undefined) {
			
			HanulWiki.ArticleModel.get(CONFIG.HanulWiki.mainDocument, function(articleData) {
				
				var
				// content
				content,
				
				// change.
				change;
				
				wrapper.prepend(content = DIV({
					style : {
						fontSize : 14,
						marginBottom : 10
					}
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
											+ '<a href="' + keyword.replace(/\//g, '@!') + '" onclick="HanulWiki.GO(\'' + keyword.replace(/\//g, '@!') + '\'); return false;">' + textContent.substring(contentIndex + appendCount, contentIndexSet[i + keyword.length - 1] + appendCount + 1) + '</a>'
											+ textContent.substring(contentIndexSet[i + keyword.length - 1] + appendCount + 1);
											
											appendCount += 15 + 42 + keyword.replace(/\//g, '@!').length * 2;
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
					
					scrollToSavedTop();
				}
			});
		}
		
		scrollToSavedTop();
		
		inner.on('close', function() {
			scrollEvent.remove();
			wrapper.remove();
		});
	}
});
