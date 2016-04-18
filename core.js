var restMap = {};
var clicked = false;

//get list of all restaurant
//document.getElementById('desktop-sidebar').addEventListener("click", function (event) {
document.addEventListener('load', function () {
    if (!clicked) {
        clicked = true;
        var temp = document.getElementsByClassName("tablesorter");
        var table = temp[0];

        for (var i = 1, row; row = table.rows[i]; i++) {
            var restName = row.cells[0].textContent.trim();

            if (!(restName in restMap)) {
                restMap[restName] = {
                    link: row.cells[0].childNodes[1].href,
                    datalat: row.attributes[6].nodeValue,
                    datalng: row.attributes[7].nodeValue,
                    phone: 0,
                    rating: 0.0,
                    yelp_url: "http:\\\\google.com",
                    rating_img_url: "https://s3-media1.fl.yelpcdn.com/assets/2/www/img/5ef3eb3cb162/ico/stars/v1/stars_3_half.png"
                };
            }
        }

        //log for testing purpose
        //for (var rest in restMap) {
        //    console.log(rest);
        //    console.log("lat: " + restMap[rest].datalat);
        //    console.log("lng: " + restMap[rest].datalng);
        //}

        injectRating(table);
        changeStyle();
    }
}, true);

function injectRating(table) {
    var tHead = table.tHead;
    for (var h = 0; h < tHead.rows.length; h++) {
        var newTH = document.createElement('th');
        tHead.rows[h].appendChild(newTH);
        newTH.innerHTML = 'Rating';
        newTH.className = 'desktop-only header';
    }

    var tBodies = table.tBodies[0];
    for (var i = 0; i < tBodies.rows.length; i++) {
        var newCell = tBodies.rows[i].insertCell(-1);
        var temp = table.rows[i+1].cells[0].textContent.trim();
        //newCell.innerHTML = restMap[temp].rating;
        newCell.innerHTML = '<a href="' + restMap[temp].yelp_url + '" target="_blank"><img src="' + restMap[temp].rating_img_url + '" width=95%>';
        newCell.nodeValue = i;
        newCell.className = 'desktop-only';
    }
};

function changeStyle() {
    document.getElementsByClassName('cuisine')[0].style.width = '17%';
    document.getElementsByClassName('neighborhood')[0].style.width = '24%';
};