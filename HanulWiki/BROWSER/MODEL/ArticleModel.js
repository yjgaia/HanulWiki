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
			findHistory;
			
			self.view = view = function(id, callback) {
				self.getRoom().send({
					methodName : 'view',
					data : id
				}, callback);
			};
			
			self.findHistory = findHistory = function(id, callback) {
				self.getRoom().send({
					methodName : 'findHistory',
					data : id
				}, callback);
			};
		}
	});
});
