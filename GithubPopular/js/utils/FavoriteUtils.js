import {FLAG_STORAGE} from '../dao/DataStorage';

export default class FavoriteUtils {
    static onFavorite(favoriteDao, item, isFavorite, flag) {
        const key = flag === FLAG_STORAGE.flag_popular ? item.id.toString() : item.repo;
        if (isFavorite) {
            favoriteDao.saveFavoriteItem(key, JSON.stringify(item));
        } else {
            favoriteDao.removeFavoriteItem(key);
        }
    }
}