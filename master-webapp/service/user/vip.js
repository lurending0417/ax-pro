import api from "../../api/api";
import { API_VIP_POST } from "../../common/api";
import { wxPay } from "../../utils/wx";
import sysStore from "../../data/stores/sysStore";
import UserStore from "../../data/stores/UserStore";

const openVip = () => {
    return new Promise((s, f) => {
        api.request({
            url: API_VIP_POST,
            params: {
                gateway: "WEIXIN_MP",
                originalCost: sysStore.vipOriginalCost,
                totalCost: sysStore.vipActualCost
            },
            method: "post"
        }).then(rs => {
            wxPay(rs.request, (err) => {
                if (err) {
                    $.toast("支付失败")
                }
                else {
                    UserStore.vip = true;

                    s();
                }
            })

        })
    })
}

export {
    openVip

}