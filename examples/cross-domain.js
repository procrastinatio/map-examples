function init() {
    var api = new GeoAdmin.API();
    api.createMap({
        div: "map"
    });

    var vector = new OpenLayers.Layer.Vector("States", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.Script({
            url: "http://api.geo.admin.ch/feature/geometry",
            callbackKey: "cb",
            params: {
                layers: 'ch.swisstopo.gg25-bezirk-flaeche.fill',
                ids: '211,217,218,1827,1831'
            }
        }),
        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                fillColor: "#666699",
                fillOpacity: 0.7,
                strokeColor: "#333366",
                strokeWidth: 2
            })
            })
        });

    api.map.addLayer(vector);

};



