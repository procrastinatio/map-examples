
var map



function sweep() {

    var width = map.getCurrentSize().w;
    var height = map.getCurrentSize().h;
    // slider position in pixels
    var s = parseInt(width * map.sliderPos);
   
    // slider position on the viewport
    var t = map.getViewPortPxFromLayerPx(new OpenLayers.Pixel(s, height))
    
    // cliping rectangle
    map.rect.top = -map.layerContainerOriginPx.y;
    map.rect.bottom = rect.top + height;
    map.rect.left = -map.layerContainerOriginPx.x;
    map.rect.right = rect.left + s;

    //Syntax for clip "rect(top,right,bottom,left)"
    var clip = "rect(" + rect.top + "px " + rect.right + "px " + rect.bottom + "px " + rect.left + "px)";

    map.sweepLayer.div.style.clip = clip;
}
    
function initSlider() {
    var visual = document.createElement("div");
    visual.className = 'slider-visual';
    var slider = document.createElement("div");
    slider.id = 'slider';
    slider.appendChild(visual);
    map.div.appendChild(slider);
    slider.style.top = -map.size.h + "px";
    slider.style.left = (map.size.w * map.sliderPos) + "px";
    $("#slider").draggable({
        containment: '#map',
        cursor: 'pointer',
        axis: 'x',
        drag: function(evt, ui) {
            map.sliderPos = ui.position.left / map.getCurrentSize().w;
            sweep();
        }
    }); 
 }

function init() {
    
    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });
    
    // initial slider position
    map.sliderPos = 0.4;

    map.addLayerByName('ch.swisstopo.hiks-dufour');
    map.sweepLayer=  map.addLayerByName('ch.swisstopo.hiks-siegfried');

    map.rect = rect = new OpenLayers.Bounds();
    map.events.register("move", map, sweep);
    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {
        opacity: 1
    });
   // map.layers[0].div.style.display = "block";

    map.zoomToExtent([497410,115985,502910,119485]);
    
    sweep();
    
    initSlider();
}
       
 