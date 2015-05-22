HanulWiki.Home = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';

		var
		// recent list
		recentList,
		
		// popular list
		popularList,
		
		// wrapper
		wrapper = DIV({
			style : {
				padding : 10
			},
			c : [P({
				c : CONFIG.description
			}), DIV({
				style : {
					marginTop : 20
				},
				c : [recentList = DIV({
					style : {
						flt : 'left'
					},
					c : H2({
						c : '최신글'
					})
				}), popularList = DIV({
					style : {
						flt : 'left'
					},
					c : H2({
						c : '인기글'
					})
				}), CLEAR_BOTH()]
			})]
		}).appendTo(HanulWiki.Layout.getContent());
		
		TITLE(CONFIG.title);
		
		HanulWiki.ArticleModel.find({
			count : 10
		}, EACH(function(articleData) {
			
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
							color : '#4183c4'
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
			}
		}));
		
		HanulWiki.ArticleModel.find({
			count : 10,
			sort : {
				viewCount : -1
			}
		}, EACH(function(articleData) {
			
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
							color : '#4183c4'
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
			}
		}));
		
		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
