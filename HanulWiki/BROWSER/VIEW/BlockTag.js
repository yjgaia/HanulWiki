HanulWiki.BlockTag = CLASS({

	preset : function() {
		'use strict';

		return VIEW;
	},

	init : function(inner, self) {
		'use strict';
		
		var
		// wrapper
		wrapper = DIV({
			c : [H1({
				c : '제한 항목을 추가합니다.'
			}), FORM({
				c : [INPUT({
					name : 'id'
				}), INPUT({
					type : 'submit'
				})],
				on : {
					submit : function(e, form) {
						
						var
						// data
						data = form.getData();
						
						HanulWiki.BlockTagModel.create({
							id : data.id
						}, function() {
							createBlockTag(data.id);
							form.setData({});
						});
					}
				}
			})]
		}).appendTo(HanulWiki.Layout.getContent()),
		
		// create blog tag.
		createBlockTag = function(id) {
			
			var
			// dom
			dom;
			
			wrapper.append(dom = DIV({
				style : {
					marginTop : 10
				},
				c : [id, A({
					style : {
						marginLeft : 10,
						fontSize : 12,
						color : CONFIG.HanulWiki.baseColor
					},
					c : '삭제',
					on : {
						tap : function() {
							if (confirm('정말 삭제하시겠습니까?') === true) {
								HanulWiki.BlockTagModel.remove(id, function() {
									dom.remove();
								});
							}
						}
					}
				})]
			}));
		};
		
		HanulWiki.BlockTagModel.find(EACH(function(blockTagData) {
			createBlockTag(blockTagData.id);
		}));
		
		TITLE('제한 항목 - ' + CONFIG.title);
		
		inner.on('close', function() {
			wrapper.remove();
		});
	}
});
