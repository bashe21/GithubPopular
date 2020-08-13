import Types from '../../actions/types';

export default function onAction(state = {}, action) {
    switch(action.type) {
        case Types.FAVORITE_LOAD_DATA:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                }
            };
        case Types.FAVORITE_LOAD_DATA_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    projectModels: action.projectModels,
                }
            };
        case Types.FAVORITE_LOAD_DATA_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                }
            };
        default:
            return state; 
    }
}