var map;

function init() {

    map = new GeoAdmin.Map("map");
    map.zoomToExtent([600000, 200000, 610000, 210000]);

    var vector = new OpenLayers.Layer.Vector("LFP2", {
        resolutions: [50, 20, 10, 5, 2.5, 2, 1, 0.5, 0.25, 0.1],
        strategies: [new OpenLayers.Strategy.BBOX()],
        protocol: new OpenLayers.Protocol.Script({
            callbackKey: 'callback',
            url: "https://procrastinatio.iriscouch.com:6984/lfp2/_design/gc-utils/_spatial/_list/geojson/geoms",

        }),
        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                fillColor: "#ffcc00",
                fillOpacity: 0.7,
                strokeColor: "#ff9900",
                strokeWidth: 2,
                pointRadius: 5
            }),
            "temporary": new OpenLayers.Style({
                fillColor: "#ff9900",
                fillOpacity: 0.7,
                strokeColor: "#ffcc00",
                strokeOpacity: 1.0
            })
        })
    });

    map.addLayer(vector);

    vector.events.register("beforefeaturesadded", null, function(evt) {
        document.getElementById("output").innerHTML = "Features added: " + evt.features.length + "\n";
    });

    map.events.register("zoomend", null, function(evt) {
        if (!vector.inRange)
            document.getElementById("output").innerHTML = "Layer '" + vector.name + "' not in range. Please, zoom in";
    });

    var highlightCtrl = new OpenLayers.Control.SelectFeature(vector, {
        hover: true,
        highlightOnly: false,
        renderIntent: "temporary",
        });
    map.addControl(highlightCtrl);
    highlightCtrl.activate();
}