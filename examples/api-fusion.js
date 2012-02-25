var api;

GeoAdmin.API.prototype.addFusionTable = function (options) {

    var stylemap = options.stylemap || new OpenLayers.StyleMap({

        "default": new OpenLayers.Style({
            pointRadius: 4,
            fillColor: "red",
            fillOpacity: 0.2,
            strokeColor: "red",
            strokeWidth: 2
        }),
        "select": new OpenLayers.Style({
            pointRadius: 4,
            fillColor: "blue",
            fillOpacity: 0.2,
            strokeColor: "blue",
            strokeWidth: 2
        })
    });

    var jsonp_url = "https://www.google.com/fusiontables/api/query";

    var gft = new OpenLayers.Format.GoogleFusion({
        ignoreExtraDims: true,
        'internalProjection': this.map.projection,
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
    });
    Ext.ux.JSONP.request(jsonp_url, {
        callbackKey: 'jsonCallback',
        params: {
            sql: options.sql
        },
        scope: this,

        callback: function (json) {

            var features = gft.read(json);
            var vector = new OpenLayers.Layer.Vector("Google Fusion Table", {
                styleMap: stylemap
            });
            vector.addFeatures(features, {
                silent: false
            });
            this.map.addLayer(vector);

            var highlightCtrl = new OpenLayers.Control.SelectFeature(vector, {
                hover: true,
                highlightOnly: false,
                renderIntent: "temporary",
                eventListeners: {
                    featurehighlighted: function (feat) {
                        var attributes = feat.feature.attributes;
                        var msg = '';
                        for (var prop in attributes) {
                            if (attributes.hasOwnProperty(prop))
                            msg += OpenLayers.String.format("<b>${key}</b>=${value}<br />", {
                                'key': prop,
                                'value': attributes[prop]
                            });
                        }
                        this.popup = new GeoExt.Popup({
                            map: this.map,
                            html: msg,
                            width: 200,
                            layer: vector,
                            location: feat.feature.geometry.bounds.getCenterLonLat()
                        });
                        this.popup.show();
                    },
                    featureunhighlighted: function () {
                        if (this.popup) {
                            this.popup.destroy();
                            this.popup = null;
                        }
                    }
                }
            });
            this.map.addControl(highlightCtrl);
            highlightCtrl.activate();
        }
    });
};



function init() {
    api = new GeoAdmin.API();
    api.createMap({
        div: "map"
    });


    api.addFusionTable({
        sql: 'select geometry, Description from 1124880 where bln_gf > 15000',
        stylemap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                strokeColor: "#333366",
                strokeWidth: 2,
                fillColor: 'blue',
                fillOpacity: 0.4
            })
        })
    });
};

