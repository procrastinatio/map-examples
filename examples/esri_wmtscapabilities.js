dojo.require("esri.map");
dojo.require("esri.layers.wmts");
dojo.require("esri.geometry.Point");
dojo.require("esri.SpatialReference");
dojo.require("esri.dijit.Scalebar");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");

// global variable to make debug easier
var map, wmts;

function init() {

    esri.config.defaults.io.proxyUrl = "/cgi-bin/proxy";

    map = new esri.Map("map");

    /* var scalebar = new esri.dijit.Scalebar({
          map: map,
          // "dual" displays both miles and kilmometers
          // "english" is the default, which displays miles
          // use "metric" for kilometers
          scalebarUnit: "metric",
          attachTo: "bottom-left"
        }); */

    var layerInfo = new esri.layers.WMTSLayerInfo({
        identifier: "ch.swisstopo.pixelkarte-farbe",
        //tileMatrixSet: "21781_26",
        // style: "default",
        //format: "jpeg"
    });
    var options = {
        serviceMode: "RESTful",
        layerInfo: layerInfo,
        hasAttributionData: true,
        showAttribution: true,
        copyright: 'swisstopo'
    };

    wmts = new esri.layers.WMTSLayer("http://www.procrastinatio.org/examples", options);
    console.log('template', wmts);
    map.addLayer(wmts);
    var center = new esri.geometry.Point(715000, 95000, new esri.SpatialReference({
        wkid: 21781
    }));
   
    map.centerAndZoom(center, 18);



    dojo.connect(map, "onMouseMove", showCoordinates);
    dojo.connect(map, "onMouseDrag", showCoordinates);
   
    //resize map when browser resizes
    var resizeTimer;
    dojo.connect(map, 'onLoad', function (theMap) {
        dojo.connect(dijit.byId('map'), 'resize', function () {
            //resize the map if the div is resized
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                map.resize();
                map.reposition();
            }, 500);
        });
    });

}

function showInfo(extent, zoomFactor, anchor, level) {
    var lod = lods[level];
    dojo.byId('level').innerHTML += dojo.string.substitute(
        "Level: '${0}', scale: 1:${1}, resolution: ${2}<br />", [level, lod.scale, lod.resolution]);
};

function showCoordinates(evt) {
    //get mapPoint from event
    var mp = evt.mapPoint;
    //display mouse coordinates
    dojo.byId("info").innerHTML = parseInt(mp.x) + ", " + parseInt(mp.y);
}

dojo.ready(init);