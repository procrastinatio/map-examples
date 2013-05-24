dojo.require("esri.map");
dojo.require("esri.layers.wms");
dojo.require("esri.geometry.Extent");
dojo.require("esri.tasks.identify");
dojo.require("dijit.layout.ContentPane");
dojo.require("dijit.layout.TabContainer");
dojo.require("dijit.form.Button");
dojo.require("dijit.layout.BorderContainer");

// global variable to make debug easier
var map, wmts, extent;
var lods = [];

var map, identifyTask, identifyParams, symbol;
var layer2results, layer3results, layer4results;

function init() {

    
    esri.config.defaults.io.proxyUrl =  (window.location.host == "localhost") ? "/cgi-bin/esri.cgi": "/cgi-bin/proxy"; ;
    esri.config.defaults.io.alwaysUseProxy = false;

    // TileMatrixSet (OGC) / Level of Detail = LOD (ESRI)
    // We need this because the origin of each TileMatrix is not always the same

    for (var m in matrixDefs) {
        var def = matrixDefs[m];
        var lod = {};
        lod.level = m;
        lod.scale = def.scaleDenominator / 3.0;
        lod.resolution = def.scaleDenominator / 3571.4376428749997;
        lods.push(lod);
    };

    initLayer();

    map = new esri.Map("map", {
        extent: new esri.geometry.Extent(450000, 30000, 900000, 350000, new esri.SpatialReference({
            wkid: 21781
        })),
        spatialReference: new esri.SpatialReference({
            wkid: 21781
        })
    });
    map.setZoom(15);
    dojo.connect(map, "onLoad", initFunctionality);
    dojo.connect(map, "onMouseMove", showCoordinates);
    dojo.connect(map, "onMouseDrag", showCoordinates);

    wmts = new ogc.WMTSLayer();
    map.addLayer(wmts);

    var wmsLayer = new esri.layers.WMSLayer("http://wms.geo.admin.ch/");
    //set visible layers - jagdbangebiet and ILMN
    wmsLayer.setVisibleLayers([159, 162]);
    wmsLayer.setImageFormat("png");
    map.addLayer(wmsLayer);

}

function initFunctionality(map) {
    dojo.connect(map, "onClick", doIdentify);

    identifyTask = new esri.tasks.IdentifyTask("http://www.procrastinatio.org/esri/rest/services/bafu/MapServer");

    identifyParams = new esri.tasks.IdentifyParameters();
    identifyParams.tolerance = 3;
    identifyParams.returnGeometry = true;
    identifyParams.layerIds = [1000, 2000];
    identifyParams.layerOption = esri.tasks.IdentifyParameters.LAYER_OPTION_ALL;
    identifyParams.width = map.width;
    identifyParams.height = map.height;

    dojo.byId("output").innerHTML = "";
    // map.infoWindow.resize(415, 200);
    //map.infoWindow.setContent(dijit.byId("tabs").domNode);
    //map.infoWindow.setTitle("Identify Results");

}

function doIdentify(evt) {
    map.graphics.clear();
    identifyParams.geometry = evt.mapPoint;
    identifyParams.mapExtent = map.extent;
    var ex = map.extent;
    var extent = [ex.xmin, ex.ymin, ex.xmax, ex.ymax].join(",");
    identifyParams.mapExtent = extent;

    identifyTask.execute(identifyParams, function (idResults) {
         addToMap(idResults, evt);
    });
}

function addToMap(idResults, evt) {
    bldgResults = {
        displayFieldName: null,
        features: []
    };
    parcelResults = {
        displayFieldName: null,
        features: []
    };

    for (var i = 0, il = idResults.length; i < il; i++) {
        var idResult = idResults[i];
        if (idResult.layerId === 1000) {
            if (!bldgResults.displayFieldName) {
                bldgResults.displayFieldName = idResult.displayFieldName
            };
            bldgResults.features.push(idResult.feature);
        } else if (idResult.layerId === 2000) {
            if (!parcelResults.displayFieldName) {
                parcelResults.displayFieldName = idResult.displayFieldName
            };
            parcelResults.features.push(idResult.feature);
        }
    }
    var content = layerTabContent(bldgResults, "Landscapes and Natural Monuments");
    content += layerTabContent(parcelResults, "Game reserves");

    dojo.byId("output").innerHTML = content;

    //map.infoWindow.show(evt.screenPoint, map.getInfoWindowAnchor(evt.screenPoint));
}
// copied from ESRI example, not my fault!
function layerTabContent(layerResults, layerName) {
    var content = "";

    switch (layerName) {
    case "Landscapes and Natural Monuments":
        content = "<b>" + layerName + "</b>: <i>Total features returned: " + layerResults.features.length + "</i>";
        content += "<table border='1'><tr><th>ID</th><th>Name</th></tr>";
       
        for (var i = 0, il = layerResults.features.length; i < il; i++) {
            content += "<tr><td>" + layerResults.features[i].attributes['bgdi_id'] + "</td>";
            content += "<td>" + layerResults.features[i].attributes['bln_name'] + "</td>";
        }
        content += "</tr></table>";
        break;
    case "Game reserves":
        content = "<b>" + layerName + "</b>: <i>Total features returned: " + layerResults.features.length + "</i>";
        content += "<table border='1'><tr><th>ID</th><th>Name</th><th>Type</th><th>Category</th></tr>";
        for (var i = 0, il = layerResults.features.length; i < il; i++) {
            content += "<tr><td>" + layerResults.features[i].attributes['jb_id'] + "</td>";
            content += "<td>" + layerResults.features[i].attributes['jb_name'] + "</td>";
            content += "<td>" + layerResults.features[i].attributes['jb_typ'] + "</td>";
            content += "<td>" + layerResults.features[i].attributes['jb_kat'] + "</td>";
        }
        content += "</tr></table>";
        break;

    }
    return content;
}


function showCoordinates(evt) {
    //get mapPoint from event
    var mp = evt.mapPoint;
    //display mouse coordinates
    dojo.byId("info").innerHTML = parseInt(mp.x) + ", " + parseInt(mp.y);
}

function initLayer() {
    dojo.declare("ogc.WMTSLayer", esri.layers.TiledMapServiceLayer, {
        // create WMTSLayer by extending esri.layers.TiledMapServiceLayer
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({
                wkid: 21781
            });
            this.initialExtent = new esri.geometry.Extent(620000.0, 175000.0, 650000.0, 200000.0, this.spatialReference);
            this.fullExtent = new esri.geometry.Extent(0, 0, 900000.0, 900000.0, this.spatialReference);  
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

        getTileUrl: function (level, row, col) {
            var hosts = ['wmts0.geo.admin.ch', 'wmts1.geo.admin.ch', 'wmts2.geo.admin.ch']
            var host = hosts[Math.floor(Math.random() * hosts.length)];
            return "http://" + host + "/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20110401/21781/" + level + "/" + row + "/" + col + ".jpeg";
        }
    });
}

dojo.addOnLoad(init);