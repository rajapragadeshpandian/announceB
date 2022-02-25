import { combineReducers } from 'redux';
import changeReducer from './changeReducer';
import customerReducer from './customerReducer';
import userReducer from './userReducer';

const reducers = combineReducers({
    changeLogs: changeReducer,
    customers: customerReducer,
    users: userReducer
})

export default reducers;