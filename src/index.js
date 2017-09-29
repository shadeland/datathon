

var T = require('topojson')
require('./template/main.css')

// require leaflet
var L = require('leaflet');
var esri = require('esri-leaflet');
var geocoding = require('esri-leaflet-geocoder');
var utils = require('./utils')
var topo = require('./vajson.js')
var chroma = require('chroma-js')

// var axios = require('axios');
// converting topo json to 
console.log(topo)
utils.fetchFatalities().then((data)=>{
	console.log(data)
})



// L.TopoJSON = L.GeoJSON.extend({
// 	addData: function(jsonData){
// 		if(jsonData.type === "Topology"){
// 			for(key in jsonData.objects){
// 				geojson = T.feature(jsonData, jsonData.objects[key]);
// 				L.GeoJSON.prototype.addData.call(this, geojson);
// 			}
// 		}
// 		else {
// 			L.GeoJSON.prototype.addData.call(this, jsonData);
// 		}
// 	}


// })





// since leaflet is bundled it won't be able to detect where the images are automatically
// solution is to point it to where you host the the leaflet images yourself
L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.2.0/dist/images/';

// create map
var map = L.map('vamap').setView([35.505, -78.09], 7);

// add basemap11
esri.basemapLayer('Gray').addTo(map);


// utils.fetchTopo().then((data) => {
// 	addCountyTopo(data)
// })
addCountyTopo(topo)

// var topoLayer = new L.TopoJSON();
var    colorScale = chroma
.scale(['#D5E3FF', '#003171'])
.domain([0,1]);

function handleLayer(layer){
	console.log(layer)
	var randomValue = Math.random(),
	fillColor = colorScale(randomValue).hex();

	layer.setStyle({
		fillColor : fillColor,
		fillOpacity: 1,
		color:'#555',
		weight:1,
		opacity:1
	});
	layer.on({
		mouseover : enterLayer,
		mouseout: leaveLayer
	});
}
function enterLayer(){
	var countryName = this.feature.properties.name;
	console.log(countryName)
	$countryName.text(countryName).show();

	this.bringToFront();
	this.setStyle({
		weight:2,
		opacity: 1
	});
}
function leaveLayer(){
	$countryName.hide();
	this.bringToBack();
	this.setStyle({
		weight:1,
		opacity:.5
	});
}
function addCountyTopo (topoData){
	// console.log(topoData)
	L.geoJson(topoData).addTo(map);
	// topoLayer.addTo(map);
	topoLayer.eachLayer(handleLayer);
}

// addCountyTopo(topo)





// add layer
// esri.featureLayer({
//   url: 'https://services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisday/FeatureServer/0/'
// }).addTo(map);




// const div  = document.createElement('div');
// div.innerHTML = '<h1>Hello World</h1>';
// document.body.appendChild(div);


// let map = L.map('vamap').setView([44,-21],3);
// L.tileLayer('http://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {
// 	attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
// 	&copy;<a href="https://carto.com/attribution">CARTO</a>`,
// 	maxZoom: 18,
// 	style: 'dark_all'
// }).addTo(map);



