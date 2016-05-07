require(process.env.UPPERCASE_PATH + '/BOOT.js');

BOOT({
	CONFIG : {
		isDevMode : true,
		
		defaultBoxName : 'HanulWiki',
		title : 'Hanul Wiki',
		webServerPort : 8406,
		maxThumbHeight : 400,
		
		HanulWiki : {
			isPublic : true,
			//isPrivate : true
			license : 'CC BY-NC-SA',
			copyright : 'test',
			mainDocument : 'wiki/main',
			baseColor : '#4183c4',
			logo : 'logo.png',
			isCannotRemove : true,
			
			minTagLength : 2
		}
	},
	NODE_CONFIG : {
		
		// 운영 시엔 지워줍니다.
		isNotUsingCPUClustering : true,
		
		dbName : 'HanulWiki-test',
		HanulWiki : {
			
			// 비공개 위키 설정 시
			//password : '1234',
			
			// 관리자 비밀번호
			adminPassword : 'test'
		}
	}
});
