import { observable, action } from "mobx"
import { persist } from "mobx-persist";
import { storageParse, storageRecover } from "../../../utils/storage"
import BaseStore from "../../../data/stores/BaseStore"
// import Pages from "../../../common/pages"
import { data } from "../../../common/tab"
import { query2Object } from "../../../utils/func";
import { NAV_INIT, HOME_ROUTE } from "../../../common/constant";

let id = 0
const genId = (path) => {
    const key = convertId(path) + "-" + (id++);
    return "navId-" + (key)
}

const convertId = (path) => {
    return path.replace(/\//g, "-")
    // let i = 0;
    // const len = path.length
    // let s = "";
    // while (i < len) {
    // 	s += path.charCodeAt(i++);
    // }
    // return s;
}

export const NavState = {
    init: 1,
    navTo: 0,
    backTo: 2
}



class NavStore extends BaseStore {
    constructor() {
        super();
        // 拦截 history
        if (process.browser) {
            window.addEventListener("popstate", () => {
                //doSomething
                if (this.state != NavState.backTo) {
                    this.backTo("", true)
                }
            }, false)
        }
    }

    setRoutes(pages) {
        this.pages = pages;
    }

    NAME = "NavStore"

    @observable redirect = "";
    currentPath = "";

    @observable currentRoute = ""
    @observable currentProps = "";

    @persist @observable locationUrl = ""
    isRooted = null;
    isInited = 0;

    pages = {}
    @observable routes = [];
    @observable backId = "";
    @observable state = NavState.init; // 1
    @observable currentId = "";

    @action
    async recovery(url, asyncProps = {}) {
        this.isInited = 1;
        let pn = "";
        if (process.browser) {
            url = location.search;
            pn = location.pathname
        }
        else {
            pn = url.replace(/\?.*/g, "")
        }
        // if (!url) {
        //     return;
        // }
        let ps = query2Object(url);
        ps = Object.assign({}, asyncProps, ps)

        pn = pn == "/" ? HOME_ROUTE : pn
        this.currentPath = pn;
        // console.log("current-path->" + pn)

        // 有重定向 则 直接 跳过去
        const { redirect, ...others } = ps;
        const newPath = redirect || pn;

        if (process.browser) {
            requestAnimationFrame(() => {
                this.backTabCheck(this.currentRoute || this.currentPath)
            })
        }

        if (newPath == this.currentRoute) {
            return;
        }
        this.currentProps = others;
        this.currentRoute = redirect || pn;
        this.routes = [this.getRoute(this.currentRoute, others, null, true)]


    }

    getRoute(path, props = {}, id = null, isInit) {
        const Pages = this.pages;
        return {
            routeName: path,
            component: Pages[path],
            props: props,
            navProps: Pages[path].navProps && Pages[path].navProps(props) || null,
            id: isInit ? "init-navable" : (id || genId(path)),
            showBack: Pages[path].navProps && Pages[path].navProps.showBack ? (Pages[path].navProps.showBack === false ? false : true) : true,
            hiddenTitleBorder: Pages[path].hiddenTitleBorder === true ? true : false
        }
    }


    @action
    push(path, comp) {
        // 加载首页
        this.pages[path] = comp;

        // 如果current 不为空 跳转到 current
        // const currentUrl=this.locationUrl||location.href;
        if (NAV_INIT == "jump" && process.browser && location.search == "") {
            const currentRoute = sessionStorage.getItem("currentRoute")
            if (currentRoute) {
                let ps = sessionStorage.getItem("currentProps");
                try {
                    ps = ps && JSON.parse(ps) || {}
                    ps = storageRecover(ps)
                }
                catch (e) {
                    ps = {}
                }
                if (location.pathname != currentRoute) {
                    setTimeout(() => {
                        // console.log("<>" + currentRoute);
                        this.navTo(currentRoute, ps);
                        this.backTabCheck && this.backTabCheck(currentRoute)
                    }, 150)
                }

            }
        }
        let props = {};

        // 第一次 直接从 query 里面获取属性
        if (process.browser) {
            props = query2Object(location.search.substr(1));
        }

        this.navTo(path, props, null, true)
    }

    closeModal() {
        if (typeof $ === "undefined")
            return;
        $.closeModal();
    }

    has(path) {
        const id = path[0] == "#" ? path.slice(1) : "";
        const index = id ? this.routes.findIndex(item => item.id == id) : this.routes.findIndex(item => item.routeName == path)
        return index != -1
    }

    @action
    navTo(path, props, id) {
        this.state = NavState.navTo
        if (/\?/.test(path)) {
            const query = path.slice(path.indexOf("?") + 1);
            query.split("&").forEach(key => {
                const ks = key.split("=");
                if (ks.length >= 2) {
                    props[ks[0]] = ks.slice(1).join("=")
                }
            })
        }

        // 存到session storage 里面 则刷新 也可以重现
        if (process.browser) {
            sessionStorage.setItem("currentProps", storageParse(props && JSON.stringify(props) || "{}"))
            sessionStorage.setItem("currentRoute", path)
        }



        this.closeModal()


        this.routes.push(this.getRoute(path, props, id, false))

        this.currentRoute = path;
        this.currentProps = props;

        this.currentId = this.routes.slice(-1)[0].id;

        if (process.browser) {
            requestAnimationFrame(() => {
                this.backTabCheck(this.currentRoute || this.currentPath)
            })
        }
    }

    @action
    backTo(path, force = false) {
        if (!force)
            this.state = NavState.backTo

        let len;
        if (!path) {
            len = this.routes.length - 1;
            if (!len) {
                // 退无可退
                location.href = "/"
                return
            }

            this.backId = "#" + this.routes[len - 1].id;
        }
        else {
            const id = path[0] == "#" ? path.slice(1) : "";
            const index = id ? this.routes.findIndex(item => item.id == id) : this.routes.findIndex(item => item.routeName == path)
            if (index != -1) {
                len = index + 1;
                this.backId = "#" + this.routes[index].id;

            }
            else {
                return this.navTo(path);
            }
        }
        this.currentId = this.routes[len - 1].id;

        // console.log(this.backId);


        this.closeModal();

        // console.log(this.backId)

        this.currentProps = this.routes[len - 1].props && JSON.stringify(this.routes[len - 1].props);
        this.currentRoute = this.routes[len - 1].routeName;

        // 存到session storage 里面 则刷新 也可以重现
        if (process.browser) {
            sessionStorage.setItem("currentProps", storageParse(this.currentProps || "{}"))
            sessionStorage.setItem("currentRoute", path)
        }

        if (!force) // 浏览器的后退
            $.router.backTo(this.backId || "")

        setTimeout(() => {
            this._backState(len);
        }, 250)
    }

    @action
    _backState(len) {
        // 触发页面级别的rerender
        if (this.routes[len - 1])
            this.backTabCheck && this.backTabCheck(this.routes[len - 1].routeName)
        if (this.backId) {
            // 检测意外
            const cp = $(".pages page-current");
            if (!cp[0]) {
                $(this.backId).addClass("page-current")
            }
        }
        this.backId = "";
        this.routes.length = len;
    }

    @action
    resetState() {
        this.state = NavState.init;
    }

    @action
    setNavProps(route, navProps) {
        if (!route) {
            route = this.routes.slice(-1)[0];
        }
        route.navProps = Object.assign({}, route.navProps, navProps);
    }

    @action
    setProps(route, ps) {
        if (!route) {
            route = this.routes.slice(-1)[0];
        }
        route.props = Object.assign({}, route.props, ps);
    }
}


export default new NavStore();
