const withSass = require("@zeit/next-sass")
const webpack = require("webpack")

module.exports = withSass({
	webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
		// loaders
		config.module.rules.push(
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 102400,
							fallback: "file-loader",
							publicPath: "/_next/static/images",
							outputPath: "./static/images/",
							name: "[name]-[hash].[ext]"
						}
					}
				]
			}
		)

		config.module.rules.push(
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				use: {
					loader: "svg-react-loader",
					options: {
						tag: "symbol",
						attrs: {
							title: "example"
						},
						name: "MyIcon",
						svgo: {
							plugins: [
								{ removeTitle: false }
							],
							floatPrecision: 2
						}
					}
				}
			}
		)

		// plugins
		if (!isServer)
			config.plugins.push(new webpack.IgnorePlugin(/^request$/))
		return config
	},
	publicRuntimeConfig: { // Will be available on both server and client
		staticFolder: "/static"
	}
});
