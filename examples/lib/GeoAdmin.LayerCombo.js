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