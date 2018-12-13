import { ApiServer } from './constant'
import { join } from '../libs/tools/func'


export const mUrl = (method, path) => {
    return {
        method, path, toString: () => join(ApiServer, path)
    }
}

export const common = {
    upload: {
        avatar: mUrl('post', '/file.avatar'),
        cert: mUrl('post', '/file.push'),
    }
}

export const user = {
    login: mUrl('post', '/user.login'),
    info: mUrl('post', '/user.update'),
    profile: mUrl('get', '/user/profile'),
    wxOpenid: mUrl('post', '/wechat.login'),
    signedInfo: mUrl('get', '/check/in/stat')
}

export const message = {
    count: mUrl('get', '/message/count')
}

// course
export const study = {
    courseList: mUrl('get', '/course')
}

// user  
export const ApiUserRefresh = mUrl('get', "/user/profile")

// master
export const master = {
    list: mUrl('get', '/user/master')
}

// sns
export const sns = {
    follow: {
        post: mUrl("post", "/sns/follow"),
        delete: mUrl("delete", "/sns/follow")
    }
}
//sys
export const sys = {
    category: {
        get: mUrl("get", "/sys/category")
    }
}

// home
export const ApiGetHomeData = mUrl('get', "/page/index")