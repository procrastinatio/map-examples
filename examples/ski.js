var api;

function init() {
    
    OpenLayers.Util.extend(OpenLayers.Lang.en, {
        'SAC-CAS.url':'http://www.sac-cas.ch/en/'
    });
    api = new GeoAdmin.API({
        lang: 'en'
    });
    api.createMapPanel({
        height: 350,
        renderTo: "map",
        tbar: new Ext.Toolbar()
    });

    var layertree = new GeoAdmin.LayerTree({
        renderTo: "layertree",
        map: api.map
    });

    // Reorder layer once loaded
    api.map.events.on({
        'addlayer': function (evt) {
            if (evt.layer.name === "Slope >30°") {
                api.map.setLayerIndex(evt.layer, 2);
            }
        }
    });

    // Proxy stuff to get GetCapabilities xml. In this example, we use two proxies, one for printing, the other to retrieve the getcapabilities document
    OpenLayers.ProxyHost = (window.location.host == "localhost") ? "/cgi-bin/proxy.cgi?url=" : "/cgi-bin/proxy?url=";

    GeoAdmin.layers.init();

    var wmts_url = window.location.protocol + "//wmts.geo.admin.ch";

    // Add the layers to the layer list. The missing information will be
    // read from the GetCapabilities document
    GeoAdmin.layers.layers['ch.swisstopo-karto.skitouren'] = {
        layer: "ch.swisstopo-karto.skitouren",
        capabilitiesNeeded: true,
        url: wmts_url,
        layertype: "wmts",
        name: "Skitouring routes",
        "datenherr": "SAC-CAS"
    };

    GeoAdmin.layers.layers['ch.swisstopo-karto.schneeschuhrouten'] = {
        layer: "ch.swisstopo-karto.schneeschuhrouten",
        capabilitiesNeeded: true,
        url: wmts_url,
        layertype: "wmts",
        name: "Snowshoes routes",
        "datenherr": "SAC-CAS"
    };

    GeoAdmin.layers.layers['ch.swisstopo-karto.hangneigung'] = {
        layer: "ch.swisstopo-karto.hangneigung",
        capabilitiesNeeded: true,
        url: wmts_url,
        layertype: "wmts",
        name: "Slope >30°",
        "datenehrr": "ch.swisstopo"
    };



    api.mapPanel.getTopToolbar().add([api.createPrint({
        text: OpenLayers.i18n('mf.print.print'),
        printBaseUrl: '/cgi-bin/printproxy?path=',
        printPanelOptions: {
            mapPanel: api.mapPanel
        },
        windowOptions: {
            title: OpenLayers.i18n('print')
        }
    })]);


    // Adding layers
    api.map.addLayerByName('ch.bafu.wildruhezonen-jagdbanngebiete', {
        opacity: 0.60
    });
    api.map.addLayerByName('ch.bafu.wege-wildruhezonen-jagdbanngebiete', {
        opacity: 1
    });

    var lyr_schneeschuh = api.map.addLayerByName('ch.swisstopo-karto.schneeschuhrouten');
    
   
    var lyr_hang = api.map.addLayerByName('ch.swisstopo-karto.hangneigung', {
        opacity: 0.7
    });
   var lyr_ski = api.map.addLayerByName('ch.swisstopo-karto.skitouren');
    
   api.map.zoomToExtent([816110,163945,826070,170805]);
   
   var controls = api.map.getControlsByClass('OpenLayers.Control.Attribution'); 
   if (controls.length > 0) {
       controls[0].updateAttribution();
   }
}
