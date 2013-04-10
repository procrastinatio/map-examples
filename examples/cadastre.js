if (!GeoAdmin)  GeoAdmin = {}
GeoAdmin.CadastralInfoBox = Ext.extend(GeoAdmin.SwissSearchComboBox, {


    queryLayers: function(bbox) {

        if (GeoAdmin.webServicesUrl) {
            var url = GeoAdmin.webServicesUrl + "/feature/search";
            Ext.ux.JSONP.request(url, {
                callbackKey: "cb",
                scope: this,
                params: {
                    layers: [
                    "ch.swisstopo-vd.geometa-gemeinde",
                    "ch.swisstopo-vd.geometa-nfgeom",
                    "ch.swisstopo-vd.geometa-grundbuch", 
                    "ch.swisstopo-vd.geometa-standav", 
                    "ch.swisstopo-vd.geometa-los"].join(","),
                    lang: OpenLayers.Lang.getCode(),
                    bbox: bbox.join(","),
                    no_geom: true
                },
                callback: function(response) {
                    console.log("response", response);
                    var format = new OpenLayers.Format.GeoJSON({
                        ignoreExtraDims: true
                    });
                    var features = format.read(response);

                    var items = [];
                    for (var f in features) {
                        var feature = features[f];
                        if (feature && feature.attributes) {
                            var div = Ext.get('output');
                            div.dom.innerHTML += feature.attributes.html;
                         }
                    }
                }
            })
        }

    },
    // overload 
    recordSelected: function(combo, record, index) {

        if (!record) {
            return false;
        };

        var extent = OpenLayers.Bounds.fromArray(record.data.bbox);

        var zoom = 11;

        this.queryLayers(record.data.bbox);

        this.map.setCenter(extent.getCenterLonLat(), zoom);
        if (record.data.service === 'address' || record.data.service === 'swissnames') {
            var cross = this.createRedCross(extent.getCenterLonLat());
            this.map.vector.addFeatures([cross]);
        }
    }
});

function init() {
    OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "de");

    var map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    map.switchComplementaryLayer("ch.kantone.cadastralwebmap-farbe", {
        opacity: 1
    });
    var swisssearch = new GeoAdmin.CadastralInfoBox({
        width: 500,
        renderTo: "search",
        map: map
    });
}
