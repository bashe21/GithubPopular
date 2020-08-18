import AsyncStorage from '@react-native-community/async-storage';
import ThemeFactory, {ThemeFlags} from '../res/styles/ThemeFactory';

const THEME_KEY = 'theme_key';
export default class ThemeDao {
    getTheme() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(THEME_KEY, (error, result) => {
                if (error) {
                    reject(error);
                }
                if (!result) {
                    result = ThemeFlags.Default;
                    AsyncStorage.save(result);
                }
                resolve(ThemeFactory.createTheme(result));
            });
        });
    }

    save(themeFlag) {
        AsyncStorage.setItem(THEME_KEY, themeFlag);
    }
}