/*
	Project Hacker!

	Script to scrape Wikipedia Off In Order to extract the given number of paragraphs for a project.

	Particularly for people who are too lazy to write their own papers.
*/

let endpoint = "https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&titles=";	// Wikipedia API Endpoint

// Form Submission Function

function formsubmit(e){
	
	e.preventDefault(); // Preventing Page Refresh or Redirect.

	if(document.getElementById('topic').value && document.getElementById('npara').value){
		document.getElementById('copybutton').style.display = "none";
		document.getElementById('response').style.display = "block";
		document.getElementById('response').innerHTML = "<div align='center'>Fetching Everything!</div>";
		setup(encodeURIComponent(document.getElementById('topic').value),encodeURIComponent(document.getElementById('npara').value));
	}
}

// Main Function

function setup(titletosearch='',npara=5){	
	// 	Function to Setup the endpoint in order to extract the required information.
	//	Title To Search - titletosearch.
	//	No Of Paragraphs - npara.
	
	var xhr = new XMLHttpRequest();

	xhr.open('GET',endpoint+titletosearch.toString());

	xhr.setRequestHeader('Content-type','application/json; charset=utf-8');

	xhr.send();

	// Displaying all the information.

	xhr.onload = function(){
		parseddata = JSON.parse(xhr.responseText);

		let pagekeys = Object.keys(parseddata.query.pages);

		// Checking if the API Returned a valid response.

		if(parseddata.query.pages[pagekeys[0]].extract){	
			// If yes.

			// Replacing the end para tags.

			let string = parseddata.query.pages[pagekeys[0]].extract;

			document.getElementById('response1').innerHTML = string;
			document.getElementById('response').innerHTML = "";

			let listofel = document.getElementById('response1').getElementsByTagName('*');

			let count = 0;	// Counter to keep track of the number of paragraphs.

			for(let i=0;count<npara && i<listofel.length;i++){
				if(listofel[i]){
					if(!listofel[i].classList.contains('mw-empty-elt') && listofel[i].tagName === 'P')
					{
						if(listofel[i].innerHTML!=="<br>" && listofel[i].innerText!=""){
							document.getElementById('response').innerHTML += (`<p>${listofel[i].innerHTML}</p>`);
							count++;
						}
						continue;
					}
					else{
						if(!listofel[i].classList.contains("gallerybox"))	// Empty List Items
						{
							if(listofel[i].tagName!='SPAN'){	// Not Printing any Span Elements As they are subparts of other elements.
								if(listofel[i].tagName === 'I'){
									document.getElementById('response').innerHTML += "&nbsp&nbsp";
								}
								document.getElementById('response').innerHTML += (`<${listofel[i].tagName}>${listofel[i].innerText}</${listofel[i].tagName}>`);
							}
						}
					}				
				}
				else{
					break;	// Probably Signifies that the number of elements available ended.
				}
			}

			document.getElementById('response').style.display = "block";
			document.getElementById('copybutton').style.display = "inline-block";

			document.getElementById('response1').innerHTML = "";	// Deleting the element.
		}
		else{
			document.getElementById('copybutton').style.display = "none";
			document.getElementById('response').innerHTML = "<div class='errormessage' align='center'>No Such Essay could be formed.</div>";
		}
	}
}

/* Function to Copy From the Response Division */

function copytext(){
	  var target = document.getElementById('response');
	  var range, select;
	  if (document.createRange) {
	    range = document.createRange();
	    range.selectNode(target)
	    select = window.getSelection();
	    select.removeAllRanges();
	    select.addRange(range);
	    document.execCommand('copy');
	    select.removeAllRanges();
	  } else {
	    range = document.body.createTextRange();
	    range.moveToElementText(target);
	    range.select();
	    document.execCommand('copy');
	  }
}