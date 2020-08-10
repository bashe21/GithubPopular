import Types from '../../actions/types';

const defaultState = {isLoaded: false};

export default function onAction(state = defaultState, action) {
    switch(action.type) {
        case Types.LAUNCH_APP:
            return {
                ...state,
                isLoaded: action.isLoaded,
            };
            break;
        default:
            return state; 
    }
}