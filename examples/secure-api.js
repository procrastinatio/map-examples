
var baseUrl = "https://api.geo.admin.ch/main/wsgi";      

(function() {
    if (window.location.protocol !== "https:")
          window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);
    
    var scriptSrc =   "lib/api.js";
        document.write('<scr' + 'ipt type="text/javascript" src="' + scriptSrc + '"></scr' + 'ipt>');

    var OpenLayersImgPath = baseUrl +"/GeoAdmin.ux/Map/img/";
    document.write(
        '<scr' + 'ipt type="text/javascript">' +
            'if (!window.GeoAdmin) {' +
                'window.GeoAdmin = {};' +
            '}' +
            'window.GeoAdmin.webServicesUrl =  baseUrl;' +
            'window.GeoAdmin.OpenLayersImgPath = "' + OpenLayersImgPath + '";' +
        '</scr' + 'ipt>');
    
     var cssHref = baseUrl + "/build/api.css";
    document.write('<link rel="stylesheet" type="text/css" href="' + cssHref + '" />');
})();

function init() {
    

    
      var api = new GeoAdmin.API();
      api.createMap({
                   div: "map"
      });
}

