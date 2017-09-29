

var T = require('topojson')
require('./template/main.css')

// require leaflet
var L = require('leaflet');
var esri = require('esri-leaflet');
var geocoding = require('esri-leaflet-geocoder');
var utils = require('./utils')
// var topo = require('./vajson.js')
var chroma = require('chroma-js')

var fatality;
// var axios = require('axios');
// converting topo json to 
// console.log(topo)
utils.fetchFatalities().then((data)=>{

	fatality = data
	console.log(data)


	utils.fetchTopo().then((topodata) => {
	addCountyTopo(topodata)
})
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





// var topoLayer = new L.TopoJSON();
var    colorScale = chroma
.scale(['#FFFFff', '#f03b20'])
.domain([0,150]);

function handleLayer(layer){
	console.log(layer)
	var countryName = layer.feature.properties.name;
	var rateValue = getRate(countryName,fatality)
	console.log(rateValue)
	fillColor = colorScale(rateValue).hex();

	layer.setStyle({
		fillColor : fillColor,
		fillOpacity: 0.75,
		color:'#555',
		weight:1,
		opacity:0.5
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
	topoLayer = L.geoJson(topoData)
	topoLayer.addTo(map);
	// topoLayer.addTo(map);
	topoLayer.eachLayer(handleLayer);
}

function getRate(county,data){
	console.log(county)
	for(var i = 0; i < data.length ; ++i){
		if (county.search(data[i].locality) != -1){
			return(data[i].rate)
		}
	}
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



