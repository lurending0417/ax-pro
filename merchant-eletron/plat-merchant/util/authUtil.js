// import baseUtil from "./baseUtil";

export default {
    _AUTHORIZED_OBJ: 'authorizedObj',
    createAuthorizedPages(trees) {
        let pagesArr = [];
        let crumbs = []; // 面包屑
        let tabsArr = [];
        let tabsAuthArr = [];
        let actionArr = []
        trees.forEach(pageGroup => {
            let treeObj = {
                // isShow: false
                isShow: true
            };
            treeObj.titleName = pageGroup.label;
            let children = [];
            pageGroup.children.forEach(page => {
                let crumbObj = {
                    pathname: page.uri,
                    rootName: pageGroup.label,
                    name: page.label
                };
                let uriArr = page.uri.split('/');
                let tabList = [];

                let tabObj = {
                    route: uriArr[2]
                };
                page.children.forEach(tab => {
                    let tabsAuthObj = {}
                    tabsAuthObj.pathname = page.uri;
                    tabsAuthObj.identity = tab.alias;
                    tabsAuthObj.titleName = tab.label;
                    tabList.push({
                        identity: tab.alias,
                        contentComponent: tab.uiComponent
                    })
                    tabsAuthArr.push(tabsAuthObj)
                    if (tab.children) {
                        tab.children.forEach(action => {
                            if (action.alias) {
                                actionArr.push({
                                    ...action,
                                    route: page.uri,
                                    identity: tab.alias
                                });
                            }
                        })
                    }
                })
                tabObj.children = tabList
                tabsArr.push(tabObj)
                children.push({
                    path: page.uri,
                    name: page.label
                });
                crumbs.push(crumbObj);
            })
            treeObj.children = children;
            pagesArr.push(treeObj);
        })
        this.setSessionStorage(pagesArr, tabsArr, tabsAuthArr, actionArr, crumbs)
    },
    setSessionStorage(pagesArr, tabsArr, tabsAuthArr, actionArr, crumbs) {
        // console.log('popopoppppppp');
        let obj = {}
        obj.page = pagesArr;
        obj.tab = tabsArr;
        obj.tabsAuth = tabsAuthArr;
        obj.actionArr = actionArr;
        obj.crumbs = crumbs;
        sessionStorage.setItem(this._AUTHORIZED_OBJ, JSON.stringify(obj))
    },
    deleteAuthorizedPages() {
        if (process.browser) {
            sessionStorage.removeItem(this._AUTHORIZED_OBJ)
        }
    },
    getAuthorizedPages() {
        if (process.browser) {
            return JSON.parse(sessionStorage.getItem(this._AUTHORIZED_OBJ))
        }
    },
    judgeAuthorizedAction(action) { // 判断是否有功能权限
        if (process.browser) {
            let bool = false;
            let arr = this.getAuthorizedPages().actionArr;
            for (let i = 0, j = arr.length; i < j; i++) {
                if (arr[i].alias === action) {
                    bool = true
                    break
                }
            }
            return bool
        }
    }
}
