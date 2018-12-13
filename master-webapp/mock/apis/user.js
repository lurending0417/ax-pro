import { Random } from "mockjs"
import {
    API_USER_INFO,
    API_MY_COLLECTION,
    API_MY_ATTENTION,
    API_MY_INVITE,
    API_MY_INVITE_DETAIL,
    API_MY_WALLET_DETAIL
} from "../../common/api"
import { arr, makArr, obj } from "../output"
import dateUtil from "../../utils/dateUtil";


export default {
    // [API_USER_INFO]: obj({
    //     name: Random.name(),
    //     phone: Random.word(8, 12),
    //     age: Random.integer(12, 50),
    //     gender: Random.boolean(),
    //     avator: Random.image("250", "#fb0a2a", "hello"),
    //     wxcode: Random.guid(),
    //     token: Random.hex()
    // }),
    // [API_MY_COLLECTION]: makArr(10, () => {
    // 	return {
    // 		img: Random.image("250", "#fb0a2a", "hello"),
    // 		name: Random.name(),
    // 		type: Random.word(4, 6),
    // 		amount: Random.integer(10, 10000),
    // 		des: Random.word(8, 28),
    // 		answers: Random.integer(0, 100),
    // 		favorites: Random.integer(0, 100)
    // 	}
    // }),
    // [API_MY_ATTENTION]: obj({
    //     rows: [
    //         {
    //             name: Random.name(),
    //             des: Random.word(8, 100),
    //             attention: true,
    //             label: ["大师", "中师", "小师"]
    //         }, {
    //             name: Random.name(),
    //             des: Random.word(8, 100),
    //             attention: true,
    //             label: ["老师", "老司机"]
    //         }, {
    //             name: Random.name(),
    //             des: Random.word(8, 100),
    //             attention: true,
    //             label: ["大师", "中师", "小师", "老师", "老司机", "绝命毒师", "蝙蝠侠", "蜘蛛侠", "钢铁侠", "铁胆火车侠"]
    //         }
    //     ]
    // }),
    // [API_MY_WALLET_DETAIL]: obj({
    //     rows: [
    //         {
    //             id: 1,
    //             img: Random.image("50", "#fb0a2a", "userIcon"),
    //             balance: 1,
    //             amount: 2,
    //             billType: Random.word(4, 16),
    //             createTime: dateUtil.pattern(new Date(), "yyyy/MM/dd")
    //         }, {
    //             id: 2,
    //             img: Random.image("50", "#fb0a2a", "userIcon"),
    //             balance: 1,
    //             amount: 2,
    //             billType: Random.word(4, 16),
    //             createTime: dateUtil.pattern(new Date(), "yyyy/MM/dd")
    //         }
    //     ]
    // })
    // [API_MY_INVITE_DETAIL]: obj({
    //     rows: [
    //         {
    //             img: "/static/images/avatars/1.png",
    //             name: "TYY",
    //             type: "购买会员",
    //             times: dateUtil.pattern(new Date(), "yyyy/MM/dd"),
    //             amount: Random.integer(0, 1000)
    //         }, {
    //             img: "/static/images/avatars/1.png",
    //             name: "YYT",
    //             type: "购买课程",
    //             times: dateUtil.pattern(new Date(), "yyyy/MM/dd"),
    //             amount: Random.integer(0, 1000)
    //         }, {
    //             img: "/static/images/avatars/1.png",
    //             name: "唐月阳",
    //             type: "约见大师",
    //             times: dateUtil.pattern(new Date(), "yyyy/MM/dd"),
    //             amount: Random.integer(0, 1000)
    //         }
    //     ]
    // })
}