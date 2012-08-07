var _api;
var _map;

function init() {
    _api = new GeoAdmin.API();
    _map = _api.createMap({
        div: "map"
    });
    var layer = createLayer("BLN with style and labels", "bln-style.kml");
    _map.addLayer(layer);
}

function createLayer(name, path) {

    var styleMap = new OpenLayers.StyleMap({
        'default': {
            label: "${name}",
            fontWeight: "bold",
            fontColor: "black",
            fontSize: "11px",
            labelAlign: "cm",
            pointRadius: 2,
            labelXOffset: 0,
            // "${labelX}",
            labelYOffset: 0,
            //"${labelY}",
            labelSelect: true,
            labelOutlineColor: "white",
            labelOutlineWidth: 3,

            strokeColor: "#ff6633",
            strokeOpacity: 0.8,
            strokeWidth: 3,
            fillColor: "#FF5500",
            fillOpacity: 0.5
        }
    });

    var kmlLayer = new OpenLayers.Layer.Vector(name, {
        styleMap: styleMap,
        projection: _map.projection,
        //isBaseLayer: true,
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: path,
            format: new OpenLayers.Format.KML({
                //extractStyles: true,
                extractAttributes: true,
                externalProjection: new OpenLayers.Projection("EPSG:4326"),
                internalProjection: _map.projection,
                kmlns: "http://www.opengis.net/kml/2.2",
                })
            })
        });
    return kmlLayer;
}