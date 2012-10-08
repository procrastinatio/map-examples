function init() {
    var res = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5],
    start = new L.LatLng(46.704503026010514, 7.4),
    scale = function(zoom) {
        return 1 / res[zoom];
    },
    crs = L.CRS.proj4js('EPSG:21781', "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
    , new L.Transformation(1, -420000, -1, 350000))
    ,map = new L.Map('map', {
        crs: crs,
        scale: scale,
        continuousWorld: true
    }),
    mapUrl = 'http://wmts1.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20120809/21781/{z}/{y}/{x}.jpeg'
    ,attrib = 'Map data &copy; 2012 swisstopo'
    ,tilelayer = new L.TileLayer(mapUrl, {
        scheme: 'xyz',
        maxZoom: res.length,
        minZoom: 0,
        continuousWorld: true,
        attribution: attrib
    })
    map.options.crs.scale = scale;
    // required by Leaflet 0.4
    map.addLayer(tilelayer);
    map.setView(start, 14);

    map.on('mousemove', function(e) {
        var coords = document.getElementById('coords');
        var projected = crs.project(e.latlng);
        coords.innerHTML = "LV03: " + projected.x.toFixed(0) + "/" + projected.y.toFixed(0);
    });

    if (L.version == '0.4.4') {
        L.geoJson(data, {
            style: function(feature) {
                return {

                    fillColor: '#E31A1C',
                    weight: 2,
                    opacity: 1,
                    color: 'red',
                    dashArray: '3',
                    fillOpacity: 0.7
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(feature.properties.bln_name);
            }
        }).addTo(map);
    }
}