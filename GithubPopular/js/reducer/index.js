import {combineReducers} from 'redux';
import launch from './launch';
import popular from './popular';

export default combineReducers({
    launch: launch,
    popular: popular,
});