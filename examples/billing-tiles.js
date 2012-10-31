GeoAdmin.Billing = function() {
    this.billed_tiles = {};

};

GeoAdmin.Billing.init = function() {
    this.billed_tiles = {};
    setInterval("GeoAdmin.Billing.display()", 2000);

    this.win = new Ext.Window({
        height: 150,
        width: 300,
        title: 'Tiles stats (updates every 2s)',
        autoScroll: true,
        items: [{
            html: '<div id="stats"></div>'
        }],

        }).show();
};
GeoAdmin.Billing.update = function(layername, tiles) {
    if (layername) {
        if (!this.billed_tiles[layername]) {
            this.billed_tiles[layername] = tiles;
        } else {
            this.billed_tiles[layername] += tiles;
        }
    }
};

GeoAdmin.Billing.display = function() {
    var layers = Object.keys(this.billed_tiles);
    var msg = '';
    for (var i = 0; i < layers.length; i++) {
        var tiles = this.billed_tiles[layers[i]];
        console.log(layers[i], tiles);
        msg += layers[i] + ": " + tiles + "</br>";
    }
    var el = document.getElementById('stats');
    if (el)
        el.innerHTML = msg;
};

OpenLayers.Layer.Grid.prototype.tiles_loaded = 0;

OpenLayers.Tile.Image.prototype.onImageLoad = function() {
    var img = this.imgDiv;
    OpenLayers.Event.stopObservingElement(img);

    img.style.visibility = 'inherit';
    img.style.opacity = this.layer.opacity;
    //b.update(this.layer.layername, 1);
    //this.layer.tiles_loaded +=1;
    GeoAdmin.Billing.update(this.layer.layername, 1);

    this.isLoading = false;
    this.canvasContext = null;
    this.events.triggerEvent("loadend");

    if (this.layerAlphaHack === true) {
        img.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" + img.src + "', sizingMethod='scale')";
    }
};

function init() {
    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-grau', {
        opacity: 1
    });
    var catalogtree = new GeoAdmin.CatalogTree({
        renderTo: "catalogtree",
        map: map,
        singleUnfold: true,
        cls: 'geoadmin-treepanel'

    });
    var layertree = new GeoAdmin.LayerTree({
        map: map,
        renderTo: "layertree",
        width: 300
    });

    GeoAdmin.Billing.init();

}