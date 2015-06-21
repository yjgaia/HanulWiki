OVERRIDE(HanulWiki.ArticleModel, function(origin) {
	'use strict';

	HanulWiki.ArticleModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// view.
			view,
			
			// find history.
			findHistory,
			
			// search ids.
			searchIds;
			
			self.view = view = function(id, callback) {
				//REQUIRED: id
				
				self.getRoom().send({
					methodName : 'view',
					data : id
				}, callback);
			};
			
			self.findHistory = findHistory = function(params, callback) {
				//REQUIRED: params
				//REQUIRED: params.id
				//OPTIONAL: params.page
				
				self.getRoom().send({
					methodName : 'findHistory',
					data : params
				}, callback);
			};
			
			self.searchIds = searchIds = function(query, callback) {
				//REQUIRED: query
				
				self.getRoom().send({
					methodName : 'searchIds',
					data : query
				}, callback);
			};
		}
	});
});
