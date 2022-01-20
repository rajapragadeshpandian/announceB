const initalState = {
    customers: {}
};

const reducer = (state = initalState, action) => {

    switch (action.type) {
        case "FETCH_CUSTOMER":
            return { ...state, customers: action.payload };
        default:
            return { ...state, customers: { data: "customers" } }
    }

}

export default reducer;