const inital = {
    text: 1,
    selCert: null
}

export default (state = inital, action) => {
    switch (action.type) {
        case "test": {
            state.text += 5;
            return { ...state };
        }
        case "SelCert": {
            state.selCert = action.payload
            return { ...state }
        }
    }

    return state;
}