function init() {
    var cloudmade = new CM.Tiles.CloudMade.Web({key: '87d0809ae7d949669c81a46243bf08e1'});
    var map = new CM.Map('map', cloudmade);
    map.setCenter(new CM.LatLng(46.95, 7.44), 12);
}

