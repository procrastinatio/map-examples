var map, wmtsLayer, wmsLayer;

function init() {

    var lv03 = new OpenLayers.Projection("EPSG:21781");

    var options = {
        projection: lv03,
        //new OpenLayers.Projection("EPSG:900913"),
        displayProjection: lv03,
        units: "m",
        //  maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        resolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        };
    map = new GeoAdmin.Map();
    //OpenLayers.Map('map', options);
    var mp = new GeoAdmin.MapPanel({
        renderTo: "map",
        map: map,
        width: 450,
        height: 300
    });
    //map.on("zoomend": mapEvent);
    map.events.register("zoomend", map, mapEvent);

    map.zoomIn();

    var wmts_url = ['http://nx.monnerat.ch/wmts/'];
    var wmts_url = ['http://wmts.procrastinatio.org/'];

    var wmts_layer_options = {
        name: 'Pixelkarte',
        layer: 'ch.swisstopo.gg25-kanton-flaeche.fill',
        //'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
        layername: 'ch.swisstopo.gg25-kanton-flaeche.fill',
        //'ch.swisstopo.pixelkarte-farbe-pk1000.noscale',
        version: "1.0.0",
        requestEncoding: "REST",
        url: wmts_url,
        style: "default",
        matrixSet: "21781",
        //matrixIds: matrixDefs, //config.matrixIds,   
        formatSuffix: 'png',
        dimensions: ['TIME'],
        params: {
            'time': 20111129
        },
        projection: new OpenLayers.Projection('EPSG:21781'),
        units: 'm',
        format: 'image/jpeg',
        buffer: 0,
        opacity: 0.8,
        displayInLayerSwitcher: false,
        isBaseLayer: false,
        //needed by geoadmin    
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        tileOrigin: OpenLayers.LonLat(420000, 350000),
        //zoomOffset: 14,
        resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
        //layerType: config.type,    
        serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        };
    wmtsLayer = new OpenLayers.Layer.WMTS(wmts_layer_options);
    wmsLayer = new OpenLayers.Layer.WMS("WMS (EPSG:21781)", "http://wms.geo.admin.ch?", {
        layers: 'ch.swisstopo.pixelkarte-farbe-pk1000.noscale'
    }, {
        isBaseLayer: false,
        opacity: 0.5,
        projection: lv03,
        singleTile: true,
        });

    // work
    // http://nx.monnerat.ch/wmts/1.0.0/ch.swisstopo.pixelkarte-farbe-pk1000.noscale/default/20111129/21781bbox/10/0/0.jpeg
    // http://nx.monnerat.ch/wmts/1.0.0/ch.swisstopo.pixelkarte-farbe-pk1000.noscale/default/20111027/21781resolution/15/2/1.jpeg
    /* layer_options_wmts.resolutions =[10000,5000,2500,1000,500,200,100,50,25,10,5,2,1,0.5];
            layer_options_wmts.serverResolutions =[10000,5000,2500,1000,500,200,100,50,25,10,5,2,1,0.5];
            layer_options_wmts.maxExtent = OpenLayers.Bounds(420000,30000,900000,350000);
            layer_options_wmts.tileOrigin = OpenLayers.LonLat(420000,350000);
            layer_options_wmts.isBaseLayer = false;
            layer_options_wmts.matrixSet = "21781resolution";
            layer_options_wmts. displayInLayerSwitcher = true;  */

    var resolution_options = {
        resolutions: [10000, 5000, 2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2, 1, 0.5],
        serverResolutions: [10000, 5000, 2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2, 1, 0.5],
        maxExtent: OpenLayers.Bounds(420000, 30000, 900000, 350000),
        tileOrigin: OpenLayers.LonLat(420000, 350000),
        isBaseLayer: false,
        matrixSet: "21781resolution",
        displayInLayerSwitcher: true

    };
    var wmts_layer_alt_options = OpenLayers.Util.extend(wmts_layer_options, resolution_options);
    var wmtsLayer_alt = new OpenLayers.Layer.WMTS(wmts_layer_alt_options);
    // map.addLayers([wmtsLayer,wmtsLayer_alt,wmsLayer]);
    console.log(wmtsLayer_alt);

    GeoAdmin.layers.layers[wmtsLayer_alt.layername] = wmtsLayer_alt;
    map.addLayer(wmtsLayer_alt);
    //,wmsLayer]);
    // map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {
        opacity: 1.0
    });

    map.zoomToExtent(new OpenLayers.Bounds(450000, 50000, 900000, 350000).transform(map.displayProjection, map.projection));
};

function log(msg) {
    document.getElementById("output").innerHTML = msg + "\n";
};

function mapEvent(event) {
    var map = event.object;
    var unitsRatio = OpenLayers.INCHES_PER_UNIT[map.baseLayer.units];
    var layers = map.getLayersByClass('OpenLayers.Layer.WMTS');

    var msg = "<h3>Map settings</h3>zoom=" + map.zoom + "<br />resolution=" + map.resolution;
    msg += "<br />scale=1:" + OpenLayers.Number.format(map.getScale(), 0, "'", ',');
    msg += "<br>maxExtent: " + map.maxExtent.toString() + "<br />";
    msg += " (" + OpenLayers.DOTS_PER_INCH + " dpi)<br />";

    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        if (!layer.visibility) continue;
        console.log(layer);
        // var matrix = matrixIds[map.zoom];
        msg += "<h3>Layer: " + layer.layername + "</h3>";
        msg += "matrixSet: " + layer.matrixSet + "<br />";
        msg += "tileOrigin: " + layer.tileOrigin.toShortString() + "<br />";
        msg += "gridResolution: " + layer.gridResolution + "<br />";
        msg += "projection: " + layer.projection.toString() + "<br />";
        if (layer.matrix && layer.matrix.topLeftCorner && layer.matrix.matrixSize) {
            msg += "tileOrigin: " + layer.matrix.topLeftCorner.toShortString() + "<br />";
            msg += "matrixSize: " + layer.matrix.matrixSize + "<br />";
        }
        // msg += "scaleDenominator: " + OpenLayers.Number.format(layer.matrixIds[map.zoom].scaleDenominator, 0, "'") + "<br />";
        }

    /*msg += "scale=1:" + OpenLayers.Number.format(map.resolution * OpenLayers.INCHES_PER_UNIT[map.getUnits()] * guessedDpi, 0, "'");
        msg += " (" + guessedDpi + " dpi)  <--This is maybe your resolution<br />" + "scale=1:" + OpenLayers.Number.format(map.resolution * OpenLayers.INCHES_PER_UNIT[map.getUnits()] * 254.0, 0, "'");
        msg += " (" + 254 + " dpi)<br />";  */

    log(msg);
}
