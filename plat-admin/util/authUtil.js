import baseUtil from "./baseUtil";

export default {


    isAuthorized(path) {

        // // 登录页面是开放访问的，任何时候都可以直接访问
        if (path === "/") {
            return true;
        }

        if (!this.checkLogin()) {
            return false;
        }

        // 理论上下面注释掉的这两行才是真正判定是否有权限访问，现在先直接返回true
        // var authorizedUris = baseUtil.getMetadata().authorizedUris || [];
        // return authorizedUris.indexOf(path) != -1;

        return true;
    },

    _authorizedPages: null,

    _authorizedTabs: null,

    getAuthorizedPages() {

        // if (!this._authorizedPages) {
        //     return this._authorizedPages;
        // }
        //
        //
        // this._authorizedPages = [];
        // this._authorizedTabs = {};
        //
        // baseUtil.getBasicInfo().authorizedPages.forEach((pageGroup) => {
        //
        //     let sub = [];
        //     pageGroup.children.forEach((page) => {
        //         sub.push({
        //             name: page.label,
        //             route: page.uri
        //         });
        //         let tabs = [];
        //         if (page.children && baseUtil.detectors.isArray(page.children)) {
        //             page.children.forEach((tab) => {
        //                 tabs.push({
        //                     name: tab.label,
        //                     alias: tab.alias,
        //                     component: tab.uiComponent
        //                 });
        //             });
        //         }
        //         this._authorizedTabs[page.uri] = tabs;
        //     });
        //
        //     this._authorizedPages.push({
        //         name: pageGroup.label,
        //         route: '',
        //         icon: pageGroup.icon || 'el-icon-sold-out',
        //         sub: sub
        //     });
        //
        // });


        return [{
            name: '商户管理',
            route: '/merchant',
            icon: 'el-icon-location',
            sub: [{
                name: '商户管理',
                route: '/merchant/merchant'
            }]
        }, {
            name: '用户中心',
            route: '/user',
            icon: 'el-icon-menu',
            sub: [{
                name: '用户列表',
                route: '/user/user'
            }]
        }, {
            name: '短信管理',
            route: '/sms',
            icon: 'el-icon-service',
            sub: [{
                name: '短信模板',
                route: '/sms/template'
            }, {
                name: '短信管理',
                route: '/sms/sms'
            }, {
                name: '网关账户',
                route: '/sms/gatewayAccount'
            }, {
                name: '网关日志',
                route: '/sms/gatewayRecord'
            }]
        }, {
            name: '实物黄金',
            route: '/physical',
            icon: 'el-icon-sold-out',
            sub: [{
                name: '金条定义',
                route: '/physical/gold'
            }, {
                name: '提金订单',
                route: '/physical/goldBill'
            }]
        }, {
            name: '财务中心',
            route: '/finance',
            icon: 'el-icon-tickets',
            sub: [{
                name: '现金统计',
                route: '/finance/cash'
            }, {
                name: '订单统计',
                route: '/finance/lease'
            }, {
                name: '收入统计',
                route: '/finance/income'
            }, {
                name: '押金统计',
                route: '/finance/deposit'
            }, {
                name: '黄金统计',
                route: '/finance/gold'
            }, {
                name: '钱包统计',
                route: '/finance/wallet'
            }]
        }, {
            name: '独立页面',
            route: '/page',
            icon: 'el-icon-tickets',
            sub: [{
                name: '首页管理',
                route: '/page/index'
            }]
        }, {
            name: '系统配置',
            route: '/config',
            icon: 'el-icon-setting',
            sub: [{
                name: '基本资料',
                route: '/config/meta'
            }, {
                name: '权限管理',
                route: '/config/auth'
            }]
        }];
    },


    getAuthorizedTabs(router) {
        // if (!this._authorizedTabs) {
        //     this.getAuthorizedPages();
        //     return this.getAuthorizedTabs(router);
        // }
        // return this._authorizedTabs[router] || [];

        switch (router) {
            case "/merchant/merchant": {
                return [{
                    name: '商户管理',
                    alias: 'merchant',
                    component: 'Merchant'
                }, {
                    name: '门店管理',
                    alias: 'store',
                    component: 'Store'
                }, {
                    name: '试戴订单',
                    alias: 'leaseRecord',
                    component: 'LeaseRecord'
                }, {
                    name: '任务调度',
                    alias: 'job',
                    component: 'Job'
                }]
            }
            case "/user/user": {
                return [{
                    name: '用户管理',
                    alias: 'user',
                    component: 'User'
                }]
            }
            case "/sms/gatewayAccount": {
                return [{
                    name: '网关账户',
                    alias: 'smsGatewayAccount',
                    component: 'SmsGatewayAccount'
                }, {
                    name: '路由规则',
                    alias: 'smsGatewayRouter',
                    component: 'SmsGatewayRouter'
                }]
            }
            case "/sms/template": {
                return [{
                    name: '短信模板',
                    alias: 'smsTemplate',
                    component: 'SmsTemplate'
                }]
            }
            case "/sms/sms": {
                return [{
                    name: '验证码短信',
                    alias: 'randSms',
                    component: 'RandSms'
                }, {
                    name: '模板短信',
                    alias: 'templateSms',
                    component: 'TemplateSms'
                }]
            }
            case "/sms/gatewayRecord": {
                return [{
                    name: '网关日志',
                    alias: 'smsGatewayRecord',
                    component: 'SmsGatewayRecord'
                }]
            }
            case "/physical/gold": {
                return [{
                    name: '黄金金条',
                    alias: 'physicalGold',
                    component: 'PhysicalGold'
                }]
            }
            case "/physical/goldBill": {
                return [{
                    name: '提金订单',
                    alias: 'physicalGoldBill',
                    component: 'PhysicalGoldBill'
                }]
            }
            case "/finance/cash": {
                return [{
                    name: '现金统计',
                    alias: 'cashStat',
                    component: 'CashStat'
                }, {
                    name: '资金日统计',
                    alias: 'cashDailyStat',
                    component: 'CashDailyStat'
                }, {
                    name: '用户钱包',
                    alias: 'userWalletStat',
                    component: 'UserWalletStat'
                }, {
                    name: '商户钱包',
                    alias: 'merchantWalletStat',
                    component: 'MerchantWalletStat'
                }, {
                    name: '提现记录',
                    alias: 'withdrawRecord',
                    component: 'WithdrawRecord'
                }, {
                    name: '线下充值记录',
                    alias: 'rechargeWalletOffline',
                    component: 'RechargeWalletOffline'
                }]
            }
            case "/finance/lease": {
                return [{
                    name: '订单统计',
                    alias: 'leaseStat',
                    component: 'LeaseStat'
                }]
            }
            case "/finance/income": {
                return [{
                    name: '收入统计',
                    alias: 'incomeStat',
                    component: 'IncomeStat'
                }]
            }
            case "/finance/deposit": {
                return [{
                    name: '押金统计',
                    alias: 'depositStat',
                    component: 'DepositStat'
                }]
            }
            case "/finance/gold": {
                return [{
                    name: '黄金统计',
                    alias: 'goldStat',
                    component: 'GoldStat'
                }]
            }
            case "/finance/wallet": {
                return [{
                    name: '钱包统计',
                    alias: 'walletStat',
                    component: 'WalletStat'
                }]
            }
            case "/page/index": {
                return [{
                    name: '首页BANNER',
                    alias: 'indexBanner',
                    component: 'IndexBanner'
                }, {
                    name: '首页场景',
                    alias: 'indexScene',
                    component: 'IndexScene'
                }]
            }
            case "/config/meta": {
                return [{
                    name: '材质管理',
                    alias: 'metal',
                    component: 'Metal'
                }, {
                    name: '宝石管理',
                    alias: 'gem',
                    component: 'Gem'
                }, {
                    name: '品类管理',
                    alias: 'category',
                    component: 'Category'
                }, {
                    name: '工艺管理',
                    alias: 'craft',
                    component: 'Craft'
                }, {
                    name: '租金规则',
                    alias: 'rentRule',
                    component: 'RentRule'
                }]
            }
            case "/config/auth": {
                return [{
                    name: '接口功能管理',
                    alias: 'actionTree',
                    component: 'ActionTree'
                }, {
                    name: '商户页面管理',
                    alias: 'pageTree',
                    component: 'PageTree'
                }, {
                    name: '商户角色模板',
                    alias: 'roleTpl',
                    component: 'RoleTplTree'
                }, {
                    name: '商户岗位模板',
                    alias: 'dutyTpl',
                    component: 'DutyTpl'
                }, {
                    name: '平台页面管理',
                    alias: 'adminPageTree',
                    component: 'AdminPageTree'
                }, {
                    name: '平台角色管理',
                    alias: 'adminRoleTree',
                    component: 'AdminRoleTree'
                }, {
                    name: '平台用户管理',
                    alias: 'platEmployee',
                    component: 'PlatEmployee'
                }]
            }
            default: {
                return [{
                    name: "fallback",
                    alias: "fallback",
                    component: 'fallback'
                }];
            }
        }

    },

    checkLogin() {
        if (!process.browser) {
            return true;
        }
        let token = baseUtil.getAccessToken();
        return typeof(token) === 'string' && token.length > 0;
    }

}
