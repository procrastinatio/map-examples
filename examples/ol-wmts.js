var map,
wmtsLayer;

function init() {
    // Add the LV03 projection as it is not defined in OL
    Proj4js.defs["EPSG:21781"] = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";
    // I prefer this style to the OL default...
    OpenLayers.ImgPath = "http://map.geo.admin.ch/main/wsgi/lib/GeoAdmin.ux/Map/img/";


    map = new OpenLayers.Map({
        div: "map",
        projection: "EPSG:21781",
        units: "m",
        controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar(), new OpenLayers.Control.ScaleLine({
            maxWidth: 120
        })],
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        resolutions: [650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5]
        });

    // Standard WMTS options for GeoAdmin...
    var wmts_url = ['http://wmts0.geo.admin.ch/', 
		'http://wmts1.geo.admin.ch/',  
		'http://wmts2.geo.admin.ch/', 
		'http://wmts3.geo.admin.ch/',
		'http://wmts4.geo.admin.ch/'];
		
    var wmts_layer_options = {
        name: 'Pixelkarte',
        layer: 'ch.swisstopo.pixelkarte-farbe',
        layername: 'ch.swisstopo.pixelkarte-farbe',
        version: "1.0.0",
        requestEncoding: "REST",
        url: wmts_url,
        style: "default",
        matrixSet: "21781",
        formatSuffix: 'jpeg',
        dimensions: ['TIME'],
        params: {
            'time': 20111206  // You need this, 'default' won't work
        },
        projection: new OpenLayers.Projection('EPSG:21781'),
        units: 'm',
        format: 'image/jpeg',
        buffer: 0,
        opacity: 1.0,
        displayInLayerSwitcher: false,
        isBaseLayer: true,
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        tileOrigin: OpenLayers.LonLat(420000, 350000),
        resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
        serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5]
        };

    // Create a WMTS layer using our resolutions
    var wmtsLayer = new OpenLayers.Layer.WMTS(wmts_layer_options);

    map.addLayer(wmtsLayer);

    map.zoomIn();

}
