if (!window.App) {
    window.App = {};
}

var matrixIds = [{
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "0",
    "scaleDenominator": 14285750.5715,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "1",
    "scaleDenominator": 13392891.1608,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "2",
    "scaleDenominator": 12500031.7501,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "3",
    "scaleDenominator": 11607172.3393,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "4",
    "scaleDenominator": 10714312.9286,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "5",
    "scaleDenominator": 9821453.51791,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "6",
    "scaleDenominator": 8928594.10719,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "7",
    "scaleDenominator": 8035734.69647,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "8",
    "scaleDenominator": 7142875.28575,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "9",
    "scaleDenominator": 6250015.87503,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 2,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "10",
    "scaleDenominator": 5357156.46431,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 2,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "11",
    "scaleDenominator": 4464297.05359,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 2,
    "matrixHeight": 1
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "12",
    "scaleDenominator": 3571437.64288,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 2,
    "matrixHeight": 2
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "13",
    "scaleDenominator": 2678578.23216,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 3,
    "matrixHeight": 2
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "14",
    "scaleDenominator": 2321434.46787,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 3,
    "matrixHeight": 2
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "15",
    "scaleDenominator": 1785718.82144,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 4,
    "matrixHeight": 3
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "16",
    "scaleDenominator": 892859.410719,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 8,
    "matrixHeight": 5
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "17",
    "scaleDenominator": 357143.764288,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 19,
    "matrixHeight": 13
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "18",
    "scaleDenominator": 178571.882144,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 38,
    "matrixHeight": 25
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "19",
    "scaleDenominator": 71428.7528575,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 94,
    "matrixHeight": 63
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "20",
    "scaleDenominator": 35714.3764288,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 188,
    "matrixHeight": 125
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "21",
    "scaleDenominator": 17857.1882144,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 375,
    "matrixHeight": 250
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "22",
    "scaleDenominator": 8928.59410719,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 750,
    "matrixHeight": 500
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "23",
    "scaleDenominator": 7142.87528575,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 938,
    "matrixHeight": 625
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "24",
    "scaleDenominator": 5357.15646431,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1250,
    "matrixHeight": 834
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "25",
    "scaleDenominator": 3571.43764288,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 1875,
    "matrixHeight": 1250
}, {
    "supportedCRS": "urn:ogc:def:crs:EPSG:21781",
    "identifier": "26",
    "scaleDenominator": 1785.71882144,
    "topLeftCorner": {
        "lon": 420000,
        "lat": 350000
    },
    "tileWidth": 256,
    "tileHeight": 256,
    "matrixWidth": 3750,
    "matrixHeight": 2500
}];

App.geoCatLayers = {
    "kml": {
        "layer": "KML",
        "alternate_title": "BLN (KML)",
        "copyright": "BAFU",
        "url": "data/bln-style.kml",
        "copyright_link": "http://www.bafu.admin.ch/index.html?lang=de",
        "layertype": "kml",
        "id": "kml",
        "hasLegend": false
    },
    "wms-custom-layer": {
        "layer": "WMS",
        "name": "Main lithological groups (WMS)",
        "layertype": "wms",
        "layers": "ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen",
        "alternate_title": "Main lithological groups (WMS)",
        "copyright": "swisstopo",
        "url": "http://wms.geo.admin.ch",
        "copyright_link": "http://www.bafu.admin.ch/index.html?lang=de",
        "id": "wms-custom-layer",
        "hasLegend": true,
        "isBgLayer": false,
        "datenehrr": "swisstopo",
        "opacity": 0.75,
        "transparent": true,
        "queryable": false,
        "searchable": false,
        "type": "polygon",
        "minScale": 10000000,
        "maxScale": 1
    },
    "wmts-custom-layer": {
        "layer": "ch.swisstopo.geologie-geologischer_atlas",
        layername: "ch.swisstopo.geologie-geologischer_atlas",
        layertype: "wmts",
        "alternate_title": "Geological Atlas 1:25 000 (WMTS)",
        "datenherr": "swisstopo",
        "copyright_link": "http://www.bafu.admin.ch/index.html?lang=de",
        "layertype": "wmts",
        "layerinfo_url": "http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/products/maps/geology/atlas.print.html",
        "id": "wmts-custom-layer",
        "hasLegend": true,
        "requestEncoding": "REST",
        dimensions: ['TIME'],
        "url": ['http://wmts0.geo.admin.ch/'],
        matrixSet: "21781",
        matrixIds: matrixIds,
        format: "image/png",
        timestamp: "20120601",
        opacity: 0.75,
        isBgLayer: false,
        "queryable": true,
        "searchable": false,
        "minScale": 10000000,
        "maxScale": 1,
        serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],

        }
}

App.catalogConfig = {
    "geodata1": [{
        "text": "Environment, biology and geology",
        "children": [{
            "text": "Protected sites",
            "children": [{
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-bln"
            }, {
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-jagdbanngebiete"
            }, {
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-moorlandschaften"
            }]
            }, {
            "text": "Geology",
            "children": [{
                "leaf": true,
                "layerId": "ch.swisstopo.geologie-eiszeit-lgm-raster"
            }, {
                "leaf": true,
                "layerId": "ch.swisstopo.geologie-tektonische_karte"
            }]
            }]

        }],

    "geodata2": [{
        "text": "Custom geology layers (WMS & WMTS)",
        "children": [{
            "leaf": true,
            "layerId": "wms-custom-layer"
        }, {
            "leaf": true,
            "layerId": "wmts-custom-layer"
        }]
        }, {
        "text": "Environment, biology and geology",
        "children": [{
            "text": "Protected sites",
            "children": [{
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-bln"
            }, {
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-jagdbanngebiete"
            }, {
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-moorlandschaften"
            }]
            }
]

        }],

    "geodata3": [{
        "text": "Custom vector layers (KML)",
        "children": [{
            "text": "BLN (KML)",
            "children": [{
                "leaf": true,
                "layerId": "kml"
            }]
            }]
        }, {
        "text": "Environment, biology and geology",
        "children": [{
            "text": "Protected sites",
            "children": [{
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-bln"
            }, {
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-jagdbanngebiete"
            }, {
                "leaf": true,
                "layerId": "ch.bafu.bundesinventare-moorlandschaften"
            }]
            }]

        }]
    }
