import {combineReducers} from 'redux';
import launch from './launch';
import popular from './popular';
import trending from './trending';

export default combineReducers({
    launch: launch,
    popular: popular,
    trending: trending,
    
});