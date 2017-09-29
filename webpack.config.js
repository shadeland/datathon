const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry : './src/randomdots.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index_bundle.js'
	},
 	devtool: 'inline-source-map',
	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.css$/, use: [ 'style-loader', 'css-loader']},
			{test: /\.js$/,include: /linebreak/,loader: "transform-loader?brfs"}
		]
	},
	plugins: [new HtmlWebpackPlugin({
		template: 'src/template/index.html'
	})],
	
	devServer: {

    compress: true,

    disableHostCheck: true,   // That solved it

     }     

}
