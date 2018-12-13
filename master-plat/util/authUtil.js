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
        return [{
			route: '/affair',
			name: '业务管理',
			icon: 'el-icon-location',
			sub: [{
				route: '/affair/course',
				name: '课程'
			}, {
				route: '/affair/question',
				name: '解惑'
			}, {
				route: '/affair/meet',
				name: '约见'
			}]
		}, {
			route: '/client',
			name: '用户管理',
			icon: 'el-icon-location',
			sub: [{
				route: '/client/master',
				name: '大师'
			}, {
				route: '/client/user',
				name: '用户'
			}]
		}, {
			route: '/account',
			name: '财务管理',
			icon: 'el-icon-location',
			sub: [{
				route: '/account/wallet',
				name: '钱包'
			}]
		}, {
			route: '/system',
			name: '支持系统',
			icon: 'el-icon-location',
			sub: [{
				route: '/system/staff',
				name: '员工管理'
			},{
				route: '/system/indexPage',
				name: '首页设置'
			}, {
				route: '/system/job',
				name: '任务调度'
			}]
		}];
    },


// 	[{
// 		name: '课程管理',
// 		alias: 'seriesCourse',
// 		component: 'SeriesCourseManage'
// 	}, {
// 	name: '视频管理',
// 		alias: 'video',
// 		component: 'VideoMange'
// }, {
// 	name: '单集课程管理',
// 		alias: 'singleCourse',
// 		component: 'SingleCourseManage'
// }, {
// 	name: '已上架课程管理',
// 		alias: 'upCourse',
// 		component: 'UpCourseManage'
// }]

    getAuthorizedTabs(router) {
        switch (router) {
            case "/affair/course": {
				return [{
					name: '课程管理',
					alias: 'seriesCourse',
					component: 'SeriesCourseManage'
				}]
			}
            case "/affair/question": {
                return [{
					name: '解惑管理',
					alias: 'questionManage',
					component: 'QuestionManage'
				}]
            }
            case "/affair/meet": {
				return [{
					name: '约见管理',
					alias: 'meetManage',
					component: 'MeetManage'
				}]
			}
			case "/client/master": {
				return [{
					name: '大师管理',
					alias: 'masterManage',
					component: 'MasterManage'
				}]
			}
			case "/client/user": {
				return [{
					name: '用户管理',
					alias: 'userManage',
					component: 'UserManage'
				}]
			}
			case "/system/staff": {
				return [{
					name: '员工管理',
					alias: 'staffMange',
					component: 'StaffManage'
				}]
			}
			case "/account/wallet": {
				return [{
					name: '提现',
					alias: 'withdraw',
					component: 'Withdraw'
				}]
			}
			case "/system/indexPage": {
				return [{
					name: 'banner管理',
					alias: 'bannerManage',
					component: 'BannerManage'
				}, {
					name: '推荐大师管理',
					alias: 'hotMasterManage',
					component: 'HotMasterManage'
				}, {
					name: '推荐课程管理',
					alias: 'hotCourseManage',
					component: 'HotCourseManage'
				}]
			}
			case "/system/job": {
				return [{
					name: '任务调度',
					alias: 'jobManage',
					component: 'Job'
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
