/*
	Project Hacker!

	Script to scrape Wikipedia Off In Order to extract the given number of paragraphs for a project.

	Particularly for people who are too lazy to write their own papers.
*/

let endpoint = "https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&titles=";	// Wikipedia API Endpoint

// Creating a complete new Prototype for Strings to remove all the occurances of a particular string inside it. Credit : https://stackoverflow.com/a/17606289/10145649

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

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

			string = string.replaceAll("</p>","<br><br>");

			let arrayofparas = string.split("<p>");		// Splitting the whole obtained extract in accordance with the number of paragraphs.

			let htmlstring = "";

			let count = 0;	// Counter to keep track of the number of paragraphs.

			for(let i=0;i<npara;i++){

				if(count<npara){
					if(arrayofparas[i].includes("mw-empty") || arrayofparas[i].includes("<blockquote>") || arrayofparas[i].includes("<h3>") || arrayofparas[i].includes("h2") || arrayofparas[i].includes("<h1>") || arrayofparas[i].includes("<h4>")){
						
						if(count==npara-2){
							count++;
							continue;
						}
					}
					else{
						count++;
					}

					if(arrayofparas[i].includes("gallerybox"))
						continue;
					
					htmlstring+=arrayofparas[i];
				}
			}

			document.getElementById('response').innerHTML = htmlstring;
		}
		else{
			document.getElementById('response').innerHTML = "<div class='errormessage'>No Such Essay could be formed.</div>";
		}
	}
}