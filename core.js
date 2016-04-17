//ultilize storage to store data - maybe using this to store a list of all restaurant name
var storage = chrome.storage.local;
var message = document.querySelector('#message');
var restMap = {};
var clicked = false;
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
    if (!clicked) {
        clicked = true;
        var temp = document.getElementsByClassName("tablesorter");
        var table = temp[0];

        for (var i = 1, row; row = table.rows[i]; i++) {
            var item = row.cells[0];
            var restName = item.textContent.trim();

            //if (typeof restMap[restName] != 'undefined') {
            if (!(restName in restMap)) {
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
            console.log(rest);
            console.log("lat: " + restMap[rest].datalat);
            console.log("lng: " + restMap[rest].datalng);
        }

        injectRating(table);
        changeStyle();
    }
}, true);

function decodeString(encoded) {
   var decoded = encoded.replace(/&amp;/g, '&');
   return decoded;
};

function injectRating(table) {
    var tHead = table.tHead;
    for (var h = 0; h < tHead.rows.length; h++) {
        var newTH = document.createElement('th');
        tHead.rows[h].appendChild(newTH);
        newTH.innerHTML = 'Rating';
        newTH.className = 'cuisines';
    }

    var tBodies = table.tBodies[0];
    for (var i = 0; i < tBodies.rows.length; i++) {
        var newCell = tBodies.rows[i].insertCell(-1);
        var temp = table.rows[i+1].cells[0].textContent.trim();
        //newCell.innerHTML = restMap[temp].rating;
        newCell.innerHTML = '<img src="https://s3-media1.fl.yelpcdn.com/assets/2/www/img/5ef3eb3cb162/ico/stars/v1/stars_3_half.png" width=95%>';
        newCell.className = 'desktop-only';
    }
};

function changeStyle() {
    document.getElementsByClassName('cuisine')[0].style.width = '17%';
    document.getElementsByClassName('neighborhood')[0].style.width = '24%';
};

//check to see if the ratings have already been pulled, 
//if so just load the modified css
storage.get('css', function (items) {
   //console.log(items);

   //inject the css
   if (items.css) {
       chrome.tabs.insertCSS({ code: items.css }, function () {
           if (chrome.runtime.lastError) {
               console.log ('Something went wrong with the injection process.');
           } else {
               console.log ('Inject successfully');
           }
       });
   } else {
       //define how the rating are shown in the web page
       //var optionsUrl = chrome.extension.getURL('options.html');
       //message.innerHTML = 'Set CSS in the <a target="_blank" href="' +
       //    optionsUrl + '">options page</a>.';
       var cssCode = '#application table .cuisine { width: 17%; !important } #application table .neighborhood { width: 23%; !important}';

       storage.set({ 'css': cssCode }, function () {
           // Notify that we saved.
           console.log('Settings saved');
       });

       storage.get('css', function (items) {
           // To avoid checking items.css we could specify storage.get({css: ''}) to
           // return a default value of '' if there is no css value yet.
           if (items.css) {
               textarea.value = items.css;
               message('Loaded saved CSS.');
           }
       });

       chrome.tabs.insertCSS({ code: items.css }, function () {
           if (chrome.runtime.lastError) {
               console.log ('Something went wrong with the injection process.');
           } else {
               message.innerText ('Inject successfully');
           }
       });
   }
});

//function settingChanged() {
//    var type = this.id;
//    var setting = this.value;
//    var partern = /^file:/.test(url) ? url : url.replace(/\/[^\/]*?$/, '/*');

//    console.log(type+' setting for '+pattern+': '+setting);
//    // HACK: [type] is not recognised by the docserver's sample crawler, so
//    // mention an explicit
//    // type: chrome.contentSettings.cookies.set - See http://crbug.com/299634
//    chrome.contentSettings[type].set({
//        'primaryPattern': pattern,
//        'setting': setting,
//        'scope': (incognito ? 'incognito_session_only' : 'regular')
//    });
//}

//document.addEventListener('DOMContentLoaded', function () {
//});