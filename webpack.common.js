
// Getting all necessary loaders and plugins

const path = require( 'path' ),  
  HtmlWebpackPlugin = require( 'html-webpack-plugin' );

module.exports = {
  entry: {
    app: './src/main.js',
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [ 'html-loader' ]
      },
      {
        test: /[^_]\w+\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [ 'file-loader' ]
      }
    ]
  },
  plugins: [    
    new HtmlWebpackPlugin( {
      title: 'Plugin Output',
      template: 'src/index.html',
      inject: false
    } )
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve( __dirname, 'dist' )
  }
}
