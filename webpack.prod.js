
// Getting merge and common

const merge = require( 'webpack-merge' ),
  common = require( './webpack.common.js' ),
  CleanWebpackPlugin = require( 'clean-webpack-plugin' );

module.exports = merge( common, {
	plugins: [
		new CleanWebpackPlugin( ['./dist/'] )
	],
  mode: 'production'
} );
