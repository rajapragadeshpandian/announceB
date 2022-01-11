const initalState = {
    changes: {}
};

const reducer = (state = initalState, action) => {

    switch (action.type) {
        case "FETCH_CHANGES":
            return { ...state, changes: action.payload };
        default:
            return { ...state, changes: { data: "rajapragadeh" } }
    }

}

export default reducer;