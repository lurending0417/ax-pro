import MyRegionSelect from "./RegionSelect"
import MyHistoryView from "./HistoryView";
import MyLoading from './Loading';
import MyPagination from "./Pagination"
import MyEnumSelect from "./EnumSelect"
import MyEnumRadio from "./EnumRadio"
import MyDateRange from "./DateRange";
import MyUserProfile from "./UserProfile"

const RegionSelect = {
    install: function (Vue) {
        Vue.component('RegionSelect', MyRegionSelect);
    }
};
const HistoryView = {
    install: function (Vue) {
        Vue.component('HistoryView', MyHistoryView);
    }
};
const Loading = {
    install: function (Vue) {
        Vue.component('Loading', MyLoading)
    }
};
const Pagination = {
    install: function (Vue) {
        Vue.component("Pagination", MyPagination)
    }
};
const EnumSelect = {
    install: function (Vue) {
        Vue.component('EnumSelect', MyEnumSelect)
    }
};
const EnumRadio = {
    install: function (Vue) {
        Vue.component("EnumRadio", MyEnumRadio);
    }
};
const DateRange = {
    install: function (Vue) {
        Vue.component("DateRange", MyDateRange)
    }
};
const UserProfile = {
    install: function (Vue) {
        Vue.component("UserProfile", MyUserProfile);
    }
};


export {
    RegionSelect,
    DateRange,
    HistoryView,
    Loading,
    Pagination,
    EnumSelect,
    EnumRadio,
    UserProfile
};

