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
   
   		const encodedURI = window.encodeURI('http://localhost:5000/search?fieldFilters={"name":"year","type":"number","value":2014}&requestedColumns=locality,type,age_group,rate');
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
   		const encodedURI = window.encodeURI('http://catalog.civicdashboards.com/dataset/0f854062-ad27-483f-bf47-28397d15ffad/resource/9dd40375-d30e-41cc-9e8e-e6fb26b42bf9/download/3c4266dce6ec422cb63b4cc53cbdcaa9temp.geojson');
   		return axios.get(encodedURI).then((response) => {

   			return response.data
			// return response.data.items
		})
	}
}