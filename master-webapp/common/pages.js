// import dynamic from "next/dynamic"
import { Router } from "next/router"
import dynamic from "../components/common/nav/dynamic"
import "./rem"
import "./light7"
import "./wx"
import "../components/tools/debug"
import "../utils/object"
import "../static/style/index.scss"
// 替换
Router.prototype.onPopState = () => {
    console.log("pop")
};

const F1 = dynamic(import("../pages/anytest/f1"));
const F2 = dynamic(import("../pages/anytest/f2"));
const F3 = dynamic(import("../pages/anytest/f3"));
const INDEX_HOME = dynamic(import("../pages/index/home"))
const INDEX_MASTER = dynamic(import("../pages/index/master"))
const INDEX_LEARN = dynamic(import("../pages/index/learn"))
const INDEX_MESSAGE = dynamic(import("../pages/index/message"))
const INDEX_MY = dynamic(import("../pages/index/my"))
const WALLET_WALLET = dynamic(import("../pages/wallet/wallet"))
const WALLET_WALLET_DETAIL = dynamic(import("../pages/wallet/walletDetail"))
const WALLET_WALLET_WITHDRAW = dynamic(import("../pages/wallet/withdraw"))
const WALLET_WALLET_RECHARGE = dynamic(import("../pages/wallet/recharge"))
const MY_COLLECTION = dynamic(import("../pages/my/collection"))
const MY_ATTENTION = dynamic(import("../pages/my/attention"))
const MY_INVITE = dynamic(import("../pages/my/invite"))
const INVITE_DETAIL = dynamic(import("../pages/invite/inviteDetail"))
const INVITE_RULE = dynamic(import("../pages/invite/inviteRule"))


const UserSetting = dynamic(import("../pages/setting/user"));
const SingleText = dynamic(import("../pages/common/editText"))
const UserPhone = dynamic(import("../pages/setting/user_phone"))

const MeetList = dynamic(import("../pages/meet/list"))
const MeetEdit = dynamic(import("../pages/meet/meetedit"))
const MeetOne = dynamic(import("../pages/meet/meetone"))
const MeetDetail = dynamic(import("../pages/meet/detail"))

const AddressPicker = dynamic(import("../pages/common/addressPicker"))
const TimePicker = dynamic(import("../pages/common/rangeTimePicker"))

const MESSAGE_REMARK = dynamic(import("../pages/message/remark"));
const MESSAGE_STAR = dynamic(import("../pages/message/star"));
const MESSAGE_REWARD = dynamic(import("../pages/message/reward"));

const REMARK_LIST = dynamic(import("../pages/remarkTest/remarkList"));
const GIFT_TEST = dynamic(import("../pages/remarkTest/giftTest"));
const PURCAHSE_VIP = dynamic(import("../pages/remarkTest/purchaseVip"));

//disabuse
const DB_MIAN = dynamic(import("../pages/disabuse/db_main"));
const DB_MASTERS = dynamic(import("../pages/disabuse/db_masters"));
const DB_ASK = dynamic(import("../pages/disabuse/db_ask"));
const DB_DETAIL = dynamic(import("../pages/disabuse/db_detail"));
const DB_MY = dynamic(import("../pages/disabuse/db_my"));

// master
const MasterDetail = dynamic(import("../pages/master/detail"));
const MasterMeetList = dynamic(import("../pages/master/meetlist"));

// common
const PhotoManager = dynamic(import("../pages/common/photoManager"));

const Login = dynamic(import("../pages/user/login"))
const PluginList = dynamic(import("../pages/common/list"))
const PluginListDetail = dynamic(import("../pages/common/listdetail"))

//reward
const Reward = dynamic(import("../pages/reward/reward"));
const RewardDetail = dynamic(import("../pages/reward/rewardDetail"));
const RewardMy = dynamic(import("../pages/reward/reward_my"));

// course
const OneCourse = dynamic(import("../pages/course/one"))
// import OneCourse from "../pages/course/one"
const GroupCourse = dynamic(import("../pages/course/group"))
const ListCourse = dynamic(import("../pages/course/list"))
const MyCourse = dynamic(import("../pages/my/course"))

const SignedPage = dynamic(import("../pages/pub/signed"))
const SignedPage2 = dynamic(import("../pages/attendance/attendance"))
const Lottery = dynamic(import("../pages/lottery/lottery"))


const pages = {
    "/meet/meetone": MeetOne,
    "/meet/meetedit": MeetEdit,
    "/meet/list": MeetList,
    "/meet/detail": MeetDetail,
    "/anytest/f1": F1,
    "/anytest/f2": F2,
    "/anytest/f3": F3,
    "/message/remark": MESSAGE_REMARK,
    "/message/star": MESSAGE_STAR,
    "/message/reward": MESSAGE_REWARD,
    "/remarkTest/remarkList": REMARK_LIST,
    "/remarkTest/giftTest": GIFT_TEST,
    "/remarkTest/purchaseVip": PURCAHSE_VIP,
    "/setting/user": UserSetting,
    "/common/editText": SingleText,
    "userPhone": UserPhone,
    "/index/home": INDEX_HOME,
    "/index/master": INDEX_MASTER,
    "/index/learn": INDEX_LEARN,
    "/index/message": INDEX_MESSAGE,
    "/index/my": INDEX_MY,
    "/wallet/wallet": WALLET_WALLET,
    "/wallet/walletDetail": WALLET_WALLET_DETAIL,
    "/wallet/withdraw": WALLET_WALLET_WITHDRAW,
    "/wallet/recharge": WALLET_WALLET_RECHARGE,
    "/my/collection": MY_COLLECTION,
    "/my/attention": MY_ATTENTION,
    "/my/invite": MY_INVITE,
    "/common/rangeTimePicker": TimePicker,
    "/common/addressPicker": AddressPicker,
    "/invite/inviteDetail": INVITE_DETAIL,
    "/invite/inviteRule": INVITE_RULE,
    "/disabuse/db_main": DB_MIAN,
    "/disabuse/db_masters": DB_MASTERS,
    "/disabuse/db_ask": DB_ASK,
    "/master/detail": MasterDetail,
    "/master/meetlist": MasterMeetList,
    "/common/photoManager": PhotoManager,
    "/user/login": Login,
    "/common/list": PluginList,
    "/common/listdetail": PluginListDetail,
    "/disabuse/db_detail": DB_DETAIL,
    "/reward/reward": Reward,
    "/reward/rewardDetail": RewardDetail,
    "/disabuse/db_my": DB_MY,
    "/course/one": OneCourse,
    "/course/group": GroupCourse,
    "/course/list": ListCourse,
    "/my/course": MyCourse,
    "/reward/reward_my": RewardMy,
    "/pub/signed": SignedPage,
    "/attendance/attendance": SignedPage2,
    "/lottery/lottery": Lottery
}


process.__Pages = pages;

export default pages;