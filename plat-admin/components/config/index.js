import MyRentRule from "./RentRule"


const RentRule = {
    install: function (Vue) {
        Vue.component("RentRule", MyRentRule);
    }
};


export {
    RentRule
}
