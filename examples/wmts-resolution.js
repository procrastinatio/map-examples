var map, wmtsLayer;

function init() {

    map = new GeoAdmin.Map();
    var mp = new GeoAdmin.MapPanel({
        renderTo: "map",
        map: map,
        width: 550,
        height: 350
    });
    map.events.register("zoomend", map, mapEvent);

    map.zoomIn();

    // Standard WMTS options for GeoAdmin...
    var wmts_url = ['http://wmts0.geo.admin.ch/', 'http://wmts1.geo.admin.ch/'];
    var wmts_layer_options = {
        name: 'Pixelkarte',
        layer: 'ch.swisstopo.gg25-kanton-flaeche.fill',
        layername: 'ch.swisstopo.gg25-kanton-flaeche.fill',
        version: "1.0.0",
        requestEncoding: "REST",
        url: wmts_url,
        style: "default",
        matrixSet: "21781",
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
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        tileOrigin: OpenLayers.LonLat(420000, 350000),
        resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
        serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        };
    
    // We overload these options for our layer using custom resolution
    var resolution_options = {
		url:  ['http://wmts.procrastinatio.org/'],
        resolutions: [10000, 5000, 2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2, 1, 0.5],
        serverResolutions: [10000, 5000, 2500, 1000, 500, 200, 100, 50, 25, 10, 5, 2, 1, 0.5],
        maxExtent: OpenLayers.Bounds(420000, 30000, 900000, 350000),
        tileOrigin: OpenLayers.LonLat(420000, 350000),
        isBaseLayer: false,
        matrixSet: "21781resolution",
        displayInLayerSwitcher: true

    };
    // Create a WMTS layer using our alternative resolutions
    var wmts_layer_alt_options = OpenLayers.Util.extend(wmts_layer_options, resolution_options);
    var wmtsLayer = new OpenLayers.Layer.WMTS(wmts_layer_alt_options);
    // Has to be in the GeoAdmin layers list...
    GeoAdmin.layers.layers[wmtsLayer.layername] = wmtsLayer;
    map.addLayer(wmtsLayer);

    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {
        opacity: 1.0
    });

    map.zoomToExtent(new OpenLayers.Bounds(481900,76900,838100,303100).transform(map.displayProjection, map.projection));
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
        msg += "<h3>Layer: " + layer.layername + "</h3>";
        msg += "matrixSet: " + layer.matrixSet + "<br />";
        msg += "tileOrigin: " + layer.tileOrigin.toShortString() + "<br />";
        msg += "gridResolution: " + layer.gridResolution + "<br />";
        msg += "projection: " + layer.projection.toString() + "<br />";
        if (layer.matrix && layer.matrix.topLeftCorner && layer.matrix.matrixSize) {
            msg += "tileOrigin: " + layer.matrix.topLeftCorner.toShortString() + "<br />";
            msg += "matrixSize: " + layer.matrix.matrixSize + "<br />";
        }
    }
    log(msg);
}
