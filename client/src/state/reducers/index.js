import { combineReducers } from 'redux';
import changeReducer from './changeReducer';
import customerReducer from './customerReducer';

const reducers = combineReducers({
    changeLogs: changeReducer,
    customers: customerReducer
})

export default reducers;