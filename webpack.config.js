const path = require('path');
const webpack = require('webpack')

let entry = {};
entry['react-filterable-table'] = [path.resolve(__dirname, 'src/index.js')];

module.exports = {
	context: path.resolve(__dirname),
	entry: entry,
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	module: {
		loaders: [
			// Transform JSX in .jsx files
			{ test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader' },
			{ test: /\.css$/, loader:'style!css!' }
		],
		rules: [
			{
				test: /\.less$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					'less-loader'
				]
			}
		]
	},
	resolve: {
		// Allow require('./blah') to require blah.jsx
		extensions: ['', '.js', '.jsx']
	},
	externals: {
		'react': 'commonjs react',
		'react-dom': 'commonjs react-dom'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	],
	node: {
		Buffer: false
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'umd',
		library: 'FilterableTable'
	}
}
