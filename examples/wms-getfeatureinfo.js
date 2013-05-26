var map, featureInfo;

function init() {

    OpenLayers.Util.extend(OpenLayers.Lang.fr, {
        'Feature Info': 'Informations détaillées'
    });
    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {
        opacity: 1
    });

    OpenLayers.ProxyHost = (window.location.host == "localhost") ? "/cgi-bin/proxy.cgi?url=" : "/cgi-bin/proxy";;

    var wms = new OpenLayers.Layer.WMS("vd",
        GeoAdmin.protocol + "//wms.procrastinatio.org", {
        srs: 'EPSG:21781',
        layers: 'bln',
        format: 'image/png'
    }, {
        singleTile: true,
        opacity: 0.7,
        isBaseLayer: false
    });

    featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
        url: GeoAdmin.protocol + '//wms.procrastinatio.org',
        infoFormat: 'application/vnd.ogc.gml',
        vendorParams: {
            "lang": OpenLayers.Lang.getCode() || 'de'
        }
    });

    function formatInfo(features) {
        var html = '<table class="getfeatureinfo">';
        if (features && features.length) {
            for (var i = 0, len = features.length; i < len; i++) {

                var feature = features[i];

                var attributes = feature.attributes;
                html += '<tr><th colspan=2" class="layerTitle">' + OpenLayers.i18n(feature.type) + "</th><th></th><tr>";
                for (var k in attributes) {
                    html += '<tr><th>' + k.replace(/_/gi, ' ') + '</th><td>' + attributes[k] + '</td></tr>';
                }
            }
        }
        return html += '</table>';
    }

    featureInfo.events.on({
        getfeatureinfo: function (e) {
            var features = this.format.read(e.text);

            if (features && features.length > 0) {
                if (this.popup) this.popup.destroy();
                this.map.vector.addFeatures(features);
                this.popup =
                    new GeoExt.Popup({
                    title: OpenLayers.i18n("Feature Info"),
                    width: 300,
                    height: 150,
                    autoScroll: true,
                    maximizable: true,
                    map: map,
                    location: new OpenLayers.Geometry.Point(this.map.getLonLatFromPixel(e.xy).lon, this.map.getLonLatFromPixel(e.xy).lat),
                    html: formatInfo(features)
                });
                this.popup.on({
                    'close': function () {
                        this.map.vector.removeAllFeatures()
                    }
                });
                this.popup.show();
                // reset the cursor
            };
            OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
        }
    });

    map.addLayers([wms]);

    map.addControl(featureInfo);
    featureInfo.activate();

}