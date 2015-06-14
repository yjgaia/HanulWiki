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
			}
		};

		return {
			name : 'Talk',
			methodConfig : {
				create : {
					valid : VALID(validDataSet),
					role : 'ADMIN'
				},
				update : false,
				remove : false
			}
		};
	}
});
