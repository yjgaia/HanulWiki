HanulWiki.AuthRoom = OBJECT({
	
	init : function() {
		'use strict';
		
		HanulWiki.ROOM('authRoom', function(clientInfo, on, off) {
			
			on('auth', function(password, ret) {
				
				var
				// is authed
				isAuthed = (CONFIG.HanulWiki !== undefined && CONFIG.HanulWiki.isPublic === true) || (NODE_CONFIG.HanulWiki !== undefined && password === NODE_CONFIG.HanulWiki.password);
				
				if (isAuthed === true) {
					clientInfo.roles = ['ADMIN'];
				}
				
				ret(isAuthed);
			});
		});
	}
});
