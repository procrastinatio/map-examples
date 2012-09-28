var maps = [];
var moving = false;
var movestarted = false;
var markersLayer = [];
var markers = [];

if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}

GeoAdmin.LayerCombo = OpenLayers.Class({
    map: null,
    div: null,

    initialize: function(div, options) {
        if (GeoAdmin.webServicesUrl != null) {
            this.url = GeoAdmin.webServicesUrl + "/layers";
        }
        this.div = OpenLayers.Util.getElement(div);
        this.map = options.map;

        this.combo = document.createElement('select');

        this.combo.map = this.map;
        this.selected = options.selected;
        var previous = this.map.addLayerByName(this.selected);

        this.map.previous = previous;

        this.getLayers();
    },
    changeLayer: function(event) {
        var layerId = event.srcElement[this.selectedIndex].value;
        var map = event.srcElement.map;
        if (map.previous) {
            if (map.previous.CLASS_NAME === 'OpenLayers.Layer.Aggregate') {
                map.previous.destroy();
            } else {
                map.removeLayer(map.previous);
            }
        };
        map.previous = map.addLayerByName(layerId);
        var markersLayer = map.getLayersByName('Marker');
        for (var n in markersLayer) {
            markersLayer[n].setZIndex(5001);
            map.setLayerIndex(markersLayer[n], map.layers.length);
        }
    },

    populateCombo: function(request) {
        var layers = request.data.results;
        this.layers = layers.sort(function(a, b) {
            return (a.kurzbezeichnung < b.kurzbezeichnung) ? -1: (a.kurzbezeichnung > b.kurzbezeichnung) ? 1: 0;
        });

        for (var i = 0; i < layers.length; i++) {
            var opt = document.createElement('option');
            opt.value = layers[i].bod_layer_id;
            opt.text = layers[i].kurzbezeichnung;
            if (opt.value == this.selected) {
                opt.selected = true;
            };
            this.combo.appendChild(opt);
        }
        this.combo.addEventListener('change', this.changeLayer, false);

        this.div.appendChild(this.combo);

    },
    getLayers: function() {

        var request = new OpenLayers.Protocol.Script({
            url: this.url,
            callback: this.populateCombo,
            callbackKey: 'cb',
            format: new OpenLayers.Format.JSON({
                nativeJSON: false
            }),
            scope: this
        });

        request.read({
            params: {
                properties: "bod_layer_id,kurzbezeichnung",
                lang: OpenLayers.Lang.getCode() || 'de'
            }
        });
    }
});

function init() {
    // start layers for the comboboxes
    var startLayers = ['ch.swisstopo.geologie-geologische_karte', 'ch.swisstopo.geologie-geotechnik-gk500-genese', 'ch.swisstopo.geologie-tektonische_karte'];

    for (var n = 0; n < 3; n++) {
        maps[n] = new GeoAdmin.Map("map" + String(n), {
            doZoomToMaxExtent: true
        });
        if (maps[n].aerial) {
            maps[n].aerial.setVisibility(false);
        };
        maps[n].switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
            opacity: 1.0
        });
        new GeoAdmin.LayerCombo('selectCombo' + String(n), {
            map: maps[n],
            selected: startLayers[n]
            });
        maps[n].events.register('movestart', n, moveStart);
        maps[n].events.register('moveend', n, moveEnd);
        maps[n].events.register('mousemove', n, mouseMove);
        maps[n].events.register('mouseover', n, mouseOver);
        maps[n].events.register('mouseout', n, mouseOut);
        initMarker(n);

    }

}

function initMarker(n) {
    markersLayer[n] = new OpenLayers.Layer.Markers("Marker");
    maps[n].addLayer(markersLayer[n]);

    markers[n] = new OpenLayers.Marker(maps[n].getCenter(), new OpenLayers.Icon('./images/cross.png', new OpenLayers.Size(20, 20), new OpenLayers.Pixel( - 10, -10)));
    markersLayer[n].setVisibility(false);

    markersLayer[n].addMarker(markers[n]);
    markersLayer[n].setZIndex(5001);
}

function moveStart() {

    for (var n = 0; n < maps.length; n++) {
        markersLayer[n].setVisibility(false);
    }

    return (false);
}

function moveEnd() {
    if (moving) {
        return;
    }
    moving = true;
    var z = maps[this.toFixed()].getZoom();

    for (var n = 0; n < maps.length; n++) {
        if (n != this.toFixed()) {
            maps[n].setCenter(maps[this.toFixed()].getCenter().clone().transform(maps[this.toFixed()].getProjectionObject(), maps[n].getProjectionObject()), z);
            markersLayer[n].setVisibility(true);
        }
    };
    moving = false;
    movestarted = false;

    return (false);
}

function mouseMove(evt) {

    for (var n = 0; n < maps.length; n++) {
        if (n != this.toFixed()) {
            markers[n].moveTo(maps[this.toFixed()].getLayerPxFromViewPortPx(evt.xy));
        }
    }
    return (false);
}

function mouseOver(evt) {
    if (!movestarted) {
        for (var n = 0; n < maps.length; n++) {
            if (n != this.toFixed()) {
                markersLayer[n].setVisibility(true);
            }
        }
    }
    return (false);
}

function mouseOut(evt) {
    for (var n = 0; n < maps.length; n++) {
        markersLayer[n].setVisibility(false);
    }
    return (false);
}