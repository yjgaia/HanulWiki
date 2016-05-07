HanulWiki.BanModel = OBJECT({

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
			}
		};

		return {
			name : 'Ban',
			isNotUsingObjectId : true,
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
