var api;

function init() {
    api = new GeoAdmin.API();
    api.createMap({
        div: "map"
    });
    api.map.fractionalZoom = true;
    api.map.events.register("moveend", null, displayZoom);
    api.map.zoomTo(2);
}

function displayZoom() {
    document.getElementById("zoom").innerHTML = api.map.zoom.toFixed(4);
}


