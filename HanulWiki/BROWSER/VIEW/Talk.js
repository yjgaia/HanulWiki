HanulWiki.Talk = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';
		
		var
		// list
		list,
		
		// on new and find room
		onNewAndFindRoom,
		
		// wrapper
		wrapper = DIV({
			c : [list = UUI.LIST({
				style : {
					border : '1px solid #ccc',
					height : 300,
					overflowY : 'scroll',
					padding : 5
				}
			}), FORM({
				style : {
					backgroundColor : '#ccc',
					padding : 5
				},
				c : [P({
					style : {
						fontSize : 12,
						marginBottom : 5
					},
					c : '전송을 누르면  IP 주소가 서버에 저장되고, 목록에 공개되는것에 동의합니다. 이 동의는 철회할 수 없습니다.'
				}), UUI.FULL_INPUT({
					style : {
						flt : 'left',
						onDisplayResize : function(width, height) {
							return {
								width : width - 133
							};
						}
					},
					placeholder : '메시지를 입력해주세요.',
					name : 'content'
				}), UUI.FULL_SUBMIT({
					style : {
						flt : 'right',
						width : 70,
						padding : 5
					},
					value : '전송'
				}), CLEAR_BOTH()],
				on : {
					submit : function(e, form) {
						
						var
						// content
						content = form.getData().content;
						
						if (content.trim() === '') {
							alert('메시지를 입력해주세요.');
						} else {
							HanulWiki.TalkModel.create({
								content : content
							});
							form.setData({});
						}
					}
				}
			})]
		}).appendTo(HanulWiki.Layout.getContent());
		
		onNewAndFindRoom = HanulWiki.TalkModel.onNewAndFind(function(talkData) {
			list.append(P({
				c : talkData.ip + ': ' + talkData.content
			}));
			
			list.getContentDom().getEl().scrollTop += 999999;
		});
		
		inner.on('close', function() {
			onNewAndFindRoom.exit();
			wrapper.remove();
		});
	}
});
