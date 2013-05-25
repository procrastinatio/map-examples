if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

var crs;

function init() {
    var res = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5];

    var scale = function (zoom) {
        return 1 / res[zoom];
    },

    crs = new L.Proj.CRS('EPSG:21781',
            '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 ' + '+k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs',
        {
            resolutions: res,
            origin: [420000, 350000]
        });

    var map = new L.Map('map', {
        crs: crs,
        continuousWorld: true,
        worldCopyJump: false,
        scale: scale
    });

    map.on('mousemove', function (e) {
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
            continuousWorld: true,
            attribution: attrib
        });

    function onEachFeature(feature, layer) {
        if (feature.properties && feature.properties.html) {
            layer.bindPopup(feature.properties.html);
        }
    }

    L.geoJson(data, {
        style: function (feature) {
            switch (feature.properties.park_statu.trim()) {
            case "P":
                return {
                    color: "#330033",
                    "weight": 1,
                    "fillOpacity": 0.65
                };

            case "K":
                return {
                    color: "#000033",
                    "weight": 1,
                    "fillOpacity": 0.65
                };
            }
        },
        onEachFeature: onEachFeature

    }).addTo(map);

    map.addLayer(tilelayer);
    map.setView([46.95111, 8.2], 14);
}