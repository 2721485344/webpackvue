const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
    // const ExtractPlugin = require('extract-text-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development'

const config = {
    target: 'web',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        filename: 'bundle.js',
        // filename:'bundle.[hash:8].js' 生产环境
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: __dirname + 'node_modules',
                include: __dirname + 'src',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-proposal-object-rest-spread']
                }
            },
            {
                test: /\.styl/,
                //开发环境
                use: [
                        'style-loader',
                        {
                            //生成sourceMap 编译速度快，生成效率高 如果前面生成的用，直接使用前面的。
                            loader: 'postcss-loader',
                            options: {
                                // importLoaders: 1,
                                sourceMap: true
                            }
                        },
                        'stylus-loader'
                    ]
                    //生产环境
                    // use: ExtractPlugin.extract({
                    //     fallback: 'style-loader',
                    //     use: [
                    //         'css-loader',
                    //         {
                    //             loader: 'postcss-loader',
                    //             options: {
                    //                 sourceMap: true,
                    //             }
                    //         },
                    //         'stylus-loader'
                    //     ]
                    // })
            },

            // {
            //     test: /\.css$/,
            //     //这里用数组方式或者loader字符串连接方式都可以
            //     use: [
            //         'style-loader',
            //         'css-loader?importLoaders=1', //对于css中@import进来的css同样做前缀处理
            //         'postcss-loader'
            //     ]
            // },
            //当图片大小小于1024的时候图片就会转化成base64代码
            {
                test: /\.(gif|jpg|png|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        // ext 文件的扩展名aa名字
                        name: '[name]-aa.[ext]'
                    }
                }, ]
            }
        ]
    },
    plugins: [
            require('postcss-import'),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: isDev ? '"development"' : '"production"'
                }
            }),
            new HtmlWebpackPlugin()
        ]
        // plugins: [
        //     require('postcss-import'), //需要安装 npm install postcss-import --save-dev,这句代码是会对一个js文件里面import进来的多个css放在同一个style里面，如果是多个文件引入就会生成多个
        //     // require('autoprefixer')({
        //     //     broswers: ['>1%', 'last 5 versions', 'Firefox ESR', 'not ie < 9']
        //     // })
        //     //  new HtmlWebpackPlugin({ template: './src/index.html' })
        //     new HtmlWebpackPlugin()
        // ]



}

// const isDev = config.mode === '"development"'

if (isDev) {
    config.devtool = '#cheap-module-eval-source-map' //代码映射到浏览器中效率高，准确性高
    config.devServer = {
        contentBase: path.join(__dirname, './dist'),
                open: true, // 是否打开页面 
        port: 8383,
        host: '192.168.30.1',
        //  proxy: { //一会启动 8880 的server 可以使用8880也可以系统9000访问；如果不是代理的话就会涉及跨域
        //                  '/api/*': {                 target: 'http://localhost1:8880',        }       },
        overlay: {
            errors: true,
        },
        hot: true //修改代码及时显示
    }
    config.plugins.push( //增加的插件
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    )
} else {
    // config.output.filename='[name].[chunkhash:8].js' 生产环境  分开打包，静态的代码，业务代码(更新迭代高)。
    //    config.entry={
    //        app:path.join(__dirname,'src/index.js'),
    //        vendor:['vue']
    //    }
    config.devtool = '#cheap-module-eval-source-map' //代码映射到浏览器中效率高，准确性高
    config.devServer = {
        contentBase: path.join(__dirname, './dist'),
                open: true,
        port: 8080,
        host: '192.168.30.1',
        //  proxy: { //一会启动 8880 的server 可以使用8880也可以系统9000访问；如果不是代理的话就会涉及跨域
        //                  '/api/*': {                 target: 'http://localhost2:8880',      }         },
        overlay: {
            errors: true,
        },
        hot: true
    }
    config.plugins.push( //增加的插件
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // contentHash生产 不同的hash
        // Hash 打包处来的模块是一个hash
        // new ExtractPlugin('styles.[contentHash:8].css') 生产环境
        //    new webpack.optimize.CommonsChunkPlugin({
        //        name:'vendor'
        //    })
        // webpack 单独打包到一个文件中顺序不能变name:'vendor'
        // new webpack.optimize.commonsChunkPlugin({
        //     name:'runtime'
        // })
    )
}

module.exports = config