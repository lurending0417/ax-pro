import MyPhysicalGoldEditor from "./editor/PhysicalGoldEditor"
import MyPhysicalGold from "./PhysicalGold"
import MyPhysicalGoldBill from "./PhysicalGoldBill"

import MyPhysicalGoldBillView from "./view/PhysicalGoldBillView"


const PhysicalGoldEditor = {
    install: function (Vue) {
        Vue.component("PhysicalGoldEditor", MyPhysicalGoldEditor);
    }
};

const PhysicalGoldBillView = {
    install: function (Vue) {
        Vue.component("PhysicalGoldBillView", MyPhysicalGoldBillView);
    }
};

const PhysicalGold = {
    install: function (Vue) {
        Vue.component("PhysicalGold", MyPhysicalGold);
    }
};

const PhysicalGoldBill = {
    install: function (Vue) {
        Vue.component("PhysicalGoldBill", MyPhysicalGoldBill);
    }
};


export {
    PhysicalGold, PhysicalGoldBill,
    PhysicalGoldEditor, PhysicalGoldBillView
}

