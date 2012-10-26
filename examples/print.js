var api;

function init() {
    api = new GeoAdmin.API({
        lang: 'en'
    });
    api.createMapPanel({
        height: 350,
        renderTo: "map",
        tbar: new Ext.Toolbar()
        });
    api.map.addLayerByName('ch.bafu.wildruhezonen-jagdbanngebiete', {
        opacity: 0.60
    });
    api.map.addLayerByName('ch.bafu.wege-wildruhezonen-jagdbanngebiete', {
        opacity: 1
    });
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
}
