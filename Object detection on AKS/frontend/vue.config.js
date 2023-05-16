module.exports = {
    publicPath: './',
    // outputDir:'dist',
    assetsDir:'assets',
    configureWebpack: {
        externals: { 
            'vue': 'Vue',
            'element-ui': 'ElementUI',
        },
        resolve: {
            alias: {
                'assets': '@/assets',
                'components': '@/components',
                'views': '@/views',
                'common': '@/common',
                'network': '@/network'
            }
        }
    },
    devServer: {
        open: true,
        proxy: {//解决跨域问题
            '/api': {
                // 此处的写法，目的是为了 将 /api 替换成 https://autumnfish.cn/
                target: 'http://localhost:8081',
                // 允许跨域
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/'
                }
            }
        }
    },
};