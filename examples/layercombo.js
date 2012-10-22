var map;

function init() {
    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });

    if (map.aerial) {
        map.aerial.setVisibility(false);
    };
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
        opacity: 1.0
    });
    new GeoAdmin.LayerCombo('selectCombo', {
        map: map,
        selected: 'ch.swisstopo.geologie-tektonische_karte'
    });

}