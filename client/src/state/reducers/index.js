import {combineReducers} from 'redux';
import changeReducer from './changeReducer';

const reducers = combineReducers ({
changeLogs : changeReducer 
})

export default reducers;