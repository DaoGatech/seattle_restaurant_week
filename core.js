//ultilize storage to store data - maybe using this to store a list of all restaurant name
var storage = chrome.storage.local;
var message = document.querySelector('#message');
var restMap = {};

// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

var records = document.getElementsByClassName("common class name of all top level rows");

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) {

   var srcElement = e.srcElement;
   var name_of_restaurant = "";
   // Lets check if our underlying element is a SPAN.
   if (srcElement.nodeName == 'SPAN') {
       name_of_restaurant = decodeString(srcElement.innerHTML);
       console.log(name_of_restaurant);
   }

}, false);

//get list of all restaurant
document.getElementById('desktop-sidebar').addEventListener("click", function (event) {
   var temp = document.getElementsByClassName("tablesorter");
   var table = temp[0];

   for (var i = 1, row; row = table.rows[i]; i++) {
       var item = row.cells[0];
       var restName = item.textContent.trim();

       //if (typeof restMap[restName] != 'undefined') {
       if(!(restName in restMap)){
           restMap[restName] = {
               link: item.childNodes[1].href,
               datalat: row.attributes[6].nodeValue,
               datalng: row.attributes[7].nodeValue,
               phone: 0,
               rating: 0.0,
               url: ""
           };
       }
   }

   for (var rest in restMap) {
	   var near = 'Seattle';
	   var accessor = {
	        consumerSecret : token.consumerSecret,
		    tokenSecret : token.tokenSecret
	    };
		parameters = [];
		parameters.push(['term', rest]);
		parameters.push(['location', near]);
        parameters.push(['limit', 1]);
		parameters.push(['oauth_consumer_key', token.consumerKey]);
		parameters.push(['oauth_consumer_secret', token.consumerSecret]);
		parameters.push(['oauth_token', token.accessToken]);
        parameters.push(['callback', 'cb']);
		parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
		var message = {
		    'action' : 'http://api.yelp.com/v2/search',
			'method' : 'GET',
			'parameters' : parameters
		};
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);
		var parameterMap = OAuth.getParameterMap(message.parameters);
		parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
			$.ajax({
				'url' : message.action,
				'data' : parameterMap,
				'cache' : true,
				'dataType' : 'jsonp',
				'jsonpCallback' : 'cb',
				'success' : function(data, textStats, XMLHttpRequest) {
					console.log(data.length);
					var output = prettyPrint(data);
				}
			});
   }
}, true);

function cb(data) {
    console.log(data);
}
function decodeString(encoded) {
   var decoded = encoded.replace(/&amp;/g, '&');
   return decoded;
};

//check to see if the ratings have already been pulled, 
//if so just load the modified css
storage.get('css', function (items) {
   //console.log(items);

   //inject the css
   if (items.css) {
       chrome.tabs.insertCSS({ code: items.css }, function () {
           if (chrome.runtime.lastError) {
               message.innerText = 'Something went wrong with the injection process.';
           } else {
               message.innerText = 'Inject successfully';
           }
       });
   } else {
       //define how the rating are shown in the web page
       var optionsUrl = chrome.extension.getURL('options.html');
       message.innerHTML = 'Set CSS in the <a target="_blank" href="' +
           optionsUrl + '">options page</a>.';
   }
});
