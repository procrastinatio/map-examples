var map;

String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};

function init() {

    function WMSGetTileUrl(coord, zoom, config) {
        var proj = map.getProjection();
        var zfactor = Math.pow(2, zoom);
        var top = proj.fromPointToLatLng(new google.maps.Point(coord.x * 256 / zfactor, coord.y * 256 / zfactor));
        var bot = proj.fromPointToLatLng(new google.maps.Point((coord.x + 1) * 256 / zfactor, (coord.y + 1) * 256 / zfactor));

        var bbox = top.lng() + "," + bot.lat() + "," + bot.lng() + "," + top.lat();

        var url = config.service + "LAYERS={0}&FORMAT=image/{1}&SRS=EPSG:4326&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap" + "&STYLES=&BBOX={2}&WIDTH=256&HEIGHT=256";
        url = url.format(config.layers, config.extension, bbox);

        return url;

    }
    var PixelkarteType = new google.maps.ImageMapType({
        isPng: true,
        maxZoom: 20,
        minZoom: 7,
        name: "Pixelkarte",
        tileSize: new google.maps.Size(256, 256),
        credit: 'swisstopo',
        getTileUrl: function(coord, zoom) {
            var config = {
                service: "http://proxy-wxs.ign.fr/url/http:/api.geo.admin.ch/main/mapproxy/service?",
                layers: "ch.swisstopo.pixelkarte-farbe",
                extension: "jpeg"
            };
            var url = WMSGetTileUrl(coord, zoom, config);

            return url;
        }
    });
    
    var OrthophotoType = new google.maps.ImageMapType({
        isPng: true,
        maxZoom: 20,
        minZoom: 7,
        name: "Orthophoto",
        tileSize: new google.maps.Size(256, 256),
        credit: 'swisstopo',
        getTileUrl: function(coord, zoom) {
            var config = {
                service: "http://proxy-wxs.ign.fr/url/http:/api.geo.admin.ch/main/mapproxy/service?",
                layers: "ch.swisstopo.swissimage",
                extension: "jpeg"
            };
            var url = WMSGetTileUrl(coord, zoom, config);

            return url;
        }
    });

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: new google.maps.LatLng(46.94, 7.45),
        mapTypeControlOptions: {
            mapTypeIds: ['Pixelkarte', 'Orthophoto', google.maps.MapTypeId.TERRAIN],
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR
        }
    });
    map.mapTypes.set('Pixelkarte', PixelkarteType);
    map.setMapTypeId('Pixelkarte');

    map.mapTypes.set('Orthophoto', OrthophotoType);


}