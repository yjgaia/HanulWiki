HanulWiki.ConnectionRoom = OBJECT({
	
	init : function() {
		'use strict';
		
		var
		// ban store
		banStore = HanulWiki.SHARED_STORE('banStore');
		
		HanulWiki.ROOM('banRoom', function(clientInfo, on, off) {
			
			on('ban', function(ipToBan, ret) {
				
				if (ipToBan !== undefined) {
				
					if (clientInfo.roles !== undefined && CHECK_IS_IN({
						array : clientInfo.roles,
						value : 'ADMIN'
					}) === true) {
						
						// 1주일 동안 ban
						banStore.save({
							name : ipToBan,
							value : true,
							removeAfterSeconds : 7 * 24 * 60 * 60
						});
						
						ret();
					}
				}
			});
			
			on('noBan', function(ipToBan, ret) {
				
				if (ipToBan !== undefined) {
				
					if (clientInfo.roles !== undefined && CHECK_IS_IN({
						array : clientInfo.roles,
						value : 'ADMIN'
					}) === true) {
						
						banStore.remove(ipToBan);
						
						ret();
					}
				}
			});
			
			on('getBanList', function(notUsing, ret) {
				
				if (clientInfo.roles !== undefined && CHECK_IS_IN({
					array : clientInfo.roles,
					value : 'ADMIN'
				}) === true) {
					
					var
					// ips
					ips = [];
					
					EACH(banStore.list(), function(v, ip) {
						ips.push(ip);
					});
					
					ret(ips);
				}
			});
		});
	}
});
