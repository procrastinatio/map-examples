var map, lyr_ski, lyr_hang;

function init() {
    var api = new GeoAdmin.API();

    // Proxy stuff to get GetCapabilities xml
    OpenLayers.ProxyHost = (window.location.host == "localhost") ? "/cgi-bin/proxy.cgi?url=": "/cgi-bin/printproxy.cgi?url=";

    map = api.createMap({
        height: 700,
        div: "map",
        easting: 645000,
        northing: 150000,
        zoom: 5
    });

    GeoAdmin.layers.init();
    
    // Add the layers to the layer list. The missing information will be
    // read from the GetCapabilities document
    GeoAdmin.layers.layers['ch.swisstopo-karto.skitouren'] = {
        layer: "ch.swisstopo-karto.skitouren",
        capabilitiesNeeded: true,
        url: "http://wmts.geo.admin.ch",
        layertype: "wmts"
    };

    GeoAdmin.layers.layers['ch.swisstopo-karto.hangneigung'] = {
        layer: "ch.swisstopo-karto.hangneigung",
        capabilitiesNeeded: true,
        url: "http://wmts.geo.admin.ch",
        layertype: "wmts"
    };
    // Now, you can add them the normal way
    lyr_hang = map.addLayerByName('ch.swisstopo-karto.hangneigung', {
        opacity: 0.7
    });
    lyr_ski = map.addLayerByName('ch.swisstopo-karto.skitouren');
}

