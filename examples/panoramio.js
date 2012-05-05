var map, photos;

function init() {

    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
        opacity: 100
    });

    var style = new OpenLayers.Style({
        externalGraphic: "${img_url}",
        pointRadius: 30
    });

    photos = new OpenLayers.Layer.Vector("Photos", {
        projection: "EPSG:4326",
        strategies: [new OpenLayers.Strategy.BBOX({
            resFactor: 1
        })],
        format: new OpenLayers.Format.Panoramio(),
        protocol: new OpenLayers.Protocol.Script({
            url: "http://www.panoramio.com/map/get_panoramas",
            params: {
                order: 'popularity',
                set: 'full',
                from: 0,
                to: 50,
                size: 'thumbnail'

            },
	    filterToParams: function(filter, params) {
                    // example to demonstrate BBOX serialization
                    if (filter.type === OpenLayers.Filter.Spatial.BBOX) {
		        var bounds = filter.value;
			params.minx = bounds.left;
			params.miny = bounds.bottom;
			params.maxx = bounds.right;
			params.maxy = bounds.top;
                        params.bbox = filter.value.toArray();
                    }
                    return params;
                },
            callbackKey: 'callback',
	    format: new OpenLayers.Format.Panoramio()
            }),
        styleMap: new OpenLayers.StyleMap(style)
    });

    map.addLayer(photos);

}