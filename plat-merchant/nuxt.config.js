const webpack = require('webpack')
module.exports = {
    dev: (process.env.PLAT_ENV !== 'prod'),
    /*
    ** Headers of the page
    */
    head: {
        title: 'vue-framework',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: 'Nuxt.js project'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    /*
    ** Customize the progress bar color
    */
    loading: {color: '#3B8070'},
    /*
    ** Build configuration
    */
    build: {
        /*
        ** Run ESLint on save
        */
        extend (config, ctx) {
            if (ctx.dev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        },
        plugins: [
            new webpack.EnvironmentPlugin(['PLAT_ENV'])
        ],
        /*
        ** 提出公共js库和css
        */
        vendor: ['axios', 'bootstrap-vue', './common/css/commonCss.js'],
        /*
        ** 抽出css
        */
        extractCSS: true,
        /*
        ** 定义抽取css的名称
        */
        filenames: {
            css: '[name].[contenthash:10].css'
        }
    },
    router: {
        middleware: ['auth'],
        extendRoutes(routes, resolve) {
            routes.push({
                name: 'custom',
                path: '/*',
                component: resolve("pages", '_id.vue')
            })
        }
    },
    plugins: [
        {src: '~plugins/bootstrap-vue', ssr: false},
        {src: '~plugins/plain-alert-box', ssr: false},
        {src: '~plugins/vue-highcharts.js', ssr: false },
        {src: '~plugins/util', ssr: false},
        {src: '~plugins/vue-sweetalert', ssr: false}
    ],
    env: {
        // localBaseUrl: 'http://127.0.0.1:3002',
        // devBaseUrl: 'http://10.0.0.163:8838',
        // devBaseUrl: 'https://gw.9999ax.com',
        devBaseUrl: 'https://t-gw.9999ax.com',
        testBaseUrl: 'https://t-gw.9999ax.com',
        imgBaseUrl: 'http://oj6xvatdi.bkt.clouddn.com/',
        prodBaseUrl: 'https://gw.9999ax.com'
    }
}
