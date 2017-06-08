const path = require('path');
const webpack = require('webpack')

let entry = {};
entry['example'] = [path.resolve(__dirname, 'example/js/app')];
entry['example-alt'] = [path.resolve(__dirname, 'example-alt/js/app')];

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
		// Use external version of React (from CDN for client-side, or
		// bundled with ReactJS.NET for server-side)
		'react': 'React',
		'react-dom': 'ReactDOM'
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
	]
}
