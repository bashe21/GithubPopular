import Types from '../../actions/types';

const defaultState = {};
export default function onAction(state = defaultState, action) {
    switch(action.type) {
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadMore: true,
                }
            };
        case Types.POPULAR_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideLoadMore: true,
                }
            };
        case Types.POPULAR_REFRESH_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideLoadMore: true,
                    items: action.items,
                    projectModels: action.projectModels,
                    pageIndex: action.pageIndex,
                }
            };
        default: 
            return state;
    }
}