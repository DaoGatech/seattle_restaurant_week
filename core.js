// Unique ID for the className.
var MOUSE_VISITED_CLASSNAME = 'crx_mouse_visited';

// Previous dom, that we want to track, so we can remove the previous styling.
var prevDOM = null;

// Mouse listener for any move event on the current document.
document.addEventListener('mousemove', function (e) 
{
  var srcElement = e.srcElement;
  var name_of_restaurant = "";
  // Lets check if our underlying element is a SPAN.
  if (srcElement.nodeName == 'SPAN') 
  {
      name_of_restaurant = decodeString(srcElement.innerHTML);
      var class_name = "." + srcElement.parentElement.className;
      
      $(class_name).attr("title","helloworld");
      $(class_name).tooltip({
        tooltipClass: "rating-tooltip"
      });
  } 
}, false);
function decodeString(encoded) 
{
    var decoded = encoded.replace(/&amp;/g, '&');  
    return decoded;  
}