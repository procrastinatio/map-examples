var map,
vector;

function init() {

    // Using an old definition
    Proj4js.defs["EPSG:9814"] = "+title=CH1903 / LV03 +proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs";

    OpenLayers.Util.extend(OpenLayers.Lang.en, {
        'sed.url': 'http://www.seismo.ethz.ch/index_EN',
        'sed': 'http://www.seismo.ethz.ch/index_EN'

    });

    OpenLayers.Renderer.Heatmap.prototype.drawPoint = function(geometry, style, featureId) {
        var pt = this.getLocalXY(geometry),
        p0 = pt[0],
        p1 = pt[1];
        if (style.weight && !isNaN(p0) && !isNaN(p1)) {
            var gradient = this.canvas.createRadialGradient(p0, p1, 0, p0, p1, style.pointRadius);
            gradient.addColorStop(0, 'rgba(255, 255, 255,' + String(style.weight) + ')');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            this.canvas.fillStyle = gradient;
            this.canvas.fillRect(p0 - style.pointRadius, p1 - style.pointRadius, style.pointRadius * 2, style.pointRadius * 2);
            this.canvas.globalAlpha = 0.5;

        }
    };

    vector = new OpenLayers.Layer.Vector("heatmap", {
        // use the heatmap renderer instead of the default one (SVG, VML or Canvas)
        renderers: ['Heatmap'],

        protocol: new OpenLayers.Protocol.HTTP({
            url: "http://hitseddb.ethz.ch/cgi-bin/mapserv?MAP=/var/www/mapfile/sed/ch.map&",

            params: {

                typename: "eqch90d",
                version: "1.0.0",
                service: "WFS",
                request: "GetFeature",
                maxfeatures: 150

            },
            format: new OpenLayers.Format.GML()
            }),
        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                pointRadius: 20,
                weight: 1
                //"${weight}"
                }, {
                context: {
                    // the 'weight' of the point (between 0.0 and 1.0), used by the heatmap renderer
                    weight: function(f) {
                        return 1
                        //Math.min(Math.max((f.attributes.duration || 0) / 432, 0.25), 1.0);
                        }
                }
            })
            }),
        opacity: 0.7,
        strategies: [new OpenLayers.Strategy.Fixed()],
        eventListeners: {
            featuresadded: function(evt) {
                //this.map.zoomToExtent(this.getDataExtent());
                }
        }
    });
    map = new GeoAdmin.Map("map", {
        resolutions: [1000, 650.0, 500.0, 250.0, 100.0]
        });
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
        opacity: 1.0
    });

    OpenLayers.ProxyHost = (window.location.host == "localhost") ? "/cgi-bin/proxy.cgi?url=": "/cgi-bin/proxy.cgi?url=";

    var wms = new OpenLayers.Layer.WMS("earthqake", "http://hitseddb.ethz.ch/cgi-bin/mapserv?MAP=/var/www/mapfile/sed/ch.map&", {
        layers: "eqch90d,timestamp,sedlogo",
        srs: "EPSG:9814",
        format: "aggpng24",
        transparent: "true"
    }, {
        projection: new OpenLayers.Projection("EPSG:9814"),
        singleTile: true,
        attribution: "Swiss Seismological Service"
    });

    map.addLayers([wms, vector]);
    vector.div.style.opacity = 0.7;
    map.zoomToExtent([413767.3782955, -3605.391845, 923767.3782955, 346394.608155]);

}
