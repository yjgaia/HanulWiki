HanulWiki.TalkModel = OBJECT({

	preset : function() {
		'use strict';

		return HanulWiki.MODEL;
	},

	params : function() {
		'use strict';

		var
		// valid data set
		validDataSet = {
			content : {
				notEmpty : true,
				size : {
					max : 3000
				}
			},
			keywords : {
				notEmpty : true,
				array : true
			}
		};

		return {
			name : 'Talk',
			initData : {
				keywords : []
			},
			methodConfig : {
				create : {
					valid : VALID(validDataSet),
					role : 'USER'
				},
				update : false,
				remove : false
			}
		};
	}
});
