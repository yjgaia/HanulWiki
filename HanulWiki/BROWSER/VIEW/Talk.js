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
							}, {
								notValid : function(validErrors) {
									if (validErrors.ban === true) {
										alert('차단된 IP 입니다. 모바일일 경우, 해당 통신사를 쓰는 다른 누구가로 인해 차단된 것일 수 있습니다.');
									}
								}
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
			cal = CALENDAR(talkData.createTime),
			
			// content
			content = talkData.content,
			
			// regex result
			regexResult,
			
			// found url
			foundURL,
			
			// content dom
			contentDom,
			
			// change.
			change;
			
			list.append(DIV({
				c : [contentDom = P({
					style : {
						flt : 'left'
					},
					c : talkData.ip + ': '
				}), P({
					style : {
						flt : 'right',
						color : '#999',
						fontSize : 10
					},
					c : cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true)
				}), CLEAR_BOTH()]
			}));
			
			change = function(content) {
				
				var
				// cleaned content
				cleanedContent = '',
				
				// content index set
				contentIndexSet = [],
				
				// append count
				appendCount = 0,
				
				// extras
				i, contentIndex;

				EACH(content, function(ch, i) {
					if (ch !== ' ') {
						contentIndexSet[cleanedContent.length] = i;
						cleanedContent += ch.toLowerCase();
					}
				});
				
				for (i = 0; i <= contentIndexSet.length; i += 1) {
					contentIndex = contentIndexSet[i];
	
					EACH(talkData.keywords, function(keyword) {
						
						if (cleanedContent.substring(i, i + keyword.length) === keyword) {
							
							contentDom.append(content.substring(0, contentIndex + appendCount));
							
							contentDom.append(A({
								style : {
									color : CONFIG.HanulWiki.baseColor
								},
								c : content.substring(contentIndex + appendCount, contentIndexSet[i + keyword.length - 1] + appendCount + 1),
								on : {
									tap : function() {
										HanulWiki.GO(HanulWiki.escapeId(keyword));
									}
								}
							}));
							
							content = content.substring(contentIndexSet[i + keyword.length - 1] + appendCount + 1);
	
							appendCount += 15 + 42 + HanulWiki.escapeId(keyword).length * 2;
							i += keyword.length - 1;
							
							return false;
						}
					});
				}
				
				return content;
			};
			
			while (true) {
				
				regexResult = content.match(/(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/);
				
				if (regexResult === TO_DELETE) {
					break;
				}
				
				else {
					
					foundURL = regexResult[0];
					
					contentDom.append(change(content.substring(0, content.indexOf(foundURL))));
					
					contentDom.append(A({
						style : {
							color : CONFIG.HanulWiki.baseColor
						},
						href : foundURL,
						target : '_blank',
						c : foundURL
					}));
					
					content = content.substring(content.indexOf(foundURL) + foundURL.length);
				}
			}
			
			contentDom.append(change(content));
			
			list.getContentDom().getEl().scrollTop += 999999;
		});
		
		TITLE('토론 - ' + CONFIG.title);
		
		inner.on('close', function() {
			onNewAndFindRoom.exit();
			wrapper.remove();
		});
	}
});
