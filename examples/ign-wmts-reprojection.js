/*
 * Copyright (c) 2008-2012 Institut National de l'information Geographique et forestiere France, released under the
 * BSD license.
 */
var v0 = null;
// prevents IE errors when instance is not declared by the API
function initMap() {
    if (checkApiLoading('initMap();', ['OpenLayers', 'Geoportal', 'Geoportal.Viewer', 'Geoportal.Viewer.Default']) === false) {
        return;
    }

    //The api is loaded at this step
    //L'api est chargée à cette étape
    //add translations
    translate();

    OpenLayers.Util.onImageLoadErrorColor = "transparent";

    //  ===================================================================================================
    function getOSM(_native) {
        // See OpenLayers spherical-mercator.html :
        // In order to keep resolutions, projection, numZoomLevels,
        // maxResolution and maxExtent are set for each layer.
        // OpenStreetMap tiled layer :
        if (!_native) {
            var osm = new Geoportal.Layer.Grid("OpenStreetMap (Tiles" + "&#064;" + "Home)", "http://tile.openstreetmap.org/${z}/${x}/${y}.png", {}, {
                isBaseLayer: false,
                zoomOffset: -1,
                //zoomOffset: 0,
                sphericalMercator: false,
                projection: new OpenLayers.Projection("EPSG:900913"),
                units: "m",
                nativeResolutions: [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875, 305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219, 19.109257067871095, 9.554628533935547, 4.777314266967774, 2.388657133483887, 1.1943285667419434],
                maxZoomLevel: 18,
                maxExtent: new OpenLayers.Bounds( - 20037508, -20037508, 20037508, 20037508),
                gridOrigin: new OpenLayers.LonLat(0, 0),
                //visibility: false,
                originators: [{
                    logo: 'osm',
                    pictureUrl: 'http://wiki.openstreetmap.org/Wiki.png',
                    url: 'http://wiki.openstreetmap.org/wiki/WikiProject_France'
                }],
                opacity: 0.4,
                destroy: function() {
                    this.nativeMaxExtent = null;
                    Geoportal.Layer.Grid.prototype.destroy.apply(this, arguments);
                },
                getURL: function(bounds) {
                    var res = this.nativeResolution;
                    var x = Math.round((bounds.left - this.nativeMaxExtent.left) / (res * this.nativeTileSize.w));
                    var y = Math.round((this.nativeMaxExtent.top - bounds.top) / (res * this.nativeTileSize.h));
                    var z = this.map.getZoom() + this.zoomOffset;

                    var url = this.url;
                    var s = '' + x + y + z;
                    if (url instanceof Array) {
                        url = this.selectUrl(s, url);
                    }

                    var path = OpenLayers.String.format(url, {
                        'x': x,
                        'y': y,
                        'z': z
                    });

                    return path;
                },
                addTile: function(bounds, position, size) {
                    return new Geoportal.Tile.Image(this, position, bounds, null, size);
                }
            });
            return osm;
        }
        var osm = new OpenLayers.Layer.OSM("OSM (Mercator)", "http://tile.openstreetmap.org/${z}/${x}/${y}.png", {
            projection: new OpenLayers.Projection("EPSG:900913"),
            units: "m",
            numZoomLevels: 18,
            maxResolution: 156543.0339,
            maxExtent: new OpenLayers.Bounds( - 20037508, -20037508, 20037508, 20037508),
            visibility: true,
            originators: [{
                logo: 'osm',
                pictureUrl: 'http://wiki.openstreetmap.org/Wiki.png',
                url: 'http://wiki.openstreetmap.org/wiki/WikiProject_France'
            }],
            isBaseLayer: false
        });
        return osm;
    };

    //  ===================================================================================================
    v0 = new Geoportal.Viewer.Default ("map", OpenLayers.Util.extend({
        mode: 'normal',
        nameInstance: 'v0',
        territory: 'FXX',
        projection: 'IGNF:GEOPORTALFXX',
        displayProjection: ['EPSG:3785', 'IGNF:GEOPORTALFXX', 'CRS:84']
        }, window.gGEOPORTALRIGHTSMANAGEMENT === undefined ? {
        apiKey: ['eea9jrs62eft16v6ndgnc5bn']
        }: gGEOPORTALRIGHTSMANAGEMENT));
    if (!v0) {
        OpenLayers.Console.error(OpenLayers.i18n('new.instance.failed'));
        return;
    }
    v0.addGeoportalLayers(['GEOGRAPHICALGRIDSYSTEMS.MAPS'], {});

    var matrixIds3857 = new Array(22);
    for (var i = 0; i < 22;++i) {
        matrixIds3857[i] = {
            identifier: "" + i,
            topLeftCorner: new OpenLayers.LonLat( -20037508, 20037508)
            };
    }
    var wmts3857 = new Geoportal.Layer.WMTS({
        name: "Pixelkarte (Mercator!)",
        url: "http://wmts.procrastinatio.org",
        layer: "ch.swisstopo.pixelkarte-farbe-pk1000.noscale",
        style: "default",
        matrixSet: "google2",
        matrixIds: matrixIds3857,
        version: "1.0.0",
        requestEncoding: "REST",
        dimensions: ['TIME'],
        params: {
            'time': 20111129
        },
        gridOrigin: new OpenLayers.LonLat( - 20037508, 20037508),
        isBaseLayer: false,
        format: "image/jpeg",
        formatSuffix: 'jpeg',
        projection: new OpenLayers.Projection('EPSG:900913'),
        nativeResolutions: [156543.0339, 78271.51695, 39135.758475, 19567.8792375, 9783.93961875, 4891.969809375, 2445.9849046875, 1222.99245234375, 611.496226171875, 305.7481130859375, 152.87405654296876, 76.43702827148438, 38.21851413574219, 19.109257067871095, 9.554628533935547, 4.777314266967774],
        zoomOffset: -1,
        // for map projection : IGN:GEOPORTALFXX
        //zoomOffset: 0, // for map projection : WebMercator
        maxZoomLevel: 11,  // cause I don't have tiles for bigger zoom level
        opacity: 0.6,
	originators: [{
                    logo: 'swisstopo',
                    pictureUrl: 'http://www.swisstopo.admin.ch/images/logo.jpg',
                    url: 'http://www.swisstopo.admin.ch'
        }]
    });
    v0.getMap().addLayer(wmts3857);

    var osmarender0 = getOSM();
    v0.getMap().addLayers([osmarender0]);
    v0.getMap().addControls([new OpenLayers.Control.Graticule({
        displayInLayerSwitcher: false
    })]);

    v0.getMap().setCenterAtLonLat(6.45, 46.78, 8);

}

/**
 * Function: loadAPI
 * Load the configuration related with the API keys.
 * Called on "onload" event.
 * Call <initMap>() function to load the interface.
 */
function loadAPI() {
    // wait for all classes to be loaded
    // on attend que les classes soient chargГ©es
    if (checkApiLoading('loadAPI();', ['OpenLayers', 'Geoportal', 'Geoportal.Viewer', 'Geoportal.Viewer.Default']) === false) {
        return;
    }

    // load API keys configuration, then load the interface
    // on charge la configuration de la clef API, puis on charge l'application
    Geoportal.GeoRMHandler.getConfig(['eea9jrs62eft16v6ndgnc5bn'], null, null, {
        onContractsComplete: initMap
    });
}

// assign callback when "onload" event is fired
// assignation de la fonction Г  appeler lors de la levГ©e de l'Г©vГЁnement
// "onload"
window.onload = loadAPI;