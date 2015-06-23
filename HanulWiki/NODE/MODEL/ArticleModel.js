OVERRIDE(HanulWiki.ArticleModel, function(origin) {
	'use strict';

	HanulWiki.ArticleModel = OBJECT({

		preset : function() {
			return origin;
		},

		init : function(inner, self, params) {
			
			var
			// id db
			idDB = SHARED_DB('idDB'),
			
			// history db
			historyDB = HanulWiki.DB('Article__HISTORY'),
			
			// ban store
			banStore = HanulWiki.SHARED_STORE('banStore');

			inner.on('create', {
			
				before : function(data, next, ret, clientInfo) {
					
					var
					// cleaned content
					cleanedContent,
					
					// ids
					ids;
					
					if (banStore.get(clientInfo.ip) === true) {
						
						ret({
							validErrors : {
								ban : true
							}
						});
						
					} else {
						
						cleanedContent = data.content.trim().replace(/ /g, '').toLowerCase();
						
						ids = idDB.get('ids').ids;
						
						data.keywords = [];
						data.ip = clientInfo.ip;
						
						EACH(ids, function(id, i) {
							
							var
							// removed content
							removedContent = cleanedContent.replace(new RegExp(id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '');
							
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
					}
					
					return false;
				},
				
				after : function(savedData) {
					
					var
					// ids
					ids = idDB.get('ids').ids,
					
					// index
					index = 0;
					
					EACH(ids, function(id, i) {
						
						if (id.length < savedData.id.length) {
							return false;
						}
						
						index = i + 1;
					});
					
					idDB.update({
						id : 'ids',
						data : {
							$push : {
								ids : {
									$each : [savedData.id],
									$position : index
								}
							}
						}
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
					
					// client 일 경우만
					if (clientInfo !== undefined) {
						
						if (banStore.get(clientInfo.ip) === true) {
							
							ret({
								validErrors : {
									ban : true
								}
							});
							
							return false;
							
						} else if (data.content !== undefined) {
							
							cleanedContent = data.content.trim().replace(/ /g, '').toLowerCase();
							ids = idDB.get('ids').ids;
						
							data.keywords = [];
							data.ip = clientInfo.ip;
							
							EACH(ids, function(id, i) {
								
								var
								// removed content
								removedContent;
								
								if (id !== data.id) {
								
									removedContent = cleanedContent.replace(new RegExp(id.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), '');
									
									if (removedContent.length < cleanedContent.length) {
										data.keywords.push(id);
									}
									
									cleanedContent = removedContent;
								}
							});
						}
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
						
						HanulWiki.BROADCAST({
							roomName : 'Article',
							methodName : 'recentUpdate',
							data : savedData
						});
					}
				}
			});
			
			inner.on('remove', {
				
				before : function(id, next, ret, clientInfo) {
					
					if (banStore.get(clientInfo.ip) === true || (CONFIG.HanulWiki.isCannotRemove === true && CHECK_IS_IN({
						array : clientInfo.roles,
						value : 'ADMIN'
					}) !== true)) {
						
						ret({
							isNotAuthed : true
						});
						
						return false;
					}
				},
				
				after : function(originData) {
					
					var
					// ids
					ids = idDB.get('ids').ids;
					
					idDB.update({
						id : 'ids',
						data : {
							$pull : {
								ids : originData.id
							}
						}
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
				
				on('findHistory', function(params, ret) {
					
					if (params !== undefined) {
					
						historyDB.find({
							filter : {
								docId : params.id
							},
							start : params.page === undefined ? 0 : (params.page - 1) * 10,
							count : 10,
							sort : {
								time : -1
							}
						}, ret);
					}
				});
				
				on('searchIds', function(query, ret) {
					
					if (query !== undefined) {
					
						self.find({
							filter : {
								id : {
									$regex : query.trim().replace(/ /g, '').toLowerCase()
								}
							},
							sort : {
								viewCount : -1
							},
							count : 20
						}, function(articleDataSet) {
							
							var
							// ids
							ids = [];
							
							EACH(articleDataSet, function(articleData) {
								ids.push(articleData.id);
							});
							
							ret(ids);
						});
					}
				});
			});
		}
	});
});
