import MyRechargeWallet from "./RechargeWallet"
import MyRechargeWalletOffline from "./RechargeWalletOffline"
import MyWithdrawRecord from "./WithdrawRecord"
import MyWithdrawTran from "./view/WithdrawTranDialog"
import MyAccount from "./Account"
import MyWalletTran from "./WalletTran"
import MyRechargeWalletDialog from "./view/RechargeWalletDialog"
import MyRechargeWalletOfflineDialog from "./view/RechargeWalletOfflineDialog"
import MyMarketingTran from "./MarketingTran"
import MyMutableTran from "./MutableTran"
import MyEncourageTran from "./EncourageTran"
import MyGoldSellRecord from "./GoldSellRecord"
import MyGoldBuyRecord from "./GoldBuyRecord"
import MyEncourageRecordDialog from "./view/EncourageRecordDialog"


import MyEncourageRecordEditor from "./view/EncourageRecordEditor"


import MyWithdrawTransfer from "./view/WithdrawTransfer"

const WithdrawTransfer = {
    install: function (Vue) {
        Vue.component("WithdrawTransfer", MyWithdrawTransfer);
    }
};

const EncourageRecordEditor = {
    install: function (Vue) {
        Vue.component("EncourageRecordEditor", MyEncourageRecordEditor);
    }
};

const GoldSellRecord = {
    install: function (Vue) {
        Vue.component("GoldSellRecord", MyGoldSellRecord);
    }
};

const GoldBuyRecord = {
    install: function (Vue) {
        Vue.component("GoldBuyRecord", MyGoldBuyRecord);
    }
};

const EncourageRecordDialog = {
    install: function (Vue) {
        Vue.component("EncourageRecordDialog", MyEncourageRecordDialog);
    }
};

const WithdrawTran = {
    install: function (Vue) {
        Vue.component("WithdrawTran", MyWithdrawTran);
    }
};

const MarketingTran = {
    install: function (Vue) {
        Vue.component("MarketingTran", MyMarketingTran);
    }
};

const MutableTran = {
    install: function (Vue) {
        Vue.component("MutableTran", MyMutableTran);
    }
};

const EncourageTran = {
    install: function (Vue) {
        Vue.component("EncourageTran", MyEncourageTran);
    }
};

const Account = {
    install: function (Vue) {
        Vue.component("Account", MyAccount);
    }
};

const RechargeWallet = {
    install: function (Vue) {
        Vue.component("RechargeWallet", MyRechargeWallet);
    }
};

const RechargeWalletOffline = {
    install: function (Vue) {
        Vue.component("RechargeWalletOffline", MyRechargeWalletOffline);
    }
};

const WithdrawRecord = {
    install: function (Vue) {
        Vue.component("WithdrawRecord", MyWithdrawRecord);
    }
};

const WalletTran = {
    install: function (Vue) {
        Vue.component("WalletTran", MyWalletTran);
    }
};

const RechargeWalletDialog = {
    install: function (Vue) {
        Vue.component("RechargeWalletDialog", MyRechargeWalletDialog);
    }
};

const RechargeWalletOfflineDialog = {
    install: function (Vue) {
        Vue.component("RechargeWalletOfflineDialog", MyRechargeWalletOfflineDialog);
    }
};

export {
    Account, WalletTran, MarketingTran, MutableTran, EncourageTran, GoldBuyRecord, GoldSellRecord,
    RechargeWallet, RechargeWalletDialog, RechargeWalletOffline, RechargeWalletOfflineDialog, EncourageRecordDialog, EncourageRecordEditor,
    WithdrawRecord, WithdrawTran, WithdrawTransfer
}




