HanulWiki.BackLinks = CLASS({

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
			id = HanulWiki.descapeId(params.id.trim().replace(/ /g, '').toLowerCase()),
			
			// id dom
			idDom;
			
			wrapper.append(H1({
				style : {
					fontSize : 30,
					fontWeight : 'bold',
					marginBottom : 10
				},
				c : [idDom = A({
					c : id,
					href : HanulWiki.HREF(HanulWiki.escapeId(id)),
					on : {
						tap : function(e) {
							HanulWiki.GO(HanulWiki.escapeId(id));
						}
					}
				}), '의 역링크']
			}));
			
			GET({
				host : 'tagengine.btncafe.com',
				uri : '__REP_TAG',
				paramStr : 'tag=' + encodeURIComponent(id)
			}, function(id) {
				idDom.empty();
				idDom.append(id);
			});
			
			HanulWiki.ArticleModel.get(id, function(articleData) {
				
				EACH(articleData.backLinks, function(keyword) {
					
					var
					// article link
					articleLink;
					
					wrapper.append(P({
						c : articleLink = A({
							style : {
								color : CONFIG.HanulWiki.baseColor
							},
							c : keyword,
							href : HanulWiki.HREF(HanulWiki.escapeId(keyword)),
							on : {
								tap : function(e) {
									HanulWiki.GO(HanulWiki.escapeId(keyword));
								}
							}
						})
					}));
					
					TITLE(keyword + '의 역링크 - ' + CONFIG.title);
					
					GET({
						host : 'tagengine.btncafe.com',
						uri : '__REP_TAG',
						paramStr : 'tag=' + encodeURIComponent(keyword)
					}, function(id) {
						
						articleLink.empty();
						articleLink.append(id);
						
						TITLE(id + '의 역링크 - ' + CONFIG.title);
					});
				});
			});
		});

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
