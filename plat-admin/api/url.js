import URL from "./UrlObject"

export default {
    user: {
        login: new URL("post", "/user/login"),
        logout: new URL("post", "/user/logout"),
        get: new URL("get", "/user/{userId}"),
        list: new URL("get", "/user/query"),
        employee: {
            list: new URL("get", "/user/platEmployee"),
            add: new URL("post", "/user/platEmployee"),
            edit: new URL("put", "/user/platEmployee/{employeeId}")
        }
    },
    account: {
        tran: new URL("get", "/account/tran"),
        list: new URL("get", "/account"),
        withdraw: {
            list: new URL("get", "/account/cash/withdraw"),
            get: new URL("get", "/account/cash/withdraw/{withdrawId}"),
            approve: new URL("post", "/account/cash/withdraw/approve"),
            decline: new URL("post", "/account/cash/withdraw/decline"),
            tran: new URL("get", "/account/cash/withdraw/{recordId}/tran"),
            transfer: new URL("post", "/account/cash/withdraw/transfer")
        },
        cash: {
            recharge: {
                list: new URL("get", "/account/cash/wallet/recharge"),
                offline: {
                    list: new URL("get", "/account/cash/wallet/recharge/offline"),
                    confirm: new URL("post", "/account/cash/wallet/recharge/offline/confirm")
                }
            },
        },
        gold: {
            price: new URL("get", "/account/gold/price"),
            encourage: {
                list: new URL("get", "/account/gold/encourage"),
                add: new URL("post", "/account/gold/encourage")
            }
        }
    },
    sms: {
        gateway: {
            account: {
                list: new URL("get", "/sms/gateway/account"),
                get: new URL("get", "/sms/gateway/account/{accountId}"),
                add: new URL("post", "/sms/gateway/account"),
                edit: new URL("put", "/sms/gateway/account/{accountId}"),
                del: new URL("delete", "/sms/gateway/account/{accountId}")
            },
            record: {
                list: new URL("get", "/sms/gateway/record")
            },
            router: {
                list: new URL("get", "/sms/gateway/router"),
                get: new URL("get", "/sms/gateway/router/{routerId}"),
                add: new URL("post", "/sms/gateway/router"),
                edit: new URL("put", "/sms/gateway/router/{routerId}"),
                del: new URL("delete", "/sms/gateway/router/{routerId}")
            }
        },
        template: {
            list: new URL("get", "/sms/template"),
            get: new URL("get", "/sms/template/{templateId}"),
            add: new URL("post", "/sms/template"),
            edit: new URL("put", "/sms/template/{templateId}"),
            del: new URL("delete", "/sms/template/{templateId}")
        },
        sms: {
            rand: {
                send: new URL("post", "/sms/sms/rand"),
                list: new URL("get", "/sms/sms/rand")
            },
            template: {
                list: new URL("get", "/sms/sms/template")
            }
        }
    },
    goods: {
        metal: {
            list: new URL("get", "/goods/metal"),
            get: new URL("get", "/goods/metal/{metalId}"),
            add: new URL("post", "/goods/metal"),
            edit: new URL("put", "/goods/metal/{metalId}"),
            del: new URL("delete", "/goods/metal/{metalId}")
        },
        gem: {
            list: new URL("get", "/goods/gem"),
            get: new URL("get", '/goods/gem/{gemId}'),
            add: new URL("post", "/goods/gem"),
            edit: new URL("put", "/goods/gem/{gemId}"),
            del: new URL("delete", "/goods/gem/{gemId}")
        },
        category: {
            list: new URL("get", "/goods/category"),
            get: new URL("get", "/goods/category/{categoryId}"),
            add: new URL("post", "/goods/category"),
            edit: new URL("put", "/goods/category/{categoryId}"),
            del: new URL("delete", "/goods/category/{categoryId}")
        },
        craft: {
            list: new URL("get", "/goods/craft"),
            get: new URL("get", '/goods/craft/{craftId}'),
            add: new URL("post", "/goods/craft"),
            edit: new URL("put", "/goods/craft/{craftId}"),
            del: new URL("delete", "/goods/craft/{craftId}")
        },
        property: {
            field: {
                list: new URL("get", "/goods/property/field/{type}/{targetId}"),
                get: new URL("get", "/goods/property/field/{fieldId}"),
                add: new URL("post", "/goods/property/field"),
                edit: new URL("put", "/goods/property/field/{fieldId}"),
                del: new URL("delete", "/goods/property/field/{fieldId}")
            }
        }
    },
    lease: {
        record: {
            list: new URL("get", "/lease/record"),
            get: new URL("get", "/lease/record/{recordId}"),
            leasing: new URL("post", "/lease/record/leasing")
        },
        rentRule: {
            list: new URL("get", "/lease/rentRule"),
            add: new URL("post", "/lease/rentRule"),
        }
    },
    merchant: {
        list: new URL("get", "/merchant"),
        get: new URL("get", "/merchant/{merchantId}"),
        add: new URL("post", "/merchant"),
        edit: new URL("post", "/merchant/edit"),
        account: {
            get: new URL("get", "/merchant/bankAccount"),
            edit: new URL("post", "/merchant/bankAccount")
        }
    },
    store: {
        list: new URL("get", "/store"),
        get: new URL("get", "/store/{storeId}"),
        add: new URL("post", "/store"),
        edit: new URL("put", "/store/{storeId}")
    },
    physical: {
        gold: {
            list: new URL("get", "/physical/gold"),
            get: new URL("get", "/physical/gold/{goldId}"),
            add: new URL("post", "/physical/gold"),
            edit: new URL("put", "/physical/gold/{goldId}"),
            del: new URL("delete", "/physical/gold/{goldId}"),
            bill: {
                list: new URL("get", "/physical/gold/bill"),
                get: new URL("get", "/physical/gold/bill/{billId}"),
                shippingOut: new URL("post", "/physical/gold/bill/shipping")
            }
        }
    },
    job: {
        scheduled: {
            list: new URL("get", "/job/scheduled"),
            add: new URL("post", "/job/scheduled"),
            edit: new URL("put", "/job/scheduled"),
            del: new URL("delete", "/job/scheduled/{jobClassName}"),
            pause: new URL("put", "/job/scheduled/pause"),
            pauseAll: new URL("put", "/job/scheduled/pause/all"),
            resume: new URL("put", "/job/scheduled/resume"),
            resumeAll: new URL("put", "/job/scheduled/resume/all")
        },
        toSchedule: new URL("get", "/job/toSchedule")
    },
    auth: {
        action: {
            tree: new URL("get", "/auth/action/tree"),
            add: new URL("post", "/auth/action"),
            edit: new URL("put", "/auth/action/{actionId}"),
            del: new URL("delete", "/auth/action/{actionId}"),
            group: {
                add: new URL("post", "/auth/action/group"),
                edit: new URL("put", "/auth/action/group/{groupId}"),
                del: new URL("delete", "/auth/action/group/{groupId}")
            }
        },
        page: {
            tree: new URL("get", "/auth/page/tree"),
            add: new URL("post", "/auth/page"),
            edit: new URL("put", "/auth/page/{pageId}"),
            del: new URL("delete", "/auth/page/{pageId}"),
            group: {
                add: new URL("post", "/auth/page/group"),
                edit: new URL("put", "auth/page/group/{groupId}"),
                del: new URL("delete", "auth/page/group/{groupId}")
            },
            tab: {
                add: new URL("post", "auth/page/tab"),
                edit: new URL("put", "auth/page/tab/{tabId}"),
                del: new URL("delete", "auth/page/tab/{tabId}")
            },
            action: {
                tree: new URL("get", "/auth/page/action"),
                add: new URL("post", "/auth/page/action")
            }
        },
        role: {
            tpl: {
                tree: new URL("get", "/auth/role/tpl/tree"),
                add: new URL("post", "/auth/role/tpl"),
                edit: new URL("put", "/auth/role/tpl/{tplId}"),
                del: new URL("delete", "/auth/role/tpl/{tplId}"),
                action: {
                    tree: new URL("get", "/auth/role/tpl/action/tree"),
                    add: new URL("post", "/auth/role/tpl/action"),
                },
            },
            group: {
                tpl: {
                    add: new URL("post", "/auth/role/group/tpl"),
                    edit: new URL("put", "/auth/role/group/tpl/{tplId}"),
                    del: new URL("delete", "/auth/role/group/tpl/{tplId}"),
                },
            }
        },
        duty: {
            tpl: {
                list: new URL("get", "/auth/duty/tpl"),
                get: new URL("get", "/auth/duty/tpl/{tplId}"),
                add: new URL("post", "/auth/duty/tpl"),
                edit: new URL("put", "/auth/duty/tpl/{tplId}"),
                del: new URL("delete", "/auth/duty/tpl/{tplId}"),
                role: {
                    tree: new URL("get", "/auth/duty/tpl/role/tree"),
                    add: new URL("post", "/auth/duty/tpl/role"),
                }
            }
        },
        admin: {
            page: {
                tree: new URL("get", "/auth/admin/page/tree"),
                add: new URL("post", "/auth/admin/page"),
                edit: new URL("put", "/auth/admin/page/{pageId}"),
                del: new URL("delete", "/auth/admin/page/{pageId}"),
                group: {
                    add: new URL("post", "/auth/admin/page/group"),
                    edit: new URL("put", "auth/admin/page/group/{groupId}"),
                    del: new URL("delete", "auth/admin/page/group/{groupId}")
                },
                tab: {
                    add: new URL("post", "auth/admin/page/tab"),
                    edit: new URL("put", "auth/admin/page/tab/{tabId}"),
                    del: new URL("delete", "auth/admin/page/tab/{tabId}")
                },
                action: {
                    tree: new URL("get", "/auth/admin/page/action"),
                    add: new URL("post", "/auth/admin/page/action")
                }
            },
            role: {
                tree: new URL("get", "/auth/admin/role/tree"),
                add: new URL("post", "/auth/admin/role"),
                edit: new URL("put", "/auth/admin/role/{roleId}"),
                del: new URL("delete", "/auth/admin/role/{roleId}"),
                action: {
                    tree: new URL("get", "/auth/admin/role/action/tree"),
                    add: new URL("post", "/auth/admin/role/action"),
                },
                group: {
                    add: new URL("post", "/auth/admin/role/group"),
                    edit: new URL("put", "/auth/admin/role/group/{groupId}"),
                    del: new URL("delete", "/auth/admin/role/group/{groupId}"),
                }
            }
        }
    },
    report: {
        finance: {
            cash: {
                stat: new URL("get", "/report/finance/cash/stat"),
                daily: new URL("get", "/report/finance/cash/stat/daily")
            },
            deposit: {
                stat: new URL("get", "/report/finance/deposit/stat")
            },
            gold: {
                stat: new URL("get", "/report/finance/gold/stat")
            },
            income: {
                stat: new URL("get", "/report/finance/income/stat")
            },
            lease: {
                stat: new URL("get", "/report/finance/lease/stat"),
                detail: new URL("get", "/report/finance/lease/detail")
            },
            wallet: {
                stat: new URL("get", "/report/finance/wallet/stat"),
                user: new URL("get", "/report/finance/wallet/stat/user"),
                merchant: new URL("get", "/report/finance/wallet/stat/merchant")
            }
        }
    },
    history: {
        list: new URL("get", "/history/{entityId}")
    },
    page: {
        index: {
            banner: {
                list: new URL("get", "/page/index/banner"),
                get: new URL("get", "/page/index/banner/{bannerId}"),
                add: new URL("post", "/page/index/banner"),
                edit: new URL("post", "/page/index/banner/edit"),
                del: new URL("delete", "/page/index/banner/{bannerId}")
            },
            scene: {
                list: new URL("get", "/page/index/scene"),
                get: new URL("get", "/page/index/scene/{sceneId}"),
                add: new URL("post", "/page/index/scene"),
                edit: new URL("put", "/page/index/scene/{sceneId}"),
                del: new URL("delete", "/page/index/scene/{sceneId}"),
                banner: {
                    list: new URL("get", "/page/index/scene/banner"),
                    get: new URL("get", "/page/index/scene/banner/{bannerId}"),
                    add: new URL("post", "/page/index/scene/banner"),
                    edit: new URL("post", "/page/index/scene/banner/edit"),
                    del: new URL("delete", "/page/index/scene/banner/{bannerId}")
                },
                content: {
                    list: new URL("get", "/page/index/scene/content"),
                    get: new URL("get", "/page/index/scene/content/{contentId}"),
                    add: new URL("post", "/page/index/scene/content"),
                    edit: new URL("post", "/page/index/scene/content/edit"),
                    del: new URL("delete", "/page/index/scene/content/{contentId}")
                },
                storage: {
                    list: new URL("get", "/page/index/scene/storage"),
                    add: new URL("post", "/page/index/scene/storage"),
                    del: new URL("delete", "/page/index/scene/storage/{storageId}")
                },
            }
        }
    },
    file: {
        get: new URL("get", "/file")
    }

}
