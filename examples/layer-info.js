Ext.ns('App');


if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}

App.LayerInfo = {
    
    show: function(id) {
        var lyr = GeoAdmin.layers.layers[id];
        if (lyr  && lyr.layertype == 'wms') {
            var url = Ext.urlAppend(lyr.url, Ext.urlEncode({service: 'WMS', version: '1.1.1', request: 'GetLegendGraphic', layer: lyr.layers, format: 'image/png', lang: OpenLayers.Lang.getCode()}));
           
             var _window = new Ext.Window({
                  layout: 'anchor',
                  closeAction: 'hide',
                  resizable: true,
                  autoScroll: true,
                  border: false,
                  width: 525,
                  html:  '<h1>This is a custom LayerInfo generated from class <em>App.LayerInfo</em></h1><img src="' + url  + '">',
                  bodyStyle: "max-height: 500px"
            });
            _window.show();
           
        } else {
            GeoAdmin.BodSearchWindow.show(id);
        }
    }
};
var map;

function init() {

    OpenLayers.Lang.setCode('fr');
    
    
    // before adding the GeoCat layers to the layer config
    // object we need to make sure the layer config object
    // is created.
    GeoAdmin.layers.init();

    // now add the GeoCat layers to the layer config object
    for (var k in App.geoCatLayers) {
        var layer = App.geoCatLayers[k];
        layer.name = layer.alternate_title;
        delete layer.alternate_title;
        layer.capabilitiesNeeded = false;
        GeoAdmin.layers.layers[k] = layer;
    };

    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-grau', {
        opacity: 1
    });
    var catalogtree = new GeoAdmin.CatalogTree({
        renderTo: "catalogtree",
        map: map,
        infoWindowClass: 'App.LayerInfo', // custom class to handle the layerinfos
        cls: 'geoadmin-treepanel',  // use a custom class to define the tree-like style
        configCatalog: App.catalogConfig.geodata2 ,  //custom catalog tree config. If you omit this, you'll get 
                                                   // the one in map.geo.admin.ch
        singleUnfold: true

    });

    var layertree = new GeoAdmin.LayerTree({
        map: map,
        renderTo: "layertree",
        infoWindowClass: 'App.LayerInfo', // custom class to handle the layerinfos
        width: 330
    });
    
    map.addLayerByName('wms-custom-layer');

    
}