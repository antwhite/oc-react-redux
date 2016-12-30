const path    = require('path'),
      fs      = require('fs'),
      webpack = require('webpack');


function getConfig(server) {

    function getExternals() {
        const externals = {};
        fs.readdirSync('node_modules')
            .filter(function(x) {
                return ['.bin'].indexOf(x) === -1;
            })
            .forEach(function(mod) {
                externals[mod] = mod;
            });

        externals['./package.json'] = 'commonjs ./package.json';
        externals['react-dom/server'] = 'react-dom/server';
        return externals;
    }


    let config = {
        entry: server ?
            {'counter/server': './src/components/counter/server'}
            : {'counter/content/client': './src/components/counter/client'},
        target: server ?
            'node'
            : 'web',
        externals: server ?
            getExternals()
            : {},
        output: {
            path: './build/components/',
            filename: '[name].js',
            libraryTarget: server ? 'commonjs2' : 'var'
        },
        module: {
            loaders: [
                {
                    test: /\.json$/,
                    exclude: /package\.json/,
                    loader: 'json'
                },
                {
                    test: /\.jsx$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: 'babel',
                    query: {
                        presets: ['es2015', 'react']
                    }
                },
            ]
        },
        resolve: {
            extensions: ['', '.jsx', '.js'],
        },
        plugins: [
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                output: {
                    comments: false
                },
                compress: {
                    warnings: false,
                    screw_ie8: true
                }
            }),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })
        ]
    };
    return config;
}


module.exports = [getConfig(true), getConfig(false)];