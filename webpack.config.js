const path = require('path');
const webpack = require('webpack')

let entry = {};
entry['react-filterable-table'] = [path.resolve(__dirname, 'src/Components/FilterableTable')];
entry['example'] = [path.resolve(__dirname, 'example/js/app')];

module.exports = {
	context: path.resolve(__dirname),
	entry: entry,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].min.js'
	},
	module: {
		loaders: [
			// Transform JSX in .jsx files
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
		],
	},
	resolve: {
		// Allow require('./blah') to require blah.jsx
		extensions: ['', '.js', '.jsx']
	},
	externals: {
		// Use external version of React (from CDN for client-side, or
		// bundled with ReactJS.NET for server-side)
		'react': 'React',
		'react-dom': 'ReactDOM',
		"jquery": "jQuery",
		"moment": "moment"
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: { warnings: false }
		})
	],
	node: {
		Buffer: false
	},
	output: {
		library: 'FilterableTable',
		libraryTarget: 'var',
		path: 'dist',
		filename: '[name].min.js',
	},
}
