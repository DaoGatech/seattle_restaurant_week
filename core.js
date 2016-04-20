var retardedCoder = {};
var clicked = false;

document.addEventListener('load', function () {
    if (!clicked) {
        clicked = true;
        var temp = document.getElementsByClassName("tablesorter");
        var table = temp[0];

        injectRating(table);
        changeStyle();

        retardedCoder["4254873475"] = "4254873474";
        retardedCoder["2063973566"] = "2063973564";
        retardedCoder["2067771990"] = "2062192224";
        retardedCoder["2069631922"] = "2066231922";
        retardedCoder["2064860390"] = "2064360390";
        retardedCoder["4256934199"] = "4256434144";
        retardedCoder["4258316517"] = "4258882556";
        retardedCoder["2063209711"] = "2063209771";

        var accessor = {
            consumerSecret: token.consumerSecret,
            tokenSecret: token.tokenSecret
        };

        for (var i = 1, row; row = table.rows[i]; i++) {
            $.ajax({
                //url: 'http://srw.seattletimes.com/?p=463',
                url: row.cells[0].childNodes[1].href,
                //async: false,
                success: function (result) {
                    var phone = result.match(/\(?(\d{3})\)?-?\s?\.?(\d{3})-?\s?\.?(\d{4})/);
                    var phoneNum = phone[1] + phone[2] + phone[3];
                    if (phoneNum in retardedCoder) phoneNum = retardedCoder[phoneNum];

                    var rtrt = result.match(/<h3>(.*)<\/h3>/)[1];
                    rtrt = rtrt.replace(/&amp;/g, '&').replace(/&#8217;/g, '\u2019').replace(/&#8211;/g, '\u2013');

                    parameters = [];
                    parameters.push(['phone', phoneNum]);
                    parameters.push(['jsonpCallback', 'cb']);
                    parameters.push(['oauth_consumer_key', token.consumerKey]);
                    parameters.push(['oauth_consumer_secret', token.consumerSecret]);
                    parameters.push(['oauth_token', token.accessToken]);
                    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

                    var message = {
                        'action': 'http://api.yelp.com/v2/phone_search/',
                        'method': 'GET',
                        'parameters': parameters
                    };

                    OAuth.setTimestampAndNonce(message);
                    OAuth.SignatureMethod.sign(message, accessor);

                    var parameterMap = OAuth.getParameterMap(message.parameters);
                    parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

                    $.ajax({
                        url: message.action,
                        data: parameterMap,
                        cache: true,
                        jsonp: false,
                        jsonpCallback: 'cb',
                        //async: false,
                        success: function (data, textStats, XMLHttpRequest) {
                            if (data.businesses.length > 0) document.getElementById(rtrt).innerHTML = '<a href="' + data.businesses[0].url + '" target="_blank"><img src="' + data.businesses[0].rating_img_url + '" width=95%>';
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            document.getElementById(rtrt).innerHTML = '<a href="http://www.yelp.com/biz/noi-thai-cuisine-seattle-seattle-2?utm_campaign=yelp_api&utm_medium=api_v2_phone_search&utm_source=i_05L3yrWHLnkHjt97Y0Kw" target="_blank"><img src="https://s3-media4.fl.yelpcdn.com/assets/2/www/img/c2f3dd9799a5/ico/stars/v1/stars_4.png" width=95%>';
                        }
                    });
                }
            });
        }
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
        newCell.innerHTML = 'No Data';
        newCell.id = table.rows[i + 1].cells[0].textContent.trim();;
        newCell.className = 'desktop-only';
    }
}

function changeStyle() {
    document.getElementsByClassName('cuisine')[0].style.width = '17%';
    document.getElementsByClassName('neighborhood')[0].style.width = '24%';
};