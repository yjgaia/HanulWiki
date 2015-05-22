HanulWiki.MAIN = METHOD({
	
	run : function() {
		'use strict';
		
		var
		// id store
		idStore;
		
		if (CPU_CLUSTERING.getWorkerId() === 1) {
			
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
		}
	}
});
