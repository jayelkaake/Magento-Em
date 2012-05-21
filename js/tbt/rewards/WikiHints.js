/*
var remoteApi = JsMwApi("http://www.getsweettooth.com/wiki/api.php");
remoteApi.page("Setting Up Point Rules").parse(callback);

function callback(content){
	//document.write(content);
}

var wikiURL = "http://www.getsweettooth.com/wiki/index.php";
var quick = "http://www.getsweettooth.com/wiki/index.php?action=raw&title=Setting_Up_Point_Rules";
*/

var labelExceptions = new Array();

/**
 *  Looks for label elements on the page and tries to create a link for its corresponding object
 * @param wikiBaseURL
 */
function prepareDynamicWikiHints(wikiBaseURL){
	
	var debug = "Wiki Base URL: " + wikiBaseURL + "\n\n";
	
	var pageTitle = findPageTitle();
		
	var allLabels = document.getElementsByTagName("label");						//get a collection of all labels in the document

	debug += (allLabels.length) + ' labels found on page titled "' + pageTitle + '":\n\n';

	for(var currentLabel in allLabels)
	{	
		if (allLabels[currentLabel] == undefined) continue;
		var refersTo = allLabels[currentLabel].htmlFor;
		var labelContents = allLabels[currentLabel].innerHTML; 
			labelContents = stripHTML(labelContents);
			labelContents = ignoreBrackets(labelContents);
			labelContents = removeColon(labelContents);
		if (refersTo != undefined){
			addHelpLikToReferingElement(wikiBaseURL, pageTitle, refersTo, labelContents, allLabels[currentLabel]);
			debug += refersTo + '\t:\t' + labelContents + '\n';
		}
	}
	//alert(debug);		// uncomment for debugging
}

/**
 *  Looks for elements with class name "WikiHint" and tries to create a link for it corresponding object 
 **/
function prepareStaticWikiHints(wikiBaseURL){
		
	var debug = "Wiki Base URL: " + wikiBaseURL + "\n\n";
	
	var sectionTitle = findPageTitle();
	
	var allWikiHintElements = getElementsByClass("WikiHint");				//get a collection of all elements with class "WikiHint" in the document
	
	debug += (allWikiHintElements.length) + ' WikiHint elements found on page titled "' + sectionTitle + '":\n\n';
	
	for(currentElement = 0; currentElement < allWikiHintElements.length; currentElement++){				
		var element = allWikiHintElements[currentElement];
		var sectionStr = element.getAttribute("section");
		
		if (sectionStr != undefined){
				sectionTitle = sectionStr.trim();
		}
		
		if (element != undefined){
			var elementTitle  = element.title;								// to resolve a human readable name, try the element's "Title" attribute first

			if (elementTitle == ""){											// if nothing there,
				elementTitle = element.innerHTML; 								// look inside the element's contents
				elementTitle = stripHTML(elementTitle);
				elementTitle = ignoreBrackets(elementTitle);
				elementTitle = removeColon(elementTitle);
			}
			if (elementTitle == ""){											// if nothing there,
				elementTitle = element.id;										// get the element's id
			}		
			if (elementTitle == ""){											// if nothing there,
				elementTitle = element.name;									// get the element's name
			}
		
			addHelpLikToReferingElement(wikiBaseURL, sectionTitle, element, elementTitle);
			debug += element + '\t:\t' + elementTitle + '\n';
		}
	}
	
	//alert(debug);		// uncomment for debugging
}

/**
 * 
 * @param labelToSkip
 */
function addLabelException(labelToSkip){
	labelExceptions[labelExceptions.length] = labelToSkip.toLowerCase().trim();
}

/**
 * 
 * @returns
 */
function findPageTitle(){
	var pageTitle = getPageTitle("h1");
	if (pageTitle == undefined){
		pageTitle = getPageTitle("h2");
		if (pageTitle == undefined){
			pageTitle = getPageTitle("h3");
			if (pageTitle == undefined){
				pageTitle = getPageTitle("h4");
			}
		}
	}
	return pageTitle;
}

/**
* Use to update the link of an element if it's corresponding label is dynamically changing 
* @param element: element object which a label refers to
*/ 
function updateLinkOnElement(element){
	
	var elementId = element.id;
	if (elementId == undefined){
		elementId = element.name;
		if (elementId == undefined){
			// can't do this without an ID!
			return;
		}
	}

	var linkElement = document.getElementById(elementId + '_WikiHintLink');
	if (linkElement == undefined){
		// couldn't find the link!
		return;
	}

	var sectionTitle =linkElement.getAttribute("section");
	if (sectionTitle == undefined){
		// can't update without a section title
		return;
	}
	
	var wikiBaseURL = linkElement.getAttribute("WikiHintBaseURL");
	if (wikiBaseURL == undefined){
		// can't update without a base url
		return;
	}	
	
	
	var allLabels = document.getElementsByTagName("label");						//get a collection of all labels in the document
	for(var currentLabel in allLabels)
	{		
		if (allLabels[currentLabel].htmlFor == elementId){
			var labelContents = allLabels[currentLabel].innerHTML; 
			labelContents = stripHTML(labelContents);
			labelContents = ignoreBrackets(labelContents);
			labelContents = removeColon(labelContents);
			
			var pageName = sectionTitle + ' : ' + labelContents;
			var newWikiHintURL = wikiBaseURL + '/' + escape(pageName);
			
			linkElement.href = newWikiHintURL;
			linkElement.title = 'WikiHint on \'\'' + pageName + '\'\'';
			
			return;
		}
	}
}

/**
 * 
 * @param wikiBaseURL
 * @param pageTitle
 * @param elementId
 * @param elementTitle
 * @param [labelElement=null]
 */
function addHelpLikToReferingElement(wikiBaseURL, pageTitle, elementId, elementTitle, labelElement){
	for (i = 0; i < labelExceptions.length; i++){
	
		var labelToSkip = labelExceptions[i];		
		if (elementTitle != undefined){
			if (elementTitle.toLowerCase() == labelToSkip){
				return;
			}
		}
		// @nelkaake labelElement looked at in case of comparing whether or not the element should be skipped.
		if(labelElement != undefined) {
			if (labelElement.innerHTML.toLowerCase() == labelToSkip) {
				return;		
			}
		}
	}
	
	var element;
	if (elementId instanceof Element){
		element = elementId;
		elementId = undefined;
	} else {
		element = document.getElementById(elementId);
	}
	
	
	if (element == null) return;
	if (element.tagName.toLowerCase() == 'span'){		// skip if element is an empty span
		if (element.innerHTML.trim() == '') return;
	}
	var parent = element.parentNode;
	var oldHTML = parent.innerHTML;
	var pageName = '';
	var linkTitle = '';
	if (pageTitle == undefined || pageTitle.trim() == ''){
		pageTitle = "User Manual";
	} else {
		pageTitle = pageTitle.trim();
	}
	
	if (elementTitle == undefined || elementTitle.trim() == ''){
		pageName = pageTitle;
		linkTitle = 'More Info...';
	} else {
		pageName = pageTitle + ' : ' + elementTitle.trim();
		linkTitle = 'WikiHint on \'\'' + pageName + '\'\'';
	}
	
	var wikiLink = wikiBaseURL + '/' + escape(pageName);
	
	var containerId = '';
	if (elementId == undefined){
		containerId = (pageName).replace(/\s/g, "_").toLowerCase();
	} else {
		containerId = elementId;
	}
	
	// create dynamic elements:	
	var container = document.createElement('table');
	container.setAttribute('id', containerId + '_container');
	if(!$(element).hasClassName('wikihints-justify')) {
		container.setAttribute('width','100%');
	}
	
	var containerRow = document.createElement('tr');
	var containerLeftCol = document.createElement('td');
	var containerRightCol = document.createElement('td');
	containerRightCol.setAttribute('width','10');
	
	var anchorElement = document.createElement('a');
	anchorElement.setAttribute('id', containerId + '_WikiHintLink');
	anchorElement.setAttribute('title', linkTitle);
	anchorElement.setAttribute('href', wikiLink);
	anchorElement.setAttribute('target', '_blank');
	anchorElement.setAttribute('style', 'float:top; margin-left: 2px;');
	anchorElement.setAttribute('section', pageTitle);
	anchorElement.setAttribute('WikiHintBaseURL' , wikiBaseURL);
	anchorElement.innerHTML = '[?]';
	anchorElement.onClick = 'openURL(this.href);return false;';
	
	container.appendChild(containerRow);
	containerRow.appendChild(containerLeftCol);
	containerRow.appendChild(containerRightCol);
	containerRightCol.appendChild(anchorElement);
	
	while(true){
		var child = parent.childNodes[0];
		if (child == undefined) break;
		parent.removeChild(child);
		containerLeftCol.appendChild(child);
	}
	
	parent.appendChild(container);
}

/**
 * 
 * @param headingTagName
 * @returns
 */
function getPageTitle(headingTagName){
	
	var searchIn = document;
	var main_container = document.getElementById('page:main-container');
 
	if (main_container != undefined){
		searchIn = main_container;
	}
	var allTitles = searchIn.getElementsByTagName(headingTagName);
	if (allTitles.length > 0){
		return getInnerText(allTitles[0]);
	} else {
		return undefined;
	}
}

/**
 * 
 * @param strInputCode
 * @returns
 */
function stripHTML(strInputCode){
	// TODO: Use RegEx instead!
	
	if (strInputCode == undefined){
		return undefined;
	}	

	var startOfTag = strInputCode.indexOf("<");							// Find start of next Tag	
	if (startOfTag == -1 ) return strInputCode.replace(/\s+/g," ");		// if no more tags found, return what we have with normal spaces
	var endOfTagName = strInputCode.indexOf(' ', startOfTag);			// based on next space...
	var tag = strInputCode.substring(startOfTag, endOfTagName);			// ...figure out what tag we're dealing with 
	var endOfTag = strInputCode.indexOf("</" + tag + ">", startOfTag);	// keep searching string for the corresponding closing tag
	if (endOfTag != -1 ) {												
		endOfTag = strInputCode.indexOf(">", endOfTag) + 1;				// if found, figure out when tag actually ends
	} else {
		endOfTag = strInputCode.indexOf("/>", startOfTag);				// if not, proper html syntax wasn't used, just find closing tag
		if (endOfTag =! -1){
			endOfTag += 2;												// if found, figure out when tag actually ends 
		} else{	
			endOfTag = strInputCode.length;								// if not, then tag was never closed, get rid of everything else
		}
	}
	
	var strOutputCode = strInputCode.replace(strInputCode.substring(startOfTag, endOfTag),"").trim();
	return stripHTML(strOutputCode);

}

/**
 * 
 * @param strInput
 * @returns
 */
function ignoreBrackets(strInput){
	// TODO: Use RegEx instead!
	
	if (strInput == undefined){
		return undefined;
	}
	var startOfBracket = strInput.indexOf("(");							// Find start of next braket
	if (startOfBracket == -1) return strInput;
	
	var endOfBracket = strInput.indexOf(")");							// Find end of next braket
	if (endOfBracket == -1) return strInput;
	
	var output = strInput.replace(strInput.substring(startOfBracket, endOfBracket + 1), "").trim();
	return ignoreBrackets(output);
}


function removeColon(label){
	if (label == undefined) { return undefined; }	
	label = label.trim();	
	if (label.charAt( label.length -1 ) == ':'){
		return label.substring(0, label.length -1 );
	}
	return label;
}

/**
 * 
 * @param element
 * @returns
 */
function getInnerText(element){
	var text = element.innerText;
	if (text == undefined){
		text = element.textContent;
	}
	return text;
}


/**
 * 
 * @param searchClass
 * @param node
 * @param tag
 * @returns {Array}
 */
function getElementsByClass(searchClass,node,tag) {
	var classElements = new Array();
	if ( node == null )
		node = document;
	if ( tag == null )
		tag = '*';
	var els = node.getElementsByTagName(tag);
	var elsLen = els.length;
	var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
	for (i = 0, j = 0; i < elsLen; i++) {
		if ( pattern.test(els[i].className) ) {
			classElements[j] = els[i];
			j++;
		}
	}
	return classElements;
}

function openURL(url){
	window.open(url,'_blank');
	/*
		make a javascript call to another page or javascript function to keep statistics
	*/
}