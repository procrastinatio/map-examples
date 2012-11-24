var api;

var App,map,catalogtree,layertree;

if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}


if (!window.App) {
    window.App = {};
}

// The custom CatalogTree
App.catalogConfig = {
    "geodata": [{
        "text": "Scienze della Terra",
        expanded: true,
        "children": [{
            "text": "Geologia",
            expanded: true,
            "children": [{
                "text": "Cenozoico",
                expanded: true,
                "children": [{
                    "text": "Quaternario",
                    expanded: true,
                    "children": [{
                        "text": "Pleistocene",
                        expanded: true,
                        "children": [{
                            "leaf": true,
                            "layerId": "ch.swisstopo.geologie-eiszeit-lgm-raster"
                        }]
                        }, {
                        "text": "Olocene",
                        expanded: false,
                        "children": []
                        }]

                    }]
                }, {
                "text": "Mesozoico",
                expanded: false,
                "children": []
                }, 
{
                "text": "Paleozoico",
                expanded: false,
                "children": []
                }
]
            }, {
            "text": "Tettonica",
            expanded: true,
            "children": [{
                "leaf": true,
                "layerId": "ch.swisstopo.geologie-tektonische_karte"
            }]
            }]

        }]
    }
    
function init() {

    OpenLayers.Lang.setCode('it');

    GeoAdmin.layers.init();


    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    map.switchComplementaryLayer('ch.swisstopo.pixelkarte-grau', {
        opacity: 1
    });
    var catalogtree = new GeoAdmin.CatalogTree({
        renderTo: "catalogtree",
        map: map,
	// use a custom class to define the tre-like style
        cls: 'geoadmin-treepanel',
        configCatalog: App.catalogConfig.geodata,  //custom catalog tree config. If you omit this, you'll get 
                                                  // the one in map.geo.admin.ch
        singleUnfold: false

    });

}