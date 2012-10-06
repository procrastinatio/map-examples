var map;
var strategy;
var geoevents;

OpenLayers.Format.GeoEvent = OpenLayers.Class(OpenLayers.Format, {
    wgs84: new OpenLayers.Projection("EPSG:4326"),
    lv03: new OpenLayers.Projection("EPSG:21781"),

    read: function(obj) {
        var features = [];
        var geoevents = obj
        var x,y,point,feature;

        for (var key in geoevents) {
            if (geoevents.hasOwnProperty(key)) {
                var geoevent = geoevents[key];
                var point = new OpenLayers.Geometry.Point(geoevent.treffpunkt_y, geoevent.treffpunkt_x);
                var feature = new OpenLayers.Feature.Vector(point, geoevent);
                feature.geometry.transform(this.wgs84, this.lv03);
                features.push(feature);
            }

        }
        return features;
    }

});

function init() {

    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    var format = new OpenLayers.Format.GeoEvent();

    // data is global variable
    var features = format.read(data[0]);

    var context = {
        width: function(feature) {
            return (feature.cluster) ? 3: 2;
        },
        count: function(feature) {
            var count = 1;
            if (feature.cluster) {
                count = feature.attributes.count;
            }
            return count;
        },
        radius: function(feature) {
            var pix = 10;

            if (feature.cluster) {
                pix = Math.min(feature.attributes.count, 15) + 5;
            }
            return pix;
        }
    };
    var defaultStyleConfig = {
        pointRadius: "${radius}",
        label: "${count}",
        fontWeight: "bold",
        fontColor: "black",
        fontSize: "${radius}px",
        labelAlign: "cm",
        fontFamily: "Arial",
        fillColor: "#ffeeee",
        fillOpacity: 0.8,
        strokeColor: "#cc6633",
        strokeWidth: "${width}",
        strokeOpacity: 0.8
    };
    var defaultStyle = new OpenLayers.Style(defaultStyleConfig, {
        context: context
    });

    var temporaryStyle = new OpenLayers.Style(OpenLayers.Util.applyDefaults({
        fillColor: "red",
        fillOpacity: 0.8,
        strokeColor: "#ff6666",

        strokeOpacity: 0.8
    }, defaultStyleConfig), {
        context: context
    });

    var strategy = new OpenLayers.Strategy.Cluster({
        distance: 100,
        threshold: 2
    });

    var geoevents = new OpenLayers.Layer.Vector("GeoEvents", {
        strategies: [strategy],
        styleMap: new OpenLayers.StyleMap({
            "default": defaultStyle,
            "temporary": temporaryStyle
        })
    });

    geoevents.addFeatures(features);

    map.addLayer(geoevents);

    geoevents.removeFeatures(geoevents.features);
    geoevents.addFeatures(features);

    var highlightCtrl = new OpenLayers.Control.SelectFeature(geoevents, {
        hover: true,
        highlightOnly: true,
        renderIntent: "temporary",
        eventListeners: {

            featurehighlighted: function(feat) {
                var attributes = feat.feature.attributes;
                var msg = '';
                for (var prop in attributes) {
                    if (attributes.hasOwnProperty(prop))
                        msg += OpenLayers.String.format("<b>${key}</b>=${value}<br />", {
                        'key': prop,
                        'value': attributes[prop]
                        });
                }
                document.getElementById("desc").innerHTML = msg;
            },
            featureunhighlighted: function() {
                document.getElementById("desc").innerHTML = "";
            }
        }
    });

    var selectCtrl = new OpenLayers.Control.SelectFeature(geoevents, {
        clickout: true,
        eventListeners: {

            featurehighlighted: function(evt) {
                if (!evt.feature.cluster)
                window.location.href = evt.feature.attributes.post_permalink;
            }
        }
    });
    map.addControl(highlightCtrl);
    map.addControl(selectCtrl);

    highlightCtrl.activate();
    selectCtrl.activate();

    map.switchComplementaryLayer("voidLayer", {
        opacity: 1
    });
    map.addLayerByName("ch.swisstopo.swissalti3d-reliefschattierung", {
        opacity: 1.0
    });

    map.addLayerByName("ch.swisstopo.geologie-tektonische_karte", {
        opacity: 0.5
    });

    map.setCenter([671550,182300]);

}