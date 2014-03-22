var api;

GOOGLE_KEY = 'AIzaSyCwy6vIEraIwQv8Tx6g1zMTPsPe8HLdr-M';

GeoAdmin.API.prototype.addFusionTable = function (options, callback) {

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

    var jsonp_url = "https://www.googleapis.com/fusiontables/v1/query";

    var gft = new OpenLayers.Format.GoogleFusion({
        ignoreExtraDims: true,
        'internalProjection': this.map.projection,
        'externalProjection': new OpenLayers.Projection("EPSG:4326")
    });

    var req = new OpenLayers.Protocol.Script({scope: this});

   req.createRequest(jsonp_url, {
            sql: options.sql,
            typed: true, // for JSON-like type
            key: GOOGLE_KEY

        }, handleResponse);
   function handleResponse(json) {
    
            var features = gft.read(json);
            var vector = new OpenLayers.Layer.Vector("Google Fusion Table", {
                styleMap: stylemap
            });
            vector.addFeatures(features, {
                silent: false
            });
           callback( vector);
  
           
            var highlightCtrl = new OpenLayers.Control.SelectFeature(vector, {
                hover: true,
                highlightOnly: false,
                renderIntent: "temporary",
                eventListeners: {
                    featurehighlighted: function (feat) {
                        var attributes = feat.feature.attributes;
                        var msg = '<table>';
                        for (var prop in attributes) {
                            if (attributes.hasOwnProperty(prop))
                            msg += OpenLayers.String.format("<tr><th>${key}</th><td>${value}</td></tr>", {
                                'key': prop,
                                'value': attributes[prop]
                            });
                        }
                        msg += '</table>';
                        this.popup = new GeoExt.Popup({
                            map: this.map,
                            title: attributes.bln_obj,
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
            vector.map.addControl(highlightCtrl);
            highlightCtrl.activate(); 
        }; 
};



function init() {
    api = new GeoAdmin.API();
    api.createMap({
        div: "map"
    });


    api.addFusionTable({
        sql: 'select geometry, bln_obj, bln_name, bln_gf, bln_version from 1rwbKyIdUOV6uD11EhIPzQv4flXqhqtetBip7nRM where bln_gf > 15000',
        stylemap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                strokeColor: "#333366",
                strokeWidth: 2,
                fillColor: 'blue',
                fillOpacity: 0.4
            })
        })
    }, function(lyr) {api.map.addLayer(lyr);});
   
};

