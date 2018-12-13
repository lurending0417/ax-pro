// import {baseUtil, browserUtil} from '~/util'
export default function (context) {
    // 给上下文对象增加 userAgent 属性（增加的属性可在 `asyncData` 和 `fetch` 方法中获取）
    // console.log(context);
    console.log(context.route.path);
    if (context.route.path === '/') {
        // baseUtil.deleteMetadata();
        // baseUtil.deleteBasicInfo();
        // browserUtil.deleleteCookie('access-token');
    }

    context.userAgent = context.isServer ? context.req.headers['user-agent'] : navigator.userAgent;
}
