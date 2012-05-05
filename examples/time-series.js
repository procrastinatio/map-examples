var maps = []
var moving = false;
var movestarted = false;
var markersLayer = [];
var marker = [];

function init() {

    var map1 = new GeoAdmin.Map("map1", {
        doZoomToMaxExtent: true
    });
    map1.switchComplementaryLayer('voidLayer', {
        opacity: 0
    });
    map1.addLayerByName("ch.swisstopo.hiks-dufour");
    maps.push(map1);

    var map2 = new GeoAdmin.Map("map2", {
        doZoomToMaxExtent: true
    });
    map2.switchComplementaryLayer('voidLayer', {
        opacity: 1
    });
    map2.addLayerByName("ch.swisstopo.hiks-siegfried");

    maps.push(map2);

    var map3 = new GeoAdmin.Map("map3", {
        doZoomToMaxExtent: true
    });
    map3.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe', {
        opacity: 100
    });
    maps.push(map3);

    for (var n = 0; n < maps.length; n++) {

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
    marker[n] = new OpenLayers.Marker(
         maps[n].getCenter(), 
         new OpenLayers.Icon('./images/cross.png', new OpenLayers.Size(20, 20), new OpenLayers.Pixel( - 10, -10))
    );
    markersLayer[n].setVisibility(false);
    markersLayer[n].addMarker(marker[n]);
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
            marker[n].moveTo(maps[this.toFixed()].getLayerPxFromViewPortPx(evt.xy));
        }
    };

    return (false);
}

function mouseOver(evt) {
    if (!movestarted) {
        for (var n = 0; n < maps.length; n++) {
            if (n != this.toFixed()) {
                markersLayer[n].setVisibility(true);
            }
        };

    }
    return (false);
}

function mouseOut(evt) {
    for (var n = 0; n < maps.length; n++) {
        markersLayer[n].setVisibility(false);
    }

    return (false);
}