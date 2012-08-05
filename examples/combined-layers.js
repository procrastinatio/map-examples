var api, map, intervalId = null;

if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}

/* Naive way to configure new layer */
var layers = {
    "org.procrastinatio.combined-background": {
        name: OpenLayers.i18n("org.procrastinatio.combined-background"),
        layertype: 'aggregate',
        subLayersName: ['org.procrastinatio.cadastralwebmap-farbe', 'org.procrastinatio.tml3d-hintergrund-karte'],
        queryable: true,
        type: "point"
    },
    "org.procrastinatio.cadastralwebmap-farbe": {
        name: OpenLayers.i18n("ch.kantone.cadastralwebmap-farbe"),
        layer: 'ch.kantone.cadastralwebmap-farbe',
        layername: 'ch.kantone.cadastralwebmap-farbe',
        layertype: 'wmts',
        timestamp: '20120601',
        type: "raster",
        format: "image/png",
        datenherr: "ch.kanton.av",
        queryable: false,
        minScale: 25001,
        maxScale: 1,
        serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0.25, 0.1]
        },
    "org.procrastinatio.tml3d-hintergrund-karte": {
        name: OpenLayers.i18n("ch.swisstopo.tml3d-hintergrund-karte"),
        layer: 'ch.swisstopo.swisstlm3d-karte',
        layername: 'ch.swisstopo.tml3d-hintergrund-karte',
        layertype: 'wmts',
        isBgLayer: false,
        timestamp: '20120401',
        type: "raster",
        maxScale: 25001,
        format: "image/png",
        datenherr: "ch.swisstopo"
    }
};

function init() {
    OpenLayers.Util.extend(OpenLayers.Lang.fr, {
       "org.procrastinatio.combined-background": "La carte de mes rêves"
    });
    OpenLayers.Lang.setCode('fr');
    GeoAdmin.layers.init();

    /* Better way to configure layers: only add the missing properties */
    var layers = {
        "org.procrastinatio.combined-background": {
            name: OpenLayers.i18n("org.procrastinatio.combined-background"),
            layertype: 'aggregate',
            subLayersName: ['org.procrastinatio.cadastralwebmap-farbe', 'org.procrastinatio.tml3d-hintergrund-karte'],
            queryable: true,
            type: "point"
        },
        "org.procrastinatio.cadastralwebmap-farbe": OpenLayers.Util.extend(GeoAdmin.layers.layers['ch.kantone.cadastralwebmap-farbe'], {
            minScale: 20001,
            maxScale: 1
        }),
        "org.procrastinatio.tml3d-hintergrund-karte": OpenLayers.Util.extend(GeoAdmin.layers.layers['ch.swisstopo.tml3d-hintergrund-karte'], {
            maxScale: 20001
        })
    };

    OpenLayers.Util.extend(GeoAdmin.layers.layers, layers);

    map = new GeoAdmin.Map("map");

    map.aerial.opacity = 0;
    map.addLayerByName("org.procrastinatio.combined-background");

    map.zoomToExtent(new OpenLayers.Bounds.fromString("599937.75,199266.33333587,601312.75,200141.33333587"));

    zoomInAndOut();

}

function zoomInAndOut() {
    var checked = OpenLayers.Util.getElement('zoominout').checked;
    if (checked) {
        intervalId = setInterval(function() {
            var zoom = map.getZoom();
            if (zoom == 8) {
                map.zoomIn();
                OpenLayers.Util.getElement('displayed-layer').innerHTML = OpenLayers.i18n('ch.kantone.cadastralwebmap-farbe');
            } else if (zoom == 9) {
                map.zoomOut();
                OpenLayers.Util.getElement('displayed-layer').innerHTML = OpenLayers.i18n('ch.swisstopo.tml3d-hintergrund-karte');
            } else {
	      map.zoomTo(8);
	    }
        }, 3000);
    } else {
      clearInterval(intervalId);
    }
}