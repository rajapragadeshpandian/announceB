const state = {
    users: {}
};

function reducer(state, action) {

    switch (action.type) {
        case 'GET_USERS':
            return { ...state, users: action.data }
        default:
            return { ...state, users: {} };
    }
};

export default reducer;