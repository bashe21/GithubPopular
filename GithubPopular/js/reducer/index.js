import {combineReducers} from 'redux';
import launch from './launch';
import popular from './popular';
import trending from './trending';
import favorite from './favorite';

export default combineReducers({
    launch: launch,
    popular: popular,
    trending: trending,
    favorite: favorite,
});