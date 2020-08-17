import AsyncStorage from '@react-native-community/async-storage';
import langs from '../res/data/langs.json';
import keys from '../res/data/keys.json';

export const FLAG_LANGUAGE = {flag_language: 'language_dao_language', flag_key: 'language_dao_key'};

export default class LanguageDao {
    constructor(flag) {
        this.flag = flag;
    }

    fetch() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.flag, (error, result) => {
                if (error) {
                    reject(error);
                }
                if (!result) {
                    let data = this.flag === FLAG_LANGUAGE.flag_language ? langs : keys;
                    resolve(data);
                    this.save(data);
                } else {
                    try {
                        let data = JSON.parse(result);
                        resolve(data);
                    } catch(e) {
                        console.log(e);
                    }
                }
            })
        });
    }

    save(data) {
        let stringData = JSON.stringify(data);
        AsyncStorage.setItem(this.flag, stringData, (error, result) => {
            if (!error) {
                console.log(error);
            }
        });
    }
}