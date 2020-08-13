const { exp } = require("react-native-reanimated");

export default class Utils {
    static checkFavorite(item, keys = []) {
        if (!keys) return false;
        let id = item.id || item.repo;
        if (keys.indexOf(id.toString()) !== -1 || keys.indexOf(id) !== -1) {
            return true;
        } else {
            return false;
        }
    }

    static checkKeyIsExist(keys, key) {
        for (let i = 0; i < keys.length; i++) {
            const element = keys[i];
            if (element.name.toLowerCase() === key.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
}