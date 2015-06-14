HanulWiki.ArticleModel = OBJECT({

	preset : function() {
		'use strict';

		return HanulWiki.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {
			id : {
				notEmpty : true,
				size : {
					max : 255
				}
			},
			content : {
				notEmpty : true,
				size : {
					max : 100000
				}
			},
			keywords : {
				notEmpty : true,
				array : true
			},
			viewCount : {
				notEmpty : true,
				integer : true
			},
			backLinks : {
				notEmpty : true,
				array : true
			}
		};

		return {
			name : 'Article',
			isNotUsingObjectId : true,
			initData : {
				viewCount : 0,
				keywords : [],
				backLinks : []
			},
			methodConfig : {
				create : {
					valid : VALID(validDataSet),
					role : 'ADMIN'
				},
				update : {
					valid : VALID(validDataSet),
					role : 'ADMIN'
				},
				remove : {
					role : 'ADMIN'
				}
			}
		};
	}
});
