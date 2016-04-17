
// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) 
{
    //'use strict';

    var express = require('express');
    var app = express();

    app.get('/', function (req, res) {
        res.send("Hello");
        alert("done");
    });

    alert('after require');
  var srcElement = e.srcElement;
  var name_of_restaurant = "";
  // Lets check if our underlying element is a SPAN.
  if (srcElement.nodeName == 'SPAN') 
  {
      name_of_restaurant = decodeString(srcElement.innerHTML);
      alert(name_of_restaurant);
  } 
  
}, false);

function decodeString(encoded) 
{
    var decoded = encoded.replace(/&amp;/g, '&');  
    return decoded;  
}