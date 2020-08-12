import Types from '../types';
import DataStore from '../../dao/DataStorage';
import {handlerData, projectModels} from '../../utils/ActionUtils';

export function onloadPopularData(storeName, url, pageSize, favoriteData) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url).then(data => {
            handlerData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteData);
        }).catch(error => {
            dispatch({
                type: Types.POPULAR_REFRESH_FAIL,
                storeName,
                isLoading: false,
                error,
            });
            console.log(error);
        }); 
    }
}

export function onloadMorePopularData(storeName, pageIndex, pageSize, dataArray = [], favoriteData, callback) {
    return (dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more data');
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    pageIndex: --pageIndex,
                    error: 'no more data',
                    storeName,
                    projectModels: dataArray,
                });
            } else {
                let max = pageIndex * pageSize >= dataArray.length ? dataArray.length : pageIndex * pageSize;
                projectModels(dataArray.slice(0, max), favoriteData, data => {
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
                        projectModels: data,
                        storeName,
                        pageIndex,
                    });
                });
            }
        }, 500);
    });
}