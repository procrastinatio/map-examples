if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

var crs;

function clearLocalStorage() {
    localStorage.clear();
}

function loadFromLocalStorage() {
    var geojson = JSON.parse(localStorage.getItem('testObject'));

    if (!geojson || geojson.type !== 'FeatureCollection')
        var geojson = data;

    return geojson;
}

function init() {
    var res = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5];

    var scale = function(zoom) {
        return 1 / res[zoom];
    },

    crs = new L.Proj.CRS('EPSG:21781', '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 ' + '+k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs', {
        resolutions: res,
        origin: [420000, 350000]
        });

    var map = new L.Map('map', {
        crs: crs,
        continuousWorld: true,
        worldCopyJump: false,
        scale: scale
    });

    map.on('mousemove', function(e) {
        var coords = document.getElementById('coords');
        var projected = crs.project(e.latlng);
        coords.innerHTML = "LV03: " + projected.x.toFixed(0) + "/" + projected.y.toFixed(0);
    });

    var mapUrl = 'http://wmts1.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20120809/21781/{z}/{y}/{x}.jpeg',
    attrib = 'Map data &copy; 2013 swisstopo, BAFU',
    tilelayer = new L.TileLayer(mapUrl, {
        scheme: 'xyz',
        maxZoom: res.length - 1,
        minZoom: 0,
        opacity: 0.5,
        continuousWorld: true,
        attribution: attrib
    });

    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    function onEachFeature(feature, layer) {
        drawnItems.addLayer(layer);
    }

    var canvasTiles = L.tileLayer.canvas();
    canvasTiles.drawTile = function(canvas, tilePoint, zoom) {
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = ctx.fillStyle = 'rgb(51,0,102)';;
        ctx.rect(0, 0, 256, 256);
        ctx.stroke();
        ctx.font = "bold 16px sans-serif";
        ctx.fillText('(' + tilePoint.x + ', ' + tilePoint.y + ', ' + zoom + ')', 10, 20);
    };

    var drawControl = new L.Control.Draw({
        draw: {
            position: 'topleft',
            polygon: {
                title: 'Draw a sexy polygon!',
                allowIntersection: false,
                drawError: {
                    color: '#b00b00',
                    timeout: 1000
                },
                shapeOptions: {
                    color: '#bada55'
                },
                showArea: true
            },
            polyline: {
                metric: false
            },

            circle: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });

    map.on('draw:created', function(e) {
        var type = e.layerType,
        layer = e.layer;

        if (type === 'marker') {
            layer.bindPopup('A popup!');
        }

        drawnItems.addLayer(layer);
        localStorage.setItem('testObject', JSON.stringify(drawnItems.toGeoJSON()));

    });
    map.on('draw:edited', function(e) {
        var layers = e.layers;
        localStorage.setItem('testObject', JSON.stringify(drawnItems.toGeoJSON()));
    });
    
    var geojson = loadFromLocalStorage();

    L.geoJson(geojson, {
        style: function(feature) {
                 return {
                        "fillColor": "#000099",
                        "weight": 3,
                        color: "#000033",
                        "fillOpacity": 0.65,
                 };
        },
        onEachFeature: onEachFeature

    }).addTo(map);

    map.addControl(drawControl);
    map.addLayer(tilelayer);
    map.addLayer(canvasTiles);
    map.setView([46.95111, 8.2], 14);
}