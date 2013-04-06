var map,vec,selectFeature,overview;

function zoomToId(id) {
    var features = vec.getFeaturesByAttribute('objectid',id);
    if (features.length >0 ){
        var feat = features[0];
        map.zoomToExtent(feat.geometry.getBounds(), closest=false);
    }
}

function init() {

       fillColor = "#2d578b";
       highlightColor = "red";


     var styleMap = new OpenLayers.StyleMap({
        'default': {
            strokeOpacity: 0.0,
            fillOpacity: 0.0
        },
       "select": {
            fillColor: "blue",
            fillOpacity: 0.4,
            strokeColor: "blue",
            strokeWidth: 2
        }
    });


    vec = new OpenLayers.Layer.Vector("Dam", {
        styleMap: styleMap,
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "data/bigdam20.js",
            format: new OpenLayers.Format.GeoJSON()
            })
        });
    map = new GeoAdmin.Map("map", {
        doZoomToMaxExtent: true
    });

    map.addLayers([vec]);

    map.events.register("moveend", map, function() {
        mapExtent();
    });

    map.events.register("zoomend", map, function() {
        mapExtent();

    });

    function mapExtent() {

        var poly = map.getExtent().toGeometry();
        var feature = new OpenLayers.Feature.Vector(poly);
        var lyr = overview.getLayersByName('overviewLayer')[0];
        lyr.removeAllFeatures();
        lyr.addFeatures([feature]);

    }

    overview = new GeoAdmin.Map("overview", {
        doZoomToMaxExtent: true
    });
    overview.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {
        opacity: 1
    });
    var layer = new OpenLayers.Layer.Vector("overviewLayer");
    overview.addLayer(layer);

    selectFeature = new OpenLayers.Control.SelectFeature(vec, {
        multiple: false,
        hover: true
    });
    map.addControl(selectFeature);
    selectFeature.activate();

    vec.events.on({
        'featureselected': function(evt) {
            var id = evt.feature.attributes.objectid;
            zoomToId(id);
            d3.select("#rect-" + id).style("fill", highlightColor);
        },
        'featureunselected': function(evt) {
            d3.select("#rect-" + evt.feature.attributes.objectid).style("fill", fillColor);
        },
        'loadend': function(evt) {
              selectFeature.select(vec.features[3]);  
        }
    });

    overview.controls[1].div.style.display = 'none';

    for (var i = 0; i < overview.controls.length; i++) {
        overview.controls[i].deactivate()
        var div = overview.controls[i].div;
        if (div) div.style.display = 'none';
     } 

    var barWidth = 15;
    var width = (barWidth + 4) * 20 +20;
    var height = 250;
    var titleHeight = 20;

    var svg = d3.select('#chart').append('svg').attr({
        'width': width+20,
        'height': height,
        }).
        style('padding', '10px');
        
    svg.append('text')
    .attr({
      'class': 'title',
      'x': 40,
      'y': titleHeight / 2,
    })
    .text('Barrage lake area [km²]');
    
    
   

    d3.csv("data/bigdam20.csv", function(error, data) {

       data.forEach(function(d) {
            d.objectid = +d.objectid,
            d.name = d.name,
            d.canton = d.canton,
            d.volume = +d.volume * 1e6,
            d.altitude = +d.altitude,
            d.area = +d.area,
            d.depth = +d.depth,
            d.type = d.type,
            d.year = d.year, //new Date( + d.year, 0, 1),  // convert "Year" column to Date
            d.height = +d.height
        });

        var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
     
        var y = d3.scale.linear().domain([0, d3.max(data, function(datum) {
            return datum.area;
        })]).
        rangeRound([height,0]);
        
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("right")
            .ticks(5);
        
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + 2 + ",0)")
            .call(yAxis);
        

        svg.selectAll("rect").
        data(data).enter().
        append("svg:rect").
        attr("x", function(datum, index) { return x(index+1);}).
        attr("y", function(datum) { return y(datum.area);  }).
        attr("height", function(datum) { return height -y(datum.area); }).
        attr("width", barWidth).
        attr("id", function(datum, i) { return "rect-" + datum.objectid; }).
        attr("fill", fillColor).
        on("mouseover", function(d,i) { 
            d3.select("#rect-" + d.objectid).style("fill", highlightColor);
            // objectid,name,canton,volume,altitude,area,depth,type,year,height
            var msg = OpenLayers.String.format("Name: ${name}\nplace: ${canton}\naltitude: ${altitude} [m]\nLake volume: ${volume} [m3]\n" +
            "Lake area: ${area} [km2]\nLake depth: ${depth} [m]\nDam height: ${height} [m]\nDam type: ${type}\n\nBuild year: ${year}",d);
            OpenLayers.Util.getElement('out').innerHTML = msg;
           
            zoomToId(d.objectid);
        }).
        on("mouseout", function(d,i) { d3.select("#rect-" + d.objectid).style("fill", fillColor)});
        
        

    }); //end csv
    
    $(document).ready(function() {
         $(function() {
             $( ".draggable" ).draggable();
          });
    });
    
    
    

}