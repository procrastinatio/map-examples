var map, wmsLayer, data;
var n=1;

function log(msg) {
    var output = OpenLayers.Util.getElement('output');
    if (output) {
        output.innerHTML += rpad(n+"/ " +msg, 88) + "[OK]<br />";
        n++;
    }
}

function lpad(txt, len) {
    var empty = Array(len+1).join(" ")
    return (empty + txt).slice(-len);
}

function rpad(txt, len) {
    var p = (len - txt.length> 0) ? len-txt.length: 0; 
    var empty = Array(p).join(" ");
    return (txt + empty);
}

function init() {

    var params = OpenLayers.Util.getParameters();

    // var  data = params.data ? "WMTSCapabilities.xml" : "http://api.geo.admin.ch/1.0.0/WMTSCapabilities.xml";
    var url = params.url ? params.url :  "http://api.geo.admin.ch/1.0.0/WMTSCapabilities.xml";

    var   format = new OpenLayers.Format.WMTSCapabilities();

    OpenLayers.ProxyHost = (window.location.host == "localhost") ? "/cgi-bin/proxy.cgi?url=": "/cgi-bin/proxy?url=";

    OpenLayers.Request.GET({
        url: url, //"http://api.geo.admin.ch/1.0.0/WMTSCapabilities.xml",
        
        success: function(request) {
            var doc = request.responseXML;
            if (!doc || !doc.documentElement) {
                doc = request.responseText;
            }
            log("Loading GetCapabilities from " + url);
            log("Got document");
            var capabilities = format.read(doc);
            log("Document successfully parsed");
            
            log("Capabilities has " + capabilities.contents.layers.length + " layers");

            var layer = format.createLayer(capabilities, {
                layer: "ch.bafu.bundesinventare-bln",
                opacity: 0.7,
                isBaseLayer: false,
            });
            log("Creating OL Layer with Timestamp : "+layer.params['TIME']);

            map.addLayer(layer);
            log("Layer added to the map: "+ layer.name);
        },
        failure: function() {
            log("Trouble getting capabilities doc");
            OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
        }
    })

    // Add the LV03 projection as it is not defined in OL
    Proj4js.defs["EPSG:21781"] = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";
    // I prefer this style to the OL default...
    OpenLayers.ImgPath = "http://map.geo.admin.ch/main/wsgi/lib/GeoAdmin.ux/Map/img/";

    map = new OpenLayers.Map({
        div: "map",
        projection: "EPSG:21781",
        units: "m",
        controls: [
            new OpenLayers.Control.Navigation(), 
            new OpenLayers.Control.PanZoomBar(),
            new OpenLayers.Control.ScaleLine({maxWidth: 120})
        ],
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        resolutions: [1000, 500, 250, 100] 
        });
    
    // Create a WMS base layer
    wmsLayer  = new OpenLayers.Layer.WMS(
        "OpenLayers WMS",
         "http://wms.geo.admin.ch/", 
         {
             layers: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale'
         }, {
             singleTile: true,
             isBaseLayer: true, 
             opacity: 0.5
    });
    map.addLayer(wmsLayer);

    map.zoomToMaxExtent();

}
