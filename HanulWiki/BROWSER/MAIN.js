HanulWiki.MAIN = METHOD({

	run : function() {
		'use strict';
		
		HanulWiki.MATCH_VIEW({
			uri : '**',
			excludeURI : 'func/markdown-sample',
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
			uri : '{id}/history',
			target : HanulWiki.History
		});
		
		HanulWiki.MATCH_VIEW({
			uri : '{id}/backlinks',
			target : HanulWiki.BackLinks
		});
		
		HanulWiki.MATCH_VIEW({
			uri : ['func/new', 'func/new/{id}', 'func/update/{id}'],
			target : HanulWiki.Form
		});
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/markdown-sample',
			target : HanulWiki.MarkdownSample
		});
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/login',
			target : HanulWiki.Login
		});
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/talk',
			target : HanulWiki.Talk
		});
	}
});
