import MyLeaseRecord from "./LeaseRecord"
import MyLeaseRecordView from "./view/LeaseRecordView"


const LeaseRecord = {
    install: function (Vue) {
        Vue.component("LeaseRecord", MyLeaseRecord);
    }
};


const LeaseRecordView = {
    install: function (Vue) {
        Vue.component("LeaseRecordView", MyLeaseRecordView);
    }
};


export {
    LeaseRecord, LeaseRecordView
}
