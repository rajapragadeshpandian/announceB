const initalState = {
    changes: {},
    blog: {}
};

const reducer = (state = initalState, action) => {

    switch (action.type) {
        case "FETCH_CHANGES":
            return { ...state, changes: action.payload };
        case "FETCH_BLOG":
            return { ...state, blog: action.payload }
        default:
            return { ...state, changes: { data: "rajapragadeh" } }
    }

}

export default reducer;