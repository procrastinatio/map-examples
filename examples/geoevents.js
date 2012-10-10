var map;
var strategy;
var geoevents;
var popup;

OpenLayers.Format.GeoEvent = OpenLayers.Class(OpenLayers.Format, {
    wgs84: new OpenLayers.Projection("EPSG:4326"),
    lv03: new OpenLayers.Projection("EPSG:21781"),

    read: function(obj) {
        var features = [];
        var geoevents = obj
        var x,
        y,
        point,
        feature;

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
                pix = Math.min(feature.attributes.count, 15) + 15;
            }
            return pix;
        }
    };
    var defaultStyleConfig = {
        pointRadius: "${radius}",
        label: "${count}",
        count: "${count}",
        fontWeight: "bold",
        fontColor: "black",
        fontSize: "${radius}px",
        labelAlign: "cm",
        fontFamily: "Arial",
        labelOutlineColor: "white",
        labelOutlineWidth: 3,
        fillColor: "#ffeeee",
        fillOpacity: 0.8,
        strokeColor: "#cc6633",
        strokeWidth: "${width}",
        strokeOpacity: 0.8
    };

    var inClusterFilter = new OpenLayers.Filter.Comparison({
        type: OpenLayers.Filter.Comparison.GREATER_THAN,
        property: "count",
        value: 1,
        });

    var clusteredRule = new OpenLayers.Rule({
        filter: inClusterFilter,
        symbolizer: {
            externalGraphic: "images/m1.png",
            }

    });

    var defaultStyle = new OpenLayers.Style(defaultStyleConfig, {
        context: context
    });

    var defaulRule = new OpenLayers.Rule({
        // apply this rule if no others apply
        elseFilter: true,
        symbolizer: {
            externalGraphic: "images/eg.png",
            graphicWidth: 26,
            graphicHeight: 45,
            graphicYOffset: -16, // shift graphic up 28 pixels
        }
    })

    defaultStyle.addRules([clusteredRule, defaulRule]);

    var temporaryStyle = new OpenLayers.Style(
        OpenLayers.Util.applyDefaults({
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

    map.addLayer(geoevents);

    geoevents.addFeatures(features);

    var highlightCtrl = new OpenLayers.Control.SelectFeature(geoevents, {
        hover: true,
        highlightOnly: true,
        renderIntent: "temporary",
        eventListeners: {
            featurehighlighted: function(evt) {
                var attributes = evt.feature.attributes;

                if (attributes.count > 1)
                    return false;

                var msg = '';
                for (var prop in attributes) {
                    if (attributes.hasOwnProperty(prop))
                        msg += OpenLayers.String.format("<b>${key}</b>=${value}<br />", {
                        'key': prop,
                        'value': attributes[prop]
                        });
                }
                document.getElementById("desc").innerHTML = msg;
                if (typeof popup != 'undefined') {
                    popup.destroy();
                }
                popup = new OpenLayers.Popup("marker_tooltip", 
                            evt.feature.geometry.getBounds().getCenterLonLat(), 
                            new OpenLayers.Size(200, 75), 
                            "<h5>" + attributes.post_title + "</h5>" + attributes.weitere_infos, 
                            false);
                popup.panMapIfOutOfView = true;
                popup.autosize = true;
                map.addPopup(popup);
                popup.show();
            },
            featureunhighlighted: function() {
                document.getElementById("desc").innerHTML = "";
                if (popup) {
                    popup.hide();
                }
            }
        }
    });

    var selectCtrl = new OpenLayers.Control.SelectFeature(geoevents, {
        clickout: true,
        eventListeners: {
            featurehighlighted: function(evt) {
                if (!evt.feature.cluster) {
                    window.location.href = evt.feature.attributes.post_permalink;
                } else {
                    map.panTo(evt.feature.geometry.getBounds().getCenterLonLat());
                    var zoom = map.getZoom();
                    if (zoom < map.resolutions.length)
                        map.zoomTo(zoom + 1);
                }
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

    map.setCenter([671550, 182300]);

}