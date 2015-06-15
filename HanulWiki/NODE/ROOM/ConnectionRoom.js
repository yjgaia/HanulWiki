HanulWiki.ConnectionRoom = OBJECT({
	
	init : function() {
		'use strict';
		
		HanulWiki.ROOM('connectionRoom', function(clientInfo, on, off) {
			
			on('__DISCONNECTED', function() {
				
			});
		});
	}
});
