import MyCashStat from "./finance/CashStat";
import MyCashDailyStat from "./finance/CashDailyStat";
import MyDepositStat from "./finance/DepositStat"
import MyGoldStat from "./finance/GoldStat"
import MyIncomeStat from "./finance/IncomeStat"
import MyLeaseStat from "./finance/LeaseStat"
import MyWalletStat from "./finance/WalletStat"
import MyUserWalletStat from "./finance/UserWalletStat"
import MyMerchantWalletStat from "./finance/MerchantWalletStat"
import MyLeaseStatDetail from "./finance/detail/LeaseStatDetail"

const CashStat = {
    install: function (Vue) {
        Vue.component("CashStat", MyCashStat);
    }
};

const CashDailyStat = {
    install: function (Vue) {
        Vue.component("CashDailyStat", MyCashDailyStat);
    }
};

const DepositStat = {
    install: function (Vue) {
        Vue.component("DepositStat", MyDepositStat);
    }
};

const GoldStat = {
    install: function (Vue) {
        Vue.component("GoldStat", MyGoldStat);
    }
};

const IncomeStat = {
    install: function (Vue) {
        Vue.component("IncomeStat", MyIncomeStat);
    }
};

const LeaseStat = {
    install: function (Vue) {
        Vue.component("LeaseStat", MyLeaseStat);
    }
};

const WalletStat = {
    install: function (Vue) {
        Vue.component("WalletStat", MyWalletStat);
    }
};

const UserWalletStat = {
    install: function (Vue) {
        Vue.component("UserWalletStat", MyUserWalletStat);
    }
};

const MerchantWalletStat = {
    install: function (Vue) {
        Vue.component("MerchantWalletStat", MyMerchantWalletStat);
    }
};

const LeaseStatDetail = {
    install: function (Vue) {
        Vue.component("LeaseStatDetail", MyLeaseStatDetail)
    }
};

export {
    CashStat, CashDailyStat, DepositStat, GoldStat, IncomeStat, LeaseStat, WalletStat, UserWalletStat, MerchantWalletStat, LeaseStatDetail
};
