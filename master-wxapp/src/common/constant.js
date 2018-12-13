export const ApiProServer = "https://api.9999ax.com"
export const ApiDevServer = "https://m.api.9999ax.com"
export const ApiServer = global.process.env.NODE_ENV == "production" ? ApiProServer : ApiDevServer
export const IMGHOST = 'http://server.codecup.top:7001/'

export const WebUrl = "https://m.9999ax.com"
// export const WebUrl = "http://localhost:3000"