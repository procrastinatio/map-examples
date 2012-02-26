function init() {
    /* var jsonp_url = "https://www.google.com/fusiontables/api/query";
     var jsonp = new OpenLayers.Protocol.Script({
     callbackKey: 'jsonCallback',
     //   callbackPrefix: 'loadFeatures'
     });

     jsonp.createRequest(jsonp_url, {
     //sql: 'select * from 1856605',  // POINT
     //sql: 'select * from 1124880', //POLYGON
     sql: 'select * from 1866107', //LINESTRING
     //  jsonCallback: 'loadFeatures'

     });*/

    var api = new GeoAdmin.API();
    api.createMap({
        div: "map"
    });

    var vector = new OpenLayers.Layer.Vector("States", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.Script({
            url: "https://www.google.com/fusiontables/api/query",
            callbackKey: 'jsonCallback',
            params: {
                sql: 'select geometry from 1124880' // 3052311
            } ,
            format: new OpenLayers.Format.GoogleFusion({
            ignoreExtraDims: true,
            'internalProjection': api.map.projection,
            'externalProjection': new OpenLayers.Projection("EPSG:4326")
        })
        }),

        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                fillColor: "#666699",
                fillOpacity: 0.7,
                strokeColor: "#333366",
                strokeWidth: 2
            })
        })
    });

    api.map.addLayer(vector);

    var bln = new OpenLayers.Layer.Vector("BLN", {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.Script({
            callbackKey: 'jsonCallback',
            url: "https://www.google.com/fusiontables/api/query",
            params: {sql: "select geometry, description from 3052015"}, //1124880" },
            //styleMap: myStyles,
            format: new OpenLayers.Format.GoogleFusion({
                ignoreExtraDims: true,
                'internalProjection': api.map.projection,
                'externalProjection': new OpenLayers.Projection("EPSG:4326")
            })
        }),
        styleMap: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                fillColor: "#669966",
                fillOpacity: 0.7,
                strokeColor: "#336633",
                strokeWidth: 2
            })
        })
    });

    api.map.addLayer(bln);
}