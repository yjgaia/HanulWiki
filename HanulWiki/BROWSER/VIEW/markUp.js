HanulWiki.markUp = METHOD({
	
	run : function(params) {
		'use strict';
		//REQUIRED: params
		//REQUIRED: params.dom
		//REQUIRED: params.articleData
		
		var
		// dom
		dom = params.dom,
		
		// article data
		articleData = params.articleData,
		
		// html
		html = marked(articleData.content),
		
		// footprint regex
		footprintRegex = /\[\^(\d)\]/g,
		
		// footprint match
		footprintMatch,
		
		// footprint bottom regex
		footprintBottomRegex = /\[\^(\d)\]:/g,
		
		// footprint bottom match
		footprintBottomMatch,
		
		// change.
		change;
			
		while(true) {
		
			footprintBottomMatch = footprintBottomRegex.exec(html);
			
			if (footprintBottomMatch === TO_DELETE) {
				break;
			}
			
			html = html.substring(0, footprintBottomMatch.index) + '<a href="#rfn-' + footprintBottomMatch[1] + '"><span id="fn-' + footprintBottomMatch[1] + '">[' + footprintBottomMatch[1] + ']</span></a>' + html.substring(footprintBottomMatch.index + footprintBottomMatch[0].length);
		}
		
		while(true) {
		
			footprintMatch = footprintRegex.exec(html);
			
			if (footprintMatch === TO_DELETE) {
				break;
			}
			
			html = html.substring(0, footprintMatch.index) + '<a href="#fn-' + footprintMatch[1] + '"><sup id="rfn-' + footprintMatch[1] + '">[' + footprintMatch[1] + ']</sup></a>' + html.substring(footprintMatch.index + footprintMatch[0].length);
		}
		
		dom.getEl().setAttribute('class', 'markdown-body');
		dom.getEl().innerHTML = html;
		
		change = function(el) {
			
			var
			// text content
			textContent,
			
			// cleaned content
			cleanedContent = '',
			
			// content index set
			contentIndexSet = [],
			
			// append count
			appendCount = 0,
			
			// new el
			newEl,
			
			// extras
			i, contentIndex;
			
			if (el.tagName !== 'A') {
				
				if (el.tagName === undefined) {
					
					textContent = el.textContent;
					
					EACH(el.textContent, function(ch, i) {
						if (ch !== ' ') {
							contentIndexSet[cleanedContent.length] = i;
							cleanedContent += ch.toLowerCase();
						}
					});
					
					for (i = 0; i <= contentIndexSet.length; i += 1) {
						contentIndex = contentIndexSet[i];

						EACH(articleData.keywords, function(keyword) {
							
							var
							// href
							href;
							
							if (cleanedContent.substring(i, i + keyword.length) === keyword) {

								textContent = textContent.substring(0, contentIndex + appendCount)
								+ '<a style="color: ' + CONFIG.HanulWiki.baseColor + ';" href="' + HanulWiki.escapeId(keyword) + '" onclick="HanulWiki.GO(\'' + HanulWiki.escapeId(keyword) + '\'); return false;">' + textContent.substring(contentIndex + appendCount, contentIndexSet[i + keyword.length - 1] + appendCount + 1) + '</a>'
								+ textContent.substring(contentIndexSet[i + keyword.length - 1] + appendCount + 1);
								
								appendCount += 32 + CONFIG.HanulWiki.baseColor.length + 42 + HanulWiki.escapeId(keyword).length * 2;
								i += keyword.length - 1;
								
								return false;
							}
						});
					}
					
					newEl = document.createElement('span');
					newEl.innerHTML = textContent;
					
					el.parentNode.insertBefore(newEl, el);
					el.parentNode.removeChild(el);
				
				} else {
					for (i = 0; i < el.childNodes.length; i += 1) {
						change(el.childNodes[i]);
					}
				}
			}
		};
		
		change(dom.getEl());
	}
});
