HanulWiki.AuthRoom = OBJECT({
	
	init : function() {
		'use strict';
		
		HanulWiki.ROOM('authRoom', function(clientInfo, on, off) {
			
			on('auth', function(password, ret) {
				
				if (password === NODE_CONFIG.HanulWiki.password) {
					clientInfo.roles = ['ADMIN'];
				}
				
				ret(password === NODE_CONFIG.HanulWiki.password);
			});
		});
	}
});
