export const APILOGIN = "/test/login"
export const APIREGISTER = "/test/REGISTER"
export const APINICKNAME = "/test/NICKNAME"


export const API_SMS = "/sms/sms/rand"

export const API_LOGIN = "/user/login/weixin"
export const API_LOGIN_SMS = "/user/login/sms"


// 刷新用户信息
export const API_USER_INFO = "/user/profile"
export const API_AVATOR = "/user/avatar"
export const API_NICK = "/user/nick"
export const API_PHONE = "/user/phone"

// 初始化
export const API_GET_CATEGORY = "/sys/category"
export const API_GET_SYS = "/sys/config"
export const API_WX_JS = "/weixin/sign/js"


// 我的约见
export const API_GET_MEETS = "/appoint"
export const API_MEET_DETAIL = "/test/meetdetail"
export const API_MEET_UPLOAD = "/appoint"


// 获取收藏
export const API_MY_COLLECTION = "/sns/favorite"
export const API_POST_FAV = "/sns/favorite"
// 获取我关注的大师
export const API_MY_ATTENTION = "/sns/follow"
//关注大师
export const API_FOLLOW = "/sns/follow"
// 取消关注
export const API_FOLLOW_DEL = "/sns/follow"
// 获取我的邀请
export const API_MY_INVITE = "/account/share"


// 大师列表
export const API_MASTER_LIST = "/user/master"
export const API_MASTER_LIST_REAL = "/user/master"
export const API_MASTER_FENGCAI = "/user/master/fengcai";  //大师风采
// 获取我的邀请明细
export const API_MY_INVITE_DETAIL = "/account/share/usage"
// 向钱包充值
export const API_MY_WALLET_RECHARGE = "/account/wallet/recharge"
// 发起提现
export const API_MY_WALLET_WITHDRAW = "/account/wallet/withdraw"
// 获取我的收支明细
export const API_MY_WALLET_DETAIL = "/account/wallet/usage"
// 获取我的钱包信息
export const API_MY_WALLET = "/account/wallet"

// 评论点赞
export const API_SNS_AGREE_POST = "/sns/agree" //发表点赞
export const API_SNS_COMMENT_GET = "/sns/comment" //获取评论列表
export const API_SNS_COMMENT_POST = "/sns/comment" //发表评论
export const API_SNS_EVALUATE_POST = "/sns/evaluate" // 发表评价
export const API_SNS_REWARD_POST = "/sns/reward" // 发起打赏
export const API_SNS_COMMENT_REPLY = "/sns/comment/reply" // 评论回复

// 解惑
export const API_DB_QUESTION = "/question"; // 获取开放的解惑列表  / 发起解惑提问
export const API_DB_QUESTION_LISTEN = "/question/listen"; // 发起偷听请求
export const API_DB_QUESTION_PURSUIT = "/question/pursuit"; // 大师赠送追问次数
export const API_DB__QUESTION_REPLY = "/question/reply"; // 大师回复解惑 / 用户发起追问
export const API_DB_QUESTION_DETAIL = "/question/{questionId}"; // 获取单个解惑详情
export const API_DB_QUESTION_MY = "/question/my"; //获取我的解惑


// 系统消息
export const API_MESSAGE_DETAIL_GET = "/message" //获取系统消息
export const API_MESSAGE_COUNT_GET = "/message/count" //获取系统消息

// vip
export const API_VIP_POST = "/vip" //充值vip

// 悬赏
export const API_WANTED = "/wanted"; // 获取悬赏问答列表 / 发起悬赏
export const API_WANTED_DETAIL = "/wanted/{wantedId}"; // 获取悬赏问答详情
export const API_WANTED_REPALY = "/wanted/reply" // 回答悬赏
export const API_WANTED_MY = "/wanted/my" // 获取我的悬赏


// 课程
// 详情
export const API_COURSE_SERIES_DETAIL = "/course/{courseId}"
export const API_COURSE_ONE_DETAIL = "/course/section/{sectionId}"
export const API_COURSE_LIST = "/course"
export const API_COURSE_BUY = "/course/join"
export const API_COURSE_MEDIA = "/course/section/media"
// 发起分享
export const API_COURSE_SHARE = "/course/section/share"
// 抢 获取
export const API_COURSE_SHARE_DRAW = "/course/section/share/draw"
// 获取分享详情
export const API_COURSE_SHARE_GET = "/course/section/share/{shareId}"

export const API_COURSE_UPLOAD_PROGRESS = "/course/section/media/duration"

// 首页
export const API_INDEX_PAGE = "/page/index"

// 签到
export const API_CHECK_STAT = "/check/in/stat"
export const API_CHECK_MONTH = "/check/in/calendar"
export const API_CHECK_BUY = "/check/in/buy"
export const API_CHECK_TOP = "/check/in/top";

// 抽奖
export const API_GET_LOTTERY = "/check/in/lottery"
export const API_POST_LOTTERY = "/check/in/lottery/draw"
