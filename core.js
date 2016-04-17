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
    //console.log("DOM fully loaded and parsed");

    var temp = document.getElementsByClassName("tablesorter");
    var table = temp[0];

    for (var i = 1, row; row = table.rows[i]; i++) {
        var item = row.cells[0];
        var restName = item.textContent.trim();

        //if (typeof restMap[restName] != 'undefined') {
        if(!(restName in restMap)){
            restMap[restName] = {
                link: item.childNodes[1].href,
                phone: 0,
                rating: 0.0
            };
        }
    }

    for (var rest in restMap) {
        console.log(rest);
        console.log(restMap[rest].link);
    }
}, true);

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
