import MyMerchantView from "./view/MerchantView";
import MyMerchantEditor from "./editor/MerchantEditor"
import MyMerchant from "./Merchant"
import MyMerchantBasicInfo from "./view/MerchantBasicInfo"
import MyStore from "./Store"

import MyMerchantBankAccountEditor from "./editor/MerchantBankAccountEditor"

const MerchantView = {
    install: function (Vue) {
        Vue.component('MerchantView', MyMerchantView);
    }
};
const MerchantEditor = {
    install: function (Vue) {
        Vue.component('MerchantEditor', MyMerchantEditor);
    }
};

const Merchant = {
    install: function (Vue) {
        Vue.component("Merchant", MyMerchant);
    }
};

const MerchantBasicInfo = {
    install: function (Vue) {
        Vue.component("MerchantBasicInfo", MyMerchantBasicInfo);
    }
};

const Store = {
    install: function (Vue) {
        Vue.component("Store", MyStore);
    }
};

const MerchantBankAccountEditor = {
    install: function (Vue) {
        Vue.component("MerchantBankAccountEditor", MyMerchantBankAccountEditor);
    }
};

export {
    Store,
    Merchant, MerchantEditor, MerchantBankAccountEditor,
    MerchantView, MerchantBasicInfo,
};
