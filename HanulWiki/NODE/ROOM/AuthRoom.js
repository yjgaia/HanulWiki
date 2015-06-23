HanulWiki.AuthRoom = OBJECT({
	
	init : function() {
		'use strict';
		
		HanulWiki.ROOM('authRoom', function(clientInfo, on, off) {
			
			on('auth', function(password, ret) {
				
				var
				// is authed
				isAuthed = (CONFIG.HanulWiki !== undefined && CONFIG.HanulWiki.isPublic === true) ||
					(NODE_CONFIG.HanulWiki !== undefined && password !== undefined &&
						(password === NODE_CONFIG.HanulWiki.password || password === NODE_CONFIG.HanulWiki.adminPassword)
					);
				
				if (isAuthed === true) {
					clientInfo.roles = ['USER'];
				}
				
				// 운영자 로그인
				if (NODE_CONFIG.HanulWiki !== undefined && NODE_CONFIG.HanulWiki.adminPassword !== undefined && password === NODE_CONFIG.HanulWiki.adminPassword) {
					clientInfo.roles = ['USER', 'ADMIN'];
				}
				
				ret(isAuthed);
			});
		});
	}
});
