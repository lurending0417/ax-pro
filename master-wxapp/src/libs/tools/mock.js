// import _each from "lodash/forEach";
// const mock = process.browser && process.env.NODE_ENV == "development" ? require("mockjs") : null;


// const mockFun = (mockDatas) => {
//     // 配置 模板数据
//     const rawFetch = fetch;

//     const newfetch = (url, opts = {}) => {
//         let m = opts.method && opts.method.toLowerCase() || "";
//         m = m == "get" ? "" : m;

//         const key = url.replace(/\?.*/g, "") + (m ? ("-" + m) : "");

//         const rs = key in mockDatas ? mockDatas[key] : null;
//         if (rs) {
//             return Promise.resolve({
//                 text: () => new Promise(s => {
//                     setTimeout(() => {
//                         s(rs)
//                     }, 1500)
//                 })
//             })
//         }

//         return rawFetch(url, opts);
//     }

//     if (typeof global != 'undefined') {
//         // rn 微信小程序
//         global.fetch = newfetch
//     }
//     if (typeof window != 'undefined') {
//         // 浏览器
//         window.fetch = newfetch
//     }
// }

// export default mockFun;

// export const obj = (res) => {
//     return {
//         status: 200,
//         result: res
//     }
// }


// export const arr = (rows, total = 100) => {
//     return {
//         status: 200,
//         rows: rows,
//         total: 100
//     }
// }

// export const makArr = (num, template) => {
//     if (mock)
//         return mock.mock({
//             ["rows"]: _map(new Array(num), () => {
//                 return template();
//             }),
//             total: mock.Random.integer(15, 30)
//         })
// }