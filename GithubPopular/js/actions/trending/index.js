import Types from '../types';
import DataStore from '../../dao/DataStorage';
import {handlerData, projectModels} from '../../utils/ActionUtils';

export function onloadTrendingData(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        dispatch({type: Types.TRENDING_REFRESH, storeName: storeName});
        let dataStore = new DataStore();
        dataStore.fetchData(url).then(data => {
            handlerData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao);
        }).catch(error => {
            dispatch({
                type: Types.TRENDING_REFRESH_FAIL,
                storeName,
                isLoading: false,
                error,
            });
            console.log(error);
        }); 
    }
}

export function onloadMoreTrendingData(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
    return (dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more data');
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    pageIndex: --pageIndex,
                    error: 'no more data',
                    storeName,
                    projectModels: dataArray,
                });
            } else {
                let max = pageIndex * pageSize >= dataArray.length ? dataArray.length : pageIndex * pageSize;
                projectModels(dataArray.slice(0, max), favoriteDao, data => {
                    dispatch({
                        type: Types.TRENDING_LOAD_MORE_SUCCESS,
                        projectModels: data,
                        storeName,
                        pageIndex,
                    });
                });
            }
        }, 500);
    });
}

export function onflushTrendingFavoriteData(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
    return dispatch => {
        dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
        let max = pageIndex * pageSize >= dataArray.length ? dataArray.length : pageIndex * pageSize;
        projectModels(dataArray.slice(0, max), favoriteDao, data => {
            dispatch({
                type: Types.TRENDING_FLUSH_FAVORITE,
                projectModels: data,
                storeName,
                pageIndex,
            });
        });
    }
}