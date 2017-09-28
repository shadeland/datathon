const L = require('leaflet')
require('./template/main.css')



const div  = document.createElement('div');
div.innerHTML = '<h1>Hello World</h1>';
document.body.appendChild(div);


let map = L.map('vamap').setView([44,-21],3);
L.tileLayer('http://cartodb-basemaps-{s}.global.ssl.fastly.net/{style}/{z}/{x}/{y}.png', {
	attribution: `&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>,
	&copy;<a href="https://carto.com/attribution">CARTO</a>`,
	maxZoom: 18,
	style: 'dark_all'
}).addTo(map);
