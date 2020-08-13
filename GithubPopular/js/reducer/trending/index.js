import Types from '../../actions/types';

const defaultState = {};
export default function onAction(state = defaultState, action) {
    switch(action.type) {
        case Types.TRENDING_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                    hideLoadMore: true,
                }
            };
        case Types.TRENDING_REFRESH_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideLoadMore: true,
                }
            };
        case Types.TRENDING_REFRESH_SUCCESS:
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
        case Types.TRENDING_LOAD_MORE_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    hideLoadMore: true,
                    pageIndex: action.pageIndex,
                }
            }
        case Types.TRENDING_LOAD_MORE_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    projectModels: action.projectModels,
                    hideLoadMore: true,
                    pageIndex: action.pageIndex,
                }
            }
        default: 
            return state;
    }
}