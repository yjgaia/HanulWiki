HanulWiki.MAIN = METHOD({
	
	run : function() {
		'use strict';
		
		if (CPU_CLUSTERING.getWorkerId() === 1) {
			
			// 하루에 한번씩 실행
			INTEGER(24 * 60 * 60, RAR(function() {
			
				var
				// id store
				idStore = SHARED_STORE('idStore');
			
				HanulWiki.ArticleModel.find(function(savedDataSet) {
					
					var
					// ids
					ids = [];
					
					EACH(savedDataSet, function(savedData) {
						
						var
						// index
						index = 0;
						
						EACH(ids, function(id, i) {
							
							if (id.length < savedData.id.length) {
								return false;
							}
							
							index = i + 1;
						});
						
						ids.splice(index, 0, savedData.id);
					});
					
					idStore.save({
						name : 'ids',
						value : ids
					});
				});
			}));
		}
	}
});
