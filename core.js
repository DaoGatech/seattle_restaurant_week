var restMap = {};
var clicked = false;

//get list of all restaurant
//document.getElementById('desktop-sidebar').addEventListener("click", function (event) {
document.addEventListener('load', function () {
    if (!clicked) {
        clicked = true;
        var temp = document.getElementsByClassName("tablesorter");
        var table = temp[0];
        var count1 = 0;
        var count2 = 0;

        for (var i = 1, row; row = table.rows[i]; i++) {

            var restName = row.cells[0].textContent.trim();
            //var latlng = (parseFloat(row.attributes[6].nodeValue) + parseFloat(row.attributes[7].nodeValue)).toFixed(4);
            //restName = restName.toString();
            cou
            if (!(restName in restMap)) {
                restMap[restName] = {
                    //name: restName,
                    link: row.cells[0].childNodes[1].href,
                    datalat: row.attributes[6].nodeValue,
                    datalng: row.attributes[7].nodeValue,
                    phone: 0,
                    rating: 0.0,
                    yelp_url: '',
                    rating_img_url: '',
                    row_num: 0
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
        getYelpData(table);
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
        var temp = table.rows[i + 1].cells[0].textContent.trim();
        //var temp = (parseFloat(tBodies.rows[i].attributes[6].nodeValue) + parseFloat(tBodies.rows[i].attributes[7].nodeValue)).toFixed(4)
        //newCell.innerHTML = restMap[temp].rating;
        newCell.innerHTML = 'No Data'; //'<a href="' + restMap[temp].yelp_url + '" target="_blank"><img src="' + restMap[temp].rating_img_url + '" width=95%>';
        restMap[temp].row_num = i + 1;
        newCell.id = 'cell_' + (i + 1);
        newCell.className = 'desktop-only';
    }
}

function changeStyle() {
    document.getElementsByClassName('cuisine')[0].style.width = '17%';
    document.getElementsByClassName('neighborhood')[0].style.width = '24%';
};

function getYelpData(table) {
    for (var rest in restMap) {
        //var latlng = -74.5281;
        var rest = "Trellis"; //restMap[latlng];
        var near = 'Seattle';

        var accessor = {
            consumerSecret: token.consumerSecret,
            tokenSecret: token.tokenSecret
        };

        parameters = [];
        parameters.push(['term', rest]);
        parameters.push(['location', near]);
        parameters.push(['limit', 1]);
        parameters.push(['jsonpCallback', 'cb']);
        parameters.push(['oauth_consumer_key', token.consumerKey]);
        parameters.push(['oauth_consumer_secret', token.consumerSecret]);
        parameters.push(['oauth_token', token.accessToken]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

        var message = {
            'action': 'http://api.yelp.com/v2/search',
            'method': 'GET',
            'parameters': parameters
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);

        var parameterMap = OAuth.getParameterMap(message.parameters);
        parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

        $.ajax({
            url: message.action,
            data: parameterMap,
            cache: true,
            jsonp: false,
            jsonpCallback: 'cb',
            async: false,
            success: function (data, textStats, XMLHttpRequest) {
                if (data.businesses.length > 0) {
                    var name = data.businesses[0].name;
                    //var latlng = (parseFloat(data.businesses[0].location.coordinate.latitude) + parseFloat(data.businesses[0].location.coordinate.longitude)).toFixed(5);
                     
                    restMap[name].rating_img_url = data.businesses[0].rating_img_url;
                    restMap[name].yelp_url = data.businesses[0].url;
                    //updateTableBody(table, rest)
                    document.getElementById('cell_' + restMap[name].row_num).innerHTML = '<a href="' + restMap[name].yelp_url + '" target="_blank"><img src="' + restMap[name].rating_img_url + '" width=95%>';
                    console.log(name);
                }
            }
        });
        //break;
    }
}
