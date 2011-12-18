dojo.require("esri.map");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dijit.layout.ContentPane");

// global variable to make debug easier
var map,wmts;

var extent = new esri.geometry.Extent(0, 0, 900000.0, 900000.0, new esri.SpatialReference({
    wkid: 21781  //EPSG:21781  (LV03)
}));

// TileMatrixSet (OGC) / Level of Detail = LOD (ESRI)
// We need this because the origin of each TileMatrix is not always the same
var lods = [];

for (var m in matrixDefs) {
    var def = matrixDefs[m];
    var lod = {};
    lod.level = m;
    lod.scale = def.scaleDenominator / 3.0;
    lod.resolution = def.scaleDenominator / 3571.4376428749997;
    lods.push(lod);
};

function init() {

    initLayer();

    map = new esri.Map("map", {
        extent: new esri.geometry.Extent(450000, 30000, 900000, 350000, new esri.SpatialReference({
            wkid: 21781
        })),
        spatialReference: new esri.SpatialReference({
            wkid: 21781
        })
        });

    dojo.connect(map, "onMouseMove", showCoordinates);
    dojo.connect(map, "onMouseDrag", showCoordinates);
    //dojo.connect(map, "onZoomStart", showInfo);
    //dojo.connect(map, "onZoomEnd", showInfo);

    //resize map when browser resizes
    var resizeTimer;
    dojo.connect(map, 'onLoad', function(theMap) {
        dojo.connect(dijit.byId('map'), 'resize', function() {
            //resize the map if the div is resized
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                map.resize();
                map.reposition();
            }, 500);
        });
    });
    wmts = new ogc.WMTSLayer();
    map.addLayer(wmts);

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

function initLayer() {
    dojo.declare("ogc.WMTSLayer", esri.layers.TiledMapServiceLayer, {
        // create WMTSLayer by extending esri.layers.TiledMapServiceLayer
        constructor: function() {
            this.spatialReference = new esri.SpatialReference({
                wkid: 21781
            });
            this.initialExtent = new esri.geometry.Extent(620000.0, 175000.0, 650000.0, 200000.0, this.spatialReference);
            this.fullExtent = extent;
            this.tileInfo = new esri.layers.TileInfo({
                "dpi": "254", // not sure what it does
                "format": "jpg",
                "compressionQuality": 0,
                "spatialReference": {
                    "wkid": "21781"
                },
                "rows": 256,
                "cols": 256,
                "origin": {
                    "x": 420000,
                    "y": 350000
                },
                // Scales in DPI 96
                "lods": lods

            });
            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function(level, row, col) {
            return "http://wmts0.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20110401/21781/" + level + "/" + row + "/" + col + ".jpeg";
        }
    });
}

dojo.addOnLoad(init);
