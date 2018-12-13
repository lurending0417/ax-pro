
import { openVip } from "../user/vip"
import api from "../../api/api";
import { API_COURSE_BUY, API_POST_FAV, API_SNS_AGREE_POST } from "../../common/api";
import { wxPay } from "../../utils/wx";
import { fire } from "../../utils/notify"

const buy = (targetId, targetPrice, store, type = "COURSE") => {
    return api.request({
        url: API_COURSE_BUY,
        params: {
            targetType: type,
            targetId: targetId,
            totalCost: targetPrice,
            gateway: "WEIXIN_MP"
        },
        method: "post"
    }).then(rs => {
        return new Promise(s => {
            wxPay(rs.result, (err) => {
                if (!err) {
                    s();
                }
            });
        })

    })
}

const buyCourse = (store, courseStore) => {
    return () => {
        buy(store.courseId || store.id, store.coursePrice, store, "COURSE").then(() => {
            store.toBuyCourse = false;
            courseStore && (courseStore.courseStore = false);
        })
    }
}

const buySection = (store, courseStore) => {
    return buy(store.id, store.sectionPrice, store, "SECTION").then(() => {
        store.toBuyCourse = false;
        courseStore && (courseStore.courseStore = false);
    })
}


// 收藏  
const favorite = (store) => {
    api.request({
        url: API_POST_FAV,
        params: {
            billId: store.id,
            billType: "COURSE"
        },
        method: store.favorite ? "delete" : "post"
    }).then(() => {
        // $.toast(this.props.store.favorite ? "收藏成功" : "取消成功")
        store.favorite = !store.favorite;

        // 搜藏列表 需要删除
        fire("MasterCollect", store)
    })
}

const agree = store => {
    api.request({
        url: API_SNS_AGREE_POST,
        params: {
            billId: store.id,
            billType: "COURSE"
        },
        method: store.agree ? "delete" : "post"
    }).then(() => {
        // $.toast(this.props.store.favorite ? "收藏成功" : "取消成功")
        store.agree = !store.agree;
    })
}

export {
    // openVip,
    buyCourse,
    buySection,
    buy,
    favorite,
    agree
}