
var getURL = function(bounds) {
    bounds = this.adjustBounds(bounds);
    var url = "";
    if (!this.tileFullExtent || this.tileFullExtent.intersectsBounds(bounds)) {

        var center = bounds.getCenterLonLat();
        var info = this.getTileInfo(center);
        var matrixId = this.matrix.identifier;
        var dimensions = this.dimensions, params;

        var context = {
            style: this.style,
            Style: this.style,
            TileMatrixSet: this.matrixSet,
            TileMatrix: this.matrix.identifier,
            TileRow: info.row,
            TileCol: info.col,
            left: bounds.left,
            right: bounds.right,
            top: bounds.top,
            bottom: bounds.bottom
        };

        var dark = "http://chart.apis.google.com/chart?chst=d_text_outline&chs=256x256&chf=bg,s,0000007D&chld=FFFFFF|16|h|000000|b|";
        var light = "http://chart.apis.google.com/chart?chst=d_text_outline&chs=256x256&chf=bg,s,CFCFCF80&chld=FFFFFF|16|h|000000|b|";

        if ((info.row % 2 && !(info.col % 2)) || (!(info.row % 2) && info.col % 2)) {
            imageurl = light;
        } else {
            imageurl = dark;
        }
        var template = imageurl + "|row, col: (${TileRow}, ${TileCol}) |TileMatrixSet ${TileMatrixSet}|TileMatrix ${TileMatrix}|" + "|Tile boundaries:|top left: (${left} ${top})|bottom right: (${right} ${bottom})|||||____________________________";
        url = OpenLayers.String.format(template, context)

        }
    return url;

}

var api;
function init() {
    api = new GeoAdmin.API();
    api.createMap({
        div: "map"
    });

    var lyr = api.map.addLayerByName("ch.swisstopo.swissboundaries3d-kanton-flaeche.fill").clone();
    lyr.getURL = getURL;
    api.map.addLayer(lyr);
}
