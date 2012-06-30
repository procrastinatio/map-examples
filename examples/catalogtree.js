var api;

var App,
map1,
map2,
map3,
catalogtree1,
catalogtree2,
catalogtree3,
layertree1,
layertree2,
layertree3;

if (!window.GeoAdmin) {
    window.GeoAdmin = {};
}

function init() {

    OpenLayers.Lang.setCode('en');
    
    
   //Overriden method, for step 3
    GeoAdmin._Layers.prototype.createLayer = function(name, config, options) {
        var wmts_url = ['http://wmts0.geo.admin.ch/', 'http://wmts1.geo.admin.ch/', 'http://wmts2.geo.admin.ch/', 'http://wmts3.geo.admin.ch/', 'http://wmts4.geo.admin.ch/'];
        var myTransitionEffect = "resize";
        if (config.transitionEffect === "no") {
            myTransitionEffect = null;
        }
        if (config.layertype === "wms") {
            // Workaround to avoid problem when a WMS is a sub layer of an aggregated layer
            OpenLayers.Layer.WMS.prototype.moveGriddedTiles = function() {
                var shifted = true;
                var buffer = this.buffer || 1;
                if (this.grid[0]) {
                    var tlLayer = this.grid[0][0].position;
                    var offsetX = parseInt(this.map.layerContainerDiv.style.left);
                    var offsetY = parseInt(this.map.layerContainerDiv.style.top);
                    var tlViewPort = tlLayer.add(offsetX, offsetY);
                    if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
                        this.shiftColumn(true);
                    } else if (tlViewPort.x < -this.tileSize.w * buffer) {
                        this.shiftColumn(false);
                    } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
                        this.shiftRow(true);
                    } else if (tlViewPort.y < -this.tileSize.h * buffer) {
                        this.shiftRow(false);
                    } else {
                        shifted = false;
                    }
                    if (shifted) {
                        // we may have other row or columns to shift, schedule it
                        // with a setTimeout, to give the user a chance to sneak
                        // in moveTo's
                        this.timerId = window.setTimeout(this._moveGriddedTiles, 0);
                    }
                }
            };
            var layer_options_wms = OpenLayers.Util.extend({
                layername: name,
                hasLegend: config.hasLegend,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity: 1.0,
                singleTile: true,
                geoadmin_queryable: config.queryable,
                geoadmin_searchable: config.searchable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                maxScale: config.maxScale,
                minScale: config.minScale,
                ratio: 1.1,
                transitionEffect: myTransitionEffect
            }, options);
            return new OpenLayers.Layer.WMS(config.name, config.url || "http://wms.geo.admin.ch/", {
                layers: config.layers,
                format: config.format,
                transparent: config.transparent || true
            }, layer_options_wms);
        } else if (config.layertype === "aggregate") {
            var sub_layers = [];
            var i;
            for (i = 0; i < config.subLayersName.length; i++) {
                sub_layers[i] = this.buildLayerByName(config.subLayersName[i], {
                    aggregateChild: true
                });
            }
            var layer_options_aggregate = OpenLayers.Util.extend({
                layername: name,
                hasLegend: config.hasLegend,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity: 1.0,
                geoadmin_queryable: config.queryable,
                geoadmin_searchable: config.searchable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type
            }, options);
            return new OpenLayers.Layer.Aggregate(config.name, sub_layers, layer_options_aggregate);

        } else if (config.layertype === "wmts") {
            var layer_options_wmts = OpenLayers.Util.extend({
                name: config.name,
                layer: config.layer || name,
                layername: config.layername || name,
                hasLegend: config.hasLegend,
                version: "1.0.0",
                requestEncoding: config.requestEncoding || "REST",
                url: config.url || wmts_url,
                style: "default",
                matrixSet: config.matrixSet || "21781",
                matrixIds: config.matrixIds,
                formatSuffix: config.format && config.format.split('/')[1].toLowerCase(),
                dimensions: config.dimensions !== undefined ? config.dimensions: ['TIME'],
                params: {
                    'time': config.timestamp
                },
                projection: new OpenLayers.Projection('EPSG:21781'),
                units: 'm',
                format: config.format,
                attribution: config.datenherr,
                transitionEffect: myTransitionEffect,
                buffer: 0,
                opacity: config.opacity ? config.opacity: 1.0,
                displayInLayerSwitcher: !config.isBgLayer,
                geoadmin_queryable: config.queryable,
                geoadmin_searchable: config.searchable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                maxScale: config.maxScale,
                serverResolutions: config.serverResolutions || [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0, 2.5, 2.0, 1.5, 1.0, 0.5],
                minScale: config.minScale
            }, options);

            return new OpenLayers.Layer.WMTS(layer_options_wmts);
        } else if (config.layertype === 'kml') {
            var kml = new OpenLayers.Layer.Vector(config.name, {
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: config.url,
                    format: new OpenLayers.Format.KML({
                        extractStyles: true,
                        extractAttributes: true,
                        maxDepth: 2
                    })
                    }),
                strategies: [new OpenLayers.Strategy.Fixed()],
                projection: new OpenLayers.Projection("EPSG:4326"),
                hasLegend: config.hasLegend,
                attribution: config.copyright
            })

                return kml;

        } else if (name === "voidLayer") {
            return new GeoAdmin.VoidLayer(config.name, {
                layername: name,
                hasLegend: false,
                geoadmin_isBgLayer: !!(config.isBgLayer)
                });
        }
    };

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

    // First step 
    map1 = new GeoAdmin.Map("map1", {
        doZoomToMaxExtent: true
    });
    var catalogtree1 = new GeoAdmin.CatalogTree({
        renderTo: "catalogtree1",
        map: map1,
        cls: 'geoadmin-treepanel',  // use a custom class to define the tre-like style
        root: {
            children: App.catalogConfig.geodata1   //custom catalog tree config. If you omit this, you'll get 
                                                   // the one in map.geo.admin.ch
        },
        singleUnfold: false

    });

    var layertree1 = new GeoAdmin.LayerTree({
        map: map1,
        renderTo: "layertree1",
        width: 300
    });

    // Second step
    map2 = new GeoAdmin.Map("map2", {
        doZoomToMaxExtent: true
    });
    var catalogtree2 = new GeoAdmin.CatalogTree({
        renderTo: "catalogtree2",
        map: map2,
        cls: 'geoadmin-treepanel',
        root: {
            children: App.catalogConfig.geodata2
        },
        singleUnfold: false

    });

    var layertree2 = new GeoAdmin.LayerTree({
        map: map2,
        renderTo: "layertree2",
        width: 300
    });

    //Third and last step

    map3 = new GeoAdmin.Map("map3", {
        doZoomToMaxExtent: true
    });
    var catalogtree3 = new GeoAdmin.CatalogTree({
        renderTo: "catalogtree3",
        map: map3,
        cls: 'geoadmin-treepanel',
        root: {
            children: App.catalogConfig.geodata3
        },
        singleUnfold: false

    });

    var layertree3 = new GeoAdmin.LayerTree({
        map: map3,
        renderTo: "layertree3",
        width: 300
    });

}