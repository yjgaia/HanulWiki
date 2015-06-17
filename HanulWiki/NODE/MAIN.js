HanulWiki.MAIN = METHOD({
	
	run : function() {
		'use strict';
		
		var
		// id store
		idStore;
		
		if (CPU_CLUSTERING.getWorkerId() === 1) {
			
			// id store
			idStore = SHARED_STORE('idStore');
			
			// 하루에 한번씩 실행
			INTEGER(24 * 60 * 60, RAR(function() {
			
				HanulWiki.ArticleModel.find({
					isFindAll : true
				}, function(articleDataSet) {
					
					var
					// ids
					ids = [];
					
					EACH(articleDataSet, function(articleData) {
						
						var
						// index
						index = 0;
						
						EACH(ids, function(id, i) {
							
							if (id.length < articleData.id.length) {
								return false;
							}
							
							index = i + 1;
						});
						
						ids.splice(index, 0, articleData.id);
					});
					
					idStore.save({
						name : 'ids',
						value : ids
					});
					
					EACH(articleDataSet, function(articleData) {
						
						var
						// cleaned content
						cleanedContent = articleData.content.trim().replace(/ /g, '').toLowerCase(),
						
						// keywords
						keywords = [];
						
						EACH(ids, function(id, i) {
							
							var
							// removed content
							removedContent = cleanedContent.replace(new RegExp(id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '');
							
							if (removedContent.length < cleanedContent.length) {
								keywords.push(id);
							}
							
							cleanedContent = removedContent;
						});
						
						if (CHECK_ARE_SAME([articleData.keywords, keywords]) !== true) {
						
							HanulWiki.ArticleModel.update({
								id : articleData.id,
								keywords : keywords
							});
							
							EACH(keywords, function(keyword) {
								HanulWiki.ArticleModel.updateNoHistory({
									id : keyword,
									$addToSet : {
										backLinks : articleData.id
									}
								});
							});
						}
					});
				});
			}));
		}
	}
});
