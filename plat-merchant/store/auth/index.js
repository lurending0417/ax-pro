import api from '~/api'

export default {
    namespaced: true,
    state: {
        authActionTree: [], // 功能树
        authPageTree: [], // 页面树
        tabsAuth: [],
        auth: [],
        currPathname: '',
        currTabIndex: 0
    },
    getters: {
        getCurrTabIndex: state => {
            return state.currTabIndex
        },
        getAuthActionTree: state => state.authActionTree,
        getAuthPageTree: state => state.authPageTree
    },
    mutations: {
        updatePathname(state) {
            if (process.browser) state.currPathname = location.pathname
        },
        resetAuthActionTree(state, authActionTree) {
            state.authActionTree = authActionTree
        },
        resetAuthPageTree(state, authPageTree) {
            state.authPageTree = authPageTree
        },
        resetCurrTabIndex(state, currTabIndex) {
            state.currTabIndex = currTabIndex
        }
    },
    actions: {
        // 功能模块
        apiGetAuthActionTree({state, commit}, obj) {
            api.request({
                url: api.consts._AUTH_ACTION_TREE_GET,
                params: {},
                success(data) {
                    console.log('功能模块', data)
                    commit('resetAuthActionTree', data.rows)
                    obj.callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddAuthAction({state, commit}, obj) { // 添加权限功能
            api.request({
                url: api.consts._AUTH_ACTION_GROUP_POST_GET,
                method: 'post',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteAuthAction({state, commit}, obj) { // 删除权限功能
            api.request({
                url: api.consts._AUTH_ACTION_GROUP_DELETE_GET_MODIFY,
                method: 'delete',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetAuthAction({state, commit}, obj) { // 获取权限功能
            api.request({
                url: api.consts._AUTH_ACTION_GROUP_DELETE_GET_MODIFY,
                method: 'get',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiModifyAuthAction({state, commit}, obj) { // 修改权限功能
            api.request({
                url: api.consts._AUTH_ACTION_GROUP_DELETE_GET_MODIFY,
                method: 'put',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddAction({state, commit}, obj) { // 添加功能
            api.request({
                url: api.consts._AUTH_ACTION_POST_GET,
                method: 'post',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteAction({state, commit}, obj) { // 删除功能
            api.request({
                url: api.consts._AUTH_ACTION_DELETE_GET_MODIFY,
                method: 'delete',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetAction({state, commit}, obj) { // 获取功能
            api.request({
                url: api.consts._AUTH_ACTION_DELETE_GET_MODIFY,
                method: 'get',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiModifyAction({state, commit}, obj) { // 修改功能
            api.request({
                url: api.consts._AUTH_ACTION_DELETE_GET_MODIFY,
                method: 'put',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback()
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        // 页面模块
        apiGetAuthPageTree({state, commit}) {
            api.request({
                url: api.consts._AUTH_PAGE_GET,
                params: {},
                success(data) {
                    console.log(data)
                    commit('resetAuthPageTree', data.rows)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddAuthPageGroup({state, commit}, obj) { // 添加页面分组结构
            api.request({
                url: api.consts._AUTH_PAGE_GROUP_GET,
                method: 'post',
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    commit('resetAuthPageTree', data.rows)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetAuthPageGroup({state, commit}, obj) { // 获取页面分组结构
            api.request({
                url: api.consts._AUTH_PAGE_GROUP_DELETE_PUT_GET,
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiModifyAuthPageGroup({state, commit}, obj) { // 修改页面分组结构
            api.request({
                url: api.consts._AUTH_PAGE_GROUP_DELETE_PUT_GET,
                method: 'put',
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteAuthPageGroup({state, commit}, obj) { // 删除页面分组结构
            api.request({
                url: api.consts._AUTH_PAGE_GROUP_DELETE_PUT_GET,
                method: 'delete',
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteAuthPage({state, commit}, obj) { // 删除页面
            api.request({
                url: api.consts._AUTH_PAGE_DELETE_PUT_GET,
                method: 'delete',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetAuthPage({state, commit}, obj) { // 获取页面
            api.request({
                url: api.consts._AUTH_PAGE_DELETE_PUT_GET,
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiModifyAuthPage({state, commit}, obj) { // 修改页面
            api.request({
                url: api.consts._AUTH_PAGE_DELETE_PUT_GET,
                method: 'put',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiDeleteAuthTab({state, commit}, obj) { // 删除选项卡
            api.request({
                url: api.consts._AUTH_TAB_DELETE_PUT_GET,
                method: 'delete',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetAuthTab({state, commit}, obj) { // 获取选项卡
            api.request({
                url: api.consts._AUTH_TAB_DELETE_PUT_GET,
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiModifyAuthTab({state, commit}, obj) { // 修改选项卡
            api.request({
                url: api.consts._AUTH_TAB_DELETE_PUT_GET,
                method: 'put',
                params: {...obj.params},
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddAuthPage({state, commit}, obj) { // 添加页面分组结构
            api.request({
                url: api.consts._AUTH_PAGE_POST_GET,
                method: 'post',
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiAddAuthTab({state, commit}, obj) { // 添加选项卡
            api.request({
                url: api.consts._AUTH_TAB_POST_GET,
                method: 'post',
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiGetAuthPageAction({state, commit}, obj) {
            api.request({
                url: api.consts._AUTH_PAGE_ACTION_POST_GET,
                method: 'get',
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    obj.callback(data.result)
                },
                fail(error) {
                    alert(error.message)
                }
            })
        },
        apiPostAuthPageAction({state, commit}, obj) {
            api.request({
                url: api.consts._AUTH_PAGE_ACTION_POST_GET,
                method: 'post',
                params: {
                    ...obj.params
                },
                success(data) {
                    console.log(data)
                    obj.callback(data)
                },
                fail(error) {
                    obj.callback(error)
                    alert(error.message)
                }
            })
        }
    }
}
