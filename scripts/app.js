require([
	'dojo/request/script',
	'esri/map',
	'dojo/domReady!'
], function (script, Map) {

    //Setup default map options
    var map;
    var mapOptions = {
        center: [0, 0],
        zoom: 3,
        basemap: "streets"
    };

    var mapCenteredAtGeoIP = function (mapDiv) {

        //Setup options to make AJAX requests
        var url = "";
        var xhrOptions = {
            jsonp: "callback",
            query: {
                f: "json"
            }
        };

        var handleAjaxError = function (error) {
            console.error("error performing XHR to " + error.response.url);
            //Initialize the map with default options
            map = new Map(mapDiv, mapOptions);
        };

        //Get the Client IP
        url = "https://www.arcgis.com/sharing/geoip.jsp";
        script.get(url, xhrOptions).then(function (response) {
            var clientIP = response.clientip || "www.arcgis.com";
            //clientIP = "www.arcgis.com";
            //Perform a GeoIP lookup
            url = "https://freegeoip.net/json/" + clientIP;
            script.get(url, xhrOptions).then(function (response) {
                mapOptions.center = [response.longitude, response.latitude];
                mapOptions.zoom = mapOptions.zoom * 4;
                map = new Map(mapDiv, mapOptions);
            }, handleAjaxError);
        }, handleAjaxError);
    } ("mapDiv");
});