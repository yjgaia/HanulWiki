require(process.env.UPPERCASE_IO_PATH + '/BOOT.js');

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
			license : 'CC BY-NC-SA'
		}
	},
	NODE_CONFIG : {
		dbName : 'HanulWiki-test',
		isUsingHTMLSnapshot : true,
		HanulWiki : {
			password : '1234'
		}
	}
});
