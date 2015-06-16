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
		
		// content input
		contentInput,
		
		// wrapper
		wrapper = DIV({
			c : [list = UUI.LIST({
				style : {
					border : '1px solid #ccc',
					height : 350,
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
				}), contentInput = UUI.FULL_INPUT({
					style : {
						flt : 'left',
						onDisplayResize : function(width, height) {
							return {
								width : width >= 1024 ? 966 - 133 : width - 133
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
							contentInput.focus();
						}
					}
				}
			})]
		}).appendTo(HanulWiki.Layout.getContent());
		
		onNewAndFindRoom = HanulWiki.TalkModel.onNewAndFind({
			count : 100
		}, function(talkData) {
			
			var
			// cal
			cal = CALENDAR(talkData.createTime);
			
			list.append(DIV({
				c : [P({
					style : {
						flt : 'left'
					},
					c : talkData.ip + ': ' + talkData.content
				}), P({
					style : {
						flt : 'right',
						color : '#999',
						fontSize : 10
					},
					c : cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true)
				}), CLEAR_BOTH()]
			}));
			
			list.getContentDom().getEl().scrollTop += 999999;
		});
		
		TITLE(CONFIG.title + ' :: 토론');
		
		inner.on('close', function() {
			onNewAndFindRoom.exit();
			wrapper.remove();
		});
	}
});
