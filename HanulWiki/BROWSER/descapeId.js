HanulWiki.descapeId = METHOD({
	
	run : function(id) {
		'use strict';
		//REQUIRED: id
		
		return id.replace(/@!/g, '/').replace(/@~/g, '?');
	}
});
