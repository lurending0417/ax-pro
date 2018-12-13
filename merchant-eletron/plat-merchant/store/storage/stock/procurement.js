export default {
    namespaced: true,
    state: {
        currCpn: null
    },
    getters: {
        getCurrCpn (state) {
            return state.currCpn
        }
    },
    mutations: {
        resetCurrCpn (state, cpn) {
            cpn && (state.currCpn = cpn)
        }
    }
}
