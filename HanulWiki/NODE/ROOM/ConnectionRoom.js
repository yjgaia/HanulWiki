HanulWiki.ConnectionRoom = OBJECT({
	
	init : function() {
		'use strict';
		
		var
		// connection db
		connectionDB = HanulWiki.SHARED_DB('connectionDB');
		
		connectionDB.save({
			id : 'connectionCountInfo',
			data : {
				count : 0
			}
		});
		
		HanulWiki.ROOM('connectionRoom', function(clientInfo, on, off) {
			
			connectionDB.update({
				id : 'connectionCountInfo',
				data : {
					$inc : {
						count : 1
					}
				}
			});
			
			HanulWiki.BROADCAST({
				roomName : 'connectionRoom',
				methodName : 'newUser'
			});
			
			on('__DISCONNECTED', function() {
				
				connectionDB.update({
					id : 'connectionCountInfo',
					data : {
						$inc : {
							count : -1
						}
					}
				});
				
				HanulWiki.BROADCAST({
					roomName : 'connectionRoom',
					methodName : 'leaveUser'
				});
			});
			
			on('getConnectionCount', function(notUsing, ret) {
				ret(connectionDB.get('connectionCountInfo').count);
			});
		});
	}
});
