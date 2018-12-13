export default {
    namespaced: true,
    state: {
        currCpn: null,
        billNumber: '',
        isFromExchange: false
    },
    getters: {
        getCurrCpn(state) {
            return state.currCpn;
        },
        getBillNumber(state) {
            return state.billNumber;
        },
        getIsFromExchange(state) {
            return state.isFromExchange;
        }
    },
    mutations: {
        resetCurrCpn(state, cpn) {
            cpn && (state.currCpn = cpn);
        },
        resetBillNumber(state, billNumber) {
            state.billNumber = billNumber
        },
        resetIsFromExchange(state, bool) {
            state.isFromExchange = bool
        }
    }
}
