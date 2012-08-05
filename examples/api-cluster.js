var api, map, template;

function init() {

    api = new GeoAdmin.API();
    api.createMap({
        div: "map",
        bgLayer: 'ch.swisstopo.pixelkarte-farbe'
    });
    OpenLayers.ProxyHost = (window.location.host == "localhost") ? "/cgi-bin/proxy.cgi?url=": "/cgi-bin/proxy.cgi?url=";

    var style = new OpenLayers.Style({
        pointRadius: "${radius}",
        fillColor: "#333399",
        fillOpacity: 0.8,
        strokeColor: "#000066",
        strokeWidth: 2,
        strokeOpacity: 0.8
    }, {
        context: {
            radius: function(feature) {
                return Math.min(feature.attributes.count, 7) + 3;
            }
        }
    });

    var photos = new OpenLayers.Layer.Vector("Photos", {
        strategies: [new OpenLayers.Strategy.Fixed(), new OpenLayers.Strategy.Cluster()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "http://labs.metacarta.com/flickrbrowse/flickr.py/flickr",
            params: {
                format: "WFS",
                sort: "interestingness-desc",
                service: "WFS",
                request: "GetFeatures",
                srs: "EPSG:4326",
                maxfeatures: 150,
                bbox: [7, 43, 12, 48]
             },
            format: new OpenLayers.Format.GML()
            }),
        styleMap: new OpenLayers.StyleMap({
            "default": style,
            "select": {
                fillColor: "#8aeeef",
                strokeColor: "#32a8a9"
            }
        }),
        projection: new OpenLayers.Projection("EPSG:4326")
        });

    api.map.addLayer(photos);

    var select = new OpenLayers.Control.SelectFeature(photos, {
        hover: true
    });
    api.map.addControl(select);
    select.activate();
    photos.events.on({
        "featureselected": display
    });

    // template setup
    template = new jugl.Template("template");
}

function display(event) {
    // clear previous photo list and create new one
    $("photos").innerHTML = "";
    var node = template.process({
        context: {
            features: event.feature.cluster
        },
        clone: true,
        parent: $("photos")
        });
    // set up forward/rewind
    var forward = Animator.apply($("list"), ["start", "end"], {
        duration: 1500
    });
    $("scroll-end").onmouseover = function() {
        forward.seekTo(1)
        };
    $("scroll-end").onmouseout = function() {
        forward.seekTo(forward.state)
        };
    $("scroll-start").onmouseover = function() {
        forward.seekTo(0)
        };
    $("scroll-start").onmouseout = function() {
        forward.seekTo(forward.state)
        };
    // set up photo zoom
    for (var i = 0; i < event.feature.cluster.length;++i) {
        listen($("link-" + i), Animator.apply($("photo-" + i), ["thumb", "big"]));
    }
}

function listen(el, anim) {
    el.onmouseover = function() {
        anim.seekTo(1)
        };
    el.onmouseout = function() {
        anim.seekTo(0)
        };
}
