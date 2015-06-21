OVERRIDE(HanulWiki.TalkModel, function(origin) {
	'use strict';

	HanulWiki.TalkModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// id db
			idDB = SHARED_DB('idDB'),
			
			// ban store
			banStore = HanulWiki.SHARED_STORE('banStore');
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cleaned content
					cleanedContent,
					
					// ids
					ids;
					
					if (banStore.get(clientInfo.ip) === true) {
						
						ret({
							validErrors : {
								ban : true
							}
						});
						
						return false;
						
					} else {
						
						cleanedContent = data.content.trim().replace(/ /g, '').toLowerCase();

						ids = idDB.get('ids').ids;
					
						data.keywords = [];
						data.ip = clientInfo.ip;
						
						EACH(ids, function(id, i) {
							
							var
							// removed content
							removedContent = cleanedContent.replace(new RegExp(id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '');
							
							if (removedContent.length < cleanedContent.length) {
								data.keywords.push(id);
							}
							
							cleanedContent = removedContent;
						});
					}
				}
			});
		}
	});
});
