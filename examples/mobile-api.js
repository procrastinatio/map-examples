(function(){
	var api = new GeoAdminMobile.API();
 
    var map = api.createMapPanel();

    api.createApp({
        panels: [map]
    });
})();
