import URL from "./UrlObject"

export default {
    user: {
        staff: {
			list: new URL("get", "/user/staff"),
			add: new URL("post", "/user/staff"),
			edit: new URL("put", "/user/staff/{staffId}")
		},
		master: {
        	list: new URL("get", "/user/master/query"),
        	add: new URL("post", "/user/master"),
        	edit: new URL("put", "/user/master/{masterId}"),
        	get: new URL("get", "/user/master/fengcai"),
		},
		user: {
        	list: new URL("get", "/user/query"),
		},
        login: {
            pwd: new URL("post", "/user/staff/login/pwd"),
            sms: new URL("post", "/user/staff/login/sms"),
            set: new URL("post", "/user/staff/pwd")
        },
		category: {
        	list: new URL("get", "/sys/category")
		}
    },
	course: {
    	list: new URL("get", "/course/list"),
    	add: new URL("post", "/course"),
		edit: new URL("post", "/course/{courseId}"),
		del: new URL("delete", "/course/{courseId}"),
		section: {
    		list: new URL("get", "/course/section"),
    		add: new URL("post", "/course/section"),
    		edit: new URL("post", "/course/section/{sectionId}"),
    		del: new URL("delete", "/course/section/{sectionId}")
		}
	},
	question: {
		recognition: {
			list: new URL("get", "/question/toRecognition"),
			detail: new URL("get", "/question/{questionId}"),
			get: new URL("post", "/question/recognition"),
			confirm: new URL("post", "/question/recognition/confirm")
		}
	},
	appoint: {
    	list: new URL("get", "/appoint/list"),
    	cancel: new URL("post", "/appoint/cancel"),
    	edit: new URL("put", "/appoint/{appointId}")
	},
	account: {
    	audit: new URL("post", "/account/wallet/withdraw/audit"),
		query: new URL("get", "/account/wallet/withdraw/query"),
    	stat: new URL("get", "/account/wallet/withdraw/stat"),
		usage: new URL("get", "/account/wallet/usage/query"),
	},
	page: {
    	index: {
    		banner: {
    			list: new URL('get', '/page/index/banner'),
    			add: new URL('post', '/page/index/banner'),
    			edit: new URL('post', '/page/index/banner/{bannerId}'),
    			del: new URL('delete', '/page/index/{bannerId}')
			},
			master: {
				queryList: new URL('get', '/page/index/master/query'),
				list: new URL('get', '/page/index/master'),
				add: new URL('post', '/page/index/master'),
				edit: new URL('put', '/page/index/master/{id}'),
				del: new URL('delete', '/page/index/master/{id}'),
			},
			course: {
				queryList: new URL('get', '/page/index/course/query'),
				list: new URL('get', '/page/index/course'),
				add: new URL('post', '/page/index/course'),
				edit: new URL('put', '/page/index/course/{id}'),
				del: new URL('delete', '/page/index/course/{id}'),
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
    history: {
        list: new URL("get", "/history/{entityId}")
    },
    file: {
        get: new URL("get", "/file")
    }

}
