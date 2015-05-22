HanulWiki.MAIN = METHOD({

	run : function() {
		'use strict';
		
		HanulWiki.MATCH_VIEW({
			uri : '**',
			target : HanulWiki.Layout
		});

		HanulWiki.MATCH_VIEW({
			uri : '',
			target : HanulWiki.Home
		});
		
		HanulWiki.MATCH_VIEW({
			uri : '{id}',
			target : HanulWiki.View
		});
		
		HanulWiki.MATCH_VIEW({
			uri : ['func/new', 'func/update/{id}'],
			target : HanulWiki.Form
		});
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/login',
			target : HanulWiki.Login
		});
	}
});
