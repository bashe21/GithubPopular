import ProjectModel from '../model/ProjectModel';
import FavoriteDao from '../dao/FavoriteDao';
import Utils from '../utils/Utils';

export function handlerData(actionType, dispatch, storeName, data, pageSize, favoriteData) {
    let fixItems = [];
    if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data;
        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items;
        }
    }

    // 第一次显示数据
    const showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize);

    projectModels(showItems, favoriteData, projectModels => {
        dispatch({
            type: actionType,
            storeName,
            items: fixItems,
            projectModels: projectModels,
            pageIndex: 1,
        });
    });

}

export async function projectModels(showItems, favoriteData, callback) {
    let keys = [];
    try {
        keys = await FavoriteDao.getFavoriteKeys();
    } catch (e) {
        console.log(e);
    }
    let projectModels = [];
    for (let i = 0; i < showItems.length; i++) {
        projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)));
    }
    doCallback(callback, projectModels);
}

export const doCallback = (callback, object) => {
    if (typeof callback === 'function') {
        callback(object);
    }
}