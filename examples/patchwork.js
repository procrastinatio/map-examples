if (typeof Object.keys != 'function') {

    Object.prototype.keys = function(obj) {
        var keys = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                keys.push(key);
        }
        return keys;
    }
}

var lyr;

GeoAdmin.PatchWork = OpenLayers.Class(OpenLayers.Layer.WMTS, {

    patchwork: [],

    layers: [],

    initialize: function(options) {

        var defaults = {
            name: 'Patchwork',
            layer: 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill',
            layername: 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill',
            version: "1.0.0",
            requestEncoding: "REST",
            url: ['http://wmts0.geo.admin.ch/', 'http://wmts1.geo.admin.ch/', 'http://wmts2.geo.admin.ch/', 'http://wmts3.geo.admin.ch/', 'http://wmts4.geo.admin.ch/'],
            style: "default",
            matrixSet: "21781",
            formatSuffix: 'jpeg',
            dimensions: ['TIME'],
            params: {
                'time': 20111206
                // You need this, 'default' won't work
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

        var config = OpenLayers.Util.extend(options, defaults);

        this.layers = config.patchwork.slice(0) || Object.keys(GeoAdmin.layers.layers);

        OpenLayers.Layer.WMTS.prototype.initialize.apply(this, [config]);


    },

    getURL: function(bounds) {
        bounds = this.adjustBounds(bounds);

        // Patchwork stuff
        if (this.patchwork.length < 1)
            this.patchwork = this.layers.slice(0).sort(function() {
            return 0.5 - Math.random()
            });
        this.layer = this.patchwork.pop();

        var config = GeoAdmin.layers.layers[this.layer];
        this.params = {
            "TIME": config.timestamp[0]
            }
        this.formatSuffix = config.format && config.format.split('/')[1].toLowerCase();
        this.opacity = config.opacity ? config.opacity: 1.0;

        var url = "";
        if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {

            var center = bounds.getCenterLonLat();
            var info = this.getTileInfo(center);
            var matrixId = this.matrix.identifier;
            var dimensions = this.dimensions,
            params;

            if (OpenLayers.Util.isArray(this.url)) {
                url = this.selectUrl([this.version, this.style, this.matrixSet, this.matrix.identifier, info.row, info.col].join(","), this.url);
            } else {
                url = this.url;
            }

            if (this.requestEncoding.toUpperCase() === "REST") {

                params = this.params;
                if (url.indexOf("{") !== -1) {
                    var template = url.replace(/\{/g, "${");
                    var context = {
                        // spec does not make clear if capital S or not
                        style: this.style,
                        Style: this.style,
                        TileMatrixSet: this.matrixSet,
                        TileMatrix: this.matrix.identifier,
                        TileRow: info.row,
                        TileCol: info.col
                    };
                    if (dimensions) {
                        var dimension,
                        i;
                        for (i = dimensions.length - 1; i >= 0;--i) {
                            dimension = dimensions[i];
                            context[dimension] = params[dimension.toUpperCase()];
                        }
                    }
                    url = OpenLayers.String.format(template, context);
                } else {
                    // include 'version', 'layer' and 'style' in tile resource url
                    var path = this.version + "/" + this.layer + "/" + this.style + "/";

                    // append optional dimension path elements
                    if (dimensions) {
                        for (var i = 0; i < dimensions.length; i++) {
                            if (params[dimensions[i]]) {
                                path = path + params[dimensions[i]] + "/";
                            }
                        }
                    }

                    // append other required path elements
                    path = path + this.matrixSet + "/" + this.matrix.identifier + "/" + info.row + "/" + info.col + "." + this.formatSuffix;

                    if (!url.match(/\/$/)) {
                        url = url + "/";
                    }
                    url = url + path;
                }
            }
        }
        return url;
    },

    CLASS_NAME: "GeoAdmin.PatchWork"
});

var map, layer;
function init() {
     map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
       map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {
        opacity: 1
    });

    map.zoomToExtent([544800, 158150, 757300, 245650]);

    // Some and colourfull layers for the patchwrk
    var patchwork = [
        'ch.swisstopo.geologie-geologische_karte', 
        'ch.swisstopo.geologie-geotechnik-gk500-genese', 
        'ch.swisstopo.geologie-tektonische_karte', 
        'ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung', 
        'ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen', 
        'ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet', 
        'ch.swisstopo.geologie-geophysik-geothermie', 
        'ch.swisstopo.geologie-geophysik-totalintensitaet', 
        //'ch.swisstopo.geologie-geodaesie-bouguer_anomalien',
        'ch.blw.klimaeignung-kulturland', 
        'ch.bazl.luftfahrtkarten-icao'
     ];

    layer = new GeoAdmin.PatchWork({
        patchwork: patchwork
    });

    map.addLayer(layer);

}