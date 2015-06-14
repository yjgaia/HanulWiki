OVERRIDE(HanulWiki.TalkModel, function(origin) {
	'use strict';

	HanulWiki.TalkModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					data.ip = clientInfo.ip;
				}
			});
		}
	});
});
