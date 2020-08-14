import Types from '../types';
import FavoriteDao from '../../dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';

export function onloadFavoriteData(flag, isShowLoading) {
    return dispatch => {
        if (isShowLoading) {
            dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag});
        }

        new FavoriteDao(flag).getAllItems().then((items) => {
            let resultData = [];
            for (let i = 0; i < items.length; i++) {
                resultData.push(new ProjectModel(items[i], true));
            }
            dispatch({type: Types.FAVORITE_LOAD_DATA_SUCCESS, projectModels: resultData, storeName: flag});
        }).catch (e => {
            console.log(e);
            dispatch({type: Types.FAVORITE_LOAD_DATA_FAIL, storeName: flag, error: e});
        })
    }
}