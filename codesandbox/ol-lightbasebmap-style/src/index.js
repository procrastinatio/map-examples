import "./styles.css";

import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorTileLayer from "ol/layer/VectorTile.js";
import VectorTileSource from "ol/source/VectorTile.js";
import { MVT } from "ol/format.js";
import { createXYZ } from "ol/tilegrid.js";
import { fromLonLat } from "ol/proj";
import XYZ from "ol/source/XYZ.js";

import { apply, applyBackground, applyStyle } from "ol-mapbox-style";

const styleUrl =
  "https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json";

const tileGrid = createXYZ({
  maxZoom: 20
});
const vectorTileSource = new VectorTileSource({
  format: new MVT(),
  tileGrid: tileGrid,
  url:
    "https://vectortiles.geo.admin.ch/tiles/ch.swisstopo.leichte-basiskarte.vt/v2.0.0/{z}/{x}/{y}.pbf"
});

const osmLayer = new TileLayer({
  source: new OSM()
});

const swissImage = new TileLayer({
  source: new XYZ({
    //attributions: attributions,
    url:
      "https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.leichte-basiskarte_reliefschattierung/default/current/3857/{z}/{x}/{y}.png"
  }),
  opacity: 1.0
});

const vectorTileLayer = new VectorTileLayer({
  source: vectorTileSource
  //style: "https://vectortiles.geo.admin.ch/styles/ch.swisstopo.leichte-basiskarte.vt/style.json"
});

/*applyStyle(vectorTileLayer, styleUrl, "", {
  resolutions: tileGrid.getResolutions()
}); */
//applyBackground(layer, url);

const map = new Map({
  target: "map",
  layers: [swissImage, vectorTileLayer],
  view: new View({
    center: fromLonLat([7.44835, 46.94811]),
    zoom: 10
  })
});

apply(map, styleUrl);

//map.addLayer();

// https://openlayers.org/en/latest/examples/vector-tiles-4326.html
