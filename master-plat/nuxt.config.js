const webpack = require('webpack')

module.exports = {
	/*
	** Headers of the page
	*/
	head: {
		title: '喔喔百家后台管理',
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
		vendor: ['element-ui', 'axios', '~/plugins/ax-utils']
	},
	css: [
		'element-ui/lib/theme-chalk/index.css',
		'@/assets/css/main.scss'
	],
	plugins: [{
		src: '~plugins/element-ui',
		ssr: true,
	}, {
		src: '~plugins/ckeditor',
		ssr: false,
	}, {
		src: '~plugins/component-plugin',
		ssr: false,
	}],
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
		imgBaseUrl: 'http://f1.9999ax.com/',
		// devBaseUrl: 'http://10.0.0.163:8338',
		devBaseUrl: 'https://api.9999ax.com',
		testBaseUrl: 'https://api.9999ax.com',
		prodBaseUrl: "https://api.9999ax.com",
	}
}

