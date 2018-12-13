const webpack = require('webpack')

module.exports = {
    head: {
        title: '易戴易美 - 平台管理',
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: 'https://static.9999ax.com/share-icon.png'}
        ]
    },
    css: [
        {src: 'element-ui/lib/theme-chalk/index.css'},
        {src: '~/common/css/style.css'}
    ],
    loading: {color: '#3B8070'},
    build: {
        extend(config, {isDev, isClient}) {
            if (isDev && isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
        },
        plugins: [
            new webpack.EnvironmentPlugin(['NODE_ENV'])
        ],
        vendor: ['axios', 'element-ui', '~/plugins/ax-utils'],
        extractCSS: true
    },
    plugins: [
        {src: '~/plugins/element-ui', ssr: true},
        {src: '~/plugins/ax-components', ssr: true}
    ],
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
    env: {
        devBaseUrl: 'http://10.0.0.163:8838',
        // devBaseUrl: 'https://t-gw.9999ax.com',
        testBaseUrl: 'https://t-gw.9999ax.com',
        prodBaseUrl: "https://gw.9999ax.com",
    }


};
