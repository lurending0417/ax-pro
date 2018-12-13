export default class URL {

    constructor(method, url) {
        this.method = method;
        this.url = url;
    }

    getUrl() {
        return this.url;
    }

    getMethod() {
        return this.method;
    }

    toString() {
        // 处理 BaseURL
        let env = process.env.NODE_ENV || '', baseUrl = '';
        switch (env) {
            case 'dev': {
                baseUrl = process.env.devBaseUrl;
                break;
            }
            case 'test': {
                baseUrl = process.env.testBaseUrl;
                break;
            }
            case 'production': {
                baseUrl = process.env.prodBaseUrl;
                break;
            }
            default: {
                throw Error('不匹配的运行环境：' + env);
            }
        }
        return baseUrl + this.url;
    }


}


