OVERRIDE(HanulWiki.ArticleModel, function(origin) {
	'use strict';

	HanulWiki.ArticleModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// id store
			idStore = SHARED_STORE('idStore'),
			
			// history db
			historyDB = HanulWiki.DB('Article__HISTORY');
			
			if (CPU_CLUSTERING.getWorkerId() === 1) {
			
				self.find({
					isFindAll : true
				}, function(articleDataSet) {
					
					var
					// ids
					ids = [];
					
					EACH(articleDataSet, function(articleData) {
						
						var
						// index
						index = 0;
						
						EACH(ids, function(id, i) {
							
							if (id.length < articleData.id.length) {
								return false;
							}
							
							index = i + 1;
						});
						
						ids.splice(index, 0, articleData.id);
					});
					
					idStore.save({
						name : 'ids',
						value : ids
					});
				});
			}

			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cleaned content
					cleanedContent = data.content.trim().replace(/ /g, '').toLowerCase(),
					
					// ids
					ids = idStore.get('ids');
					
					data.keywords = [];
					data.ip = clientInfo.ip;
					
					EACH(ids, function(id, i) {
						
						var
						// removed content
						removedContent = cleanedContent.replace(new RegExp(id, 'g'), '');
						
						if (removedContent.length < cleanedContent.length) {
							data.keywords.push(id);
						}
						
						cleanedContent = removedContent;
					});

					GET({
						host : 'tagengine.hanul.co',
						uri : '__TAG_INPUT',
						paramStr : 'tag=' + encodeURIComponent(data.id)
					}, function(tag) {
						
						data.id = tag;
						
						self.get(data.id, {
							notExists : next,
							success : function() {
								ret({
									validErrors : {
										id : {
											type : 'exists'
										}
									}
								});
							}
						});
					});
					
					return false;
				},
				
				after : function(savedData) {
					
					var
					// ids
					ids = idStore.get('ids'),
					
					// index
					index = 0;
					
					EACH(ids, function(id, i) {
						
						if (id.length < savedData.id.length) {
							return false;
						}
						
						index = i + 1;
					});
					
					ids.splice(index, 0, savedData.id);
					
					idStore.save({
						name : 'ids',
						value : ids
					});
					
					EACH(savedData.keywords, function(keyword) {
						self.updateNoHistory({
							id : keyword,
							$addToSet : {
								backLinks : savedData.id
							}
						});
					});
				}
			});
			
			inner.on('update', {
				
				before : function(data, next, ret, clientInfo) {
					
					var
					// cleaned content
					cleanedContent,
					
					// ids
					ids;
					
					if (data.content !== undefined) {
						
						cleanedContent = data.content.trim().replace(/ /g, '').toLowerCase();
						ids = idStore.get('ids');
					
						data.keywords = [];
						data.ip = clientInfo.ip;
						
						EACH(ids, function(id, i) {
							
							var
							// removed content
							removedContent;
							
							if (id !== data.id) {
							
								removedContent = cleanedContent.replace(new RegExp(id, 'g'), '');
								
								if (removedContent.length < cleanedContent.length) {
									data.keywords.push(id);
								}
								
								cleanedContent = removedContent;
							}
						});
					}
				},
				
				after : function(savedData, originData) {
					
					if (savedData.content !== originData.content) {
					
						EACH(savedData.keywords, function(keyword) {
							self.updateNoHistory({
								id : keyword,
								$addToSet : {
									backLinks : savedData.id
								}
							});
						});
					}
				}
			});
			
			inner.on('remove', {
				
				after : function(originData) {
					
					var
					// ids
					ids = idStore.get('ids');
					
					REMOVE({
						array : ids,
						value : originData.id
					});
					
					idStore.save({
						name : 'ids',
						value : ids
					});
					
					EACH(originData.keywords, function(keyword) {
						self.updateNoHistory({
							id : keyword,
							$pull : {
								backLinks : originData.id
							}
						});
					});
				}
			});
			
			HanulWiki.ROOM(self.getName(), function(clientInfo, on) {

				on('view', function(id, ret) {
					
					if (id !== undefined) {
					
						self.updateNoHistory({
							id : id,
							$inc : {
								viewCount : 1
							}
						}, {
							notExists : ret,
							success : ret
						});
					}
				});
				
				on('findHistory', function(id, ret) {
					
					if (id !== undefined) {
					
						historyDB.find({
							filter : {
								docId : id
							},
							sort : {
								time : -1
							}
						}, ret);
					}
				});
			});
		}
	});
});
