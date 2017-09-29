const axios = require('axios')

module.exports = {
	fetchFatalities : function(language,callback){
		
		var config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Access-Control-Allow-Origin': 'http://localhost:3000',
				'Access-Control-Allow-Credentials': 'true'
			},
       
   		};
   
   		const encodedURI = window.encodeURI('http://localhost:5000/search?year=2016&requestedColumns=locality,type,rate');
   		return axios.get(encodedURI,{},config).then((response) => {

   			return response.data
			// return response.data.items
		})
	},
	fetchTopo : function(language,callback){
		
		// var config = {
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 		'Access-Control-Allow-Origin': 'http://localhost:3000',
		// 		'Access-Control-Allow-Credentials': 'true'
		// 	},
       
  //  		};
   
   		// const encodedURI = window.encodeURI('https://unpkg.com/us-atlas@1/us/10m.json');
   		const encodedURI = window.encodeURI('https://raw.githubusercontent.com/shadeland/datathon/frontend/src/vajson.josn');
   		return axios.get(encodedURI).then((response) => {

   			return response.data
			// return response.data.items
		})
	}
}