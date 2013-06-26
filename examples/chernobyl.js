var _api;
var _map;

function init() {
    _api = new GeoAdmin.API();
    _map = _api.createMap({
        div: 'map',
        bgLayer: 'ch.swisstopo.pixelkarte-grau'
    });
    var layer = createLayer('BLN with style and labels', 'data/chernobyl.kml');

    var drag = new OpenLayers.Control.DragFeature(layer);

    drag.mode |= OpenLayers.Control.ModifyFeature.DRAG;
    drag.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
    drag.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;

    _map.addControl(drag);
    drag.activate();
    _map.addLayer(layer);
    var controls = _map.getControlsByClass('OpenLayers.Control.SelectFeature');
    for (var i = 0; i < controls.length; ++i) {
        controls[i].deactivate();

    }
     _map.zoomToExtent([568546.15384615,
                        197880.76923077,
                        706046.15384615,
                        285380.76923077]);
}

function createLayer(name, path) {

    var styleMap = new OpenLayers.StyleMap({
        'default': new OpenLayers.Style({
            label: '${name}',
            fontWeight: 'bold',
            fontColor: 'black',
            fontSize: '11px',
            fontFamily: 'Voltaire',
            //labelAlign: "lb",
            pointRadius: 2,
            labelXOffset: '${getOffset}',
            // "${labelX}",
            labelYOffset: '${getOffset}',
            //"${labelY}",
            labelSelect: true,
            labelOutlineColor: 'white',
            labelOutlineWidth: 3,
            strokeColor: '${getFillColor}',
            strokeOpacity: 0.8,
            strokeWidth: 3,
            fillColor: '${getFillColor}',
            fillOpacity: 0.5,
            pointRadius: 10,
            externalGraphic: 'data/tchernobyl.png'
        }, {
            context: {
                getFillColor: function(feature) {

                    return feature.attributes.name ==
                        'Border 30 km exclusion zone' ? '#b43278' : '#d20014';
                },
                getOffset: function(feature) {
                    return -0.8 * feature.attributes.offset;
                }
            }
        })
    });

    var kmlLayer = new OpenLayers.Layer.Vector(name, {
        styleMap: styleMap,
        projection: _map.projection,
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: path,
            format: new OpenLayers.Format.KML({
                extractStyles: false,
                extractAttributes: true,
                externalProjection: new OpenLayers.Projection('EPSG:4326'),
                internalProjection: _map.projection,
                kmlns: 'http://www.opengis.net/kml/2.2'
            })
        })
    });

    return kmlLayer;
}
