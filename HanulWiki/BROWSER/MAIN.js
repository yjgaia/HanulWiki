HanulWiki.MAIN = METHOD({

	run : function() {
		'use strict';
		
		BROWSER_CONFIG.beforeUnloadMessage = '페이지를 이동하려 합니다.\n\n서버가 재시작 되었거나 인터넷이 끊어졌을 수 있습니다. 작성중인 내용을 다른곳에 저장하고 새로고침해 주시기 바랍니다.';
		
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
			uri : ['{id}/history', '{id}/history/{page}'],
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
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/realtime',
			target : HanulWiki.Realtime
		});
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/ban',
			target : HanulWiki.Ban
		});
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/blocktag',
			target : HanulWiki.BlockTag
		});
		
		HanulWiki.MATCH_VIEW({
			uri : 'func/admin',
			target : HanulWiki.Admin
		});
	}
});
