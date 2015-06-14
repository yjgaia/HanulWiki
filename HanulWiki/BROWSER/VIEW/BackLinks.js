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
			id = params.id.trim().replace(/ /g, '').toLowerCase().replace(/@!/g, '/'),
			
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
					on : {
						tap : function(e) {
							HanulWiki.GO(id.replace(/\//g, '@!'));
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
							on : {
								tap : function(e) {
									HanulWiki.GO(keyword.replace(/\//g, '@!'));
								}
							}
						})
					}));
					
					GET({
						host : 'tagengine.btncafe.com',
						uri : '__REP_TAG',
						paramStr : 'tag=' + encodeURIComponent(keyword)
					}, function(id) {
						articleLink.empty();
						articleLink.append(id);
					});
				});
			});
		});

		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
