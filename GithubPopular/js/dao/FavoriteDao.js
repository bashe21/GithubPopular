import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';

const FAVORITE_KEY_PREFIX = 'favorite_';
export default class FavoriteDao extends React.Component {
    constructor(flag) {
        super(flag);
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag;
    }

    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error, result) => {
            if (!error) {
                this.updateFavoriteKey(key, true);
            }
        });
    }

    updateFavoriteKey(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = [];
                if (result) {
                    favoriteKeys = JSON.parse(result);
                }
                let index = favoriteKeys.indexOf(key);
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key);
                    }
                } else {
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1);
                    }
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys));
            }
        });
    }

    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(error);
                }
            })
        });
    }

    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavoriteKey(key, false);
            }
        });
    }

    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys().then((keys) => {
                let items = [];
                if (keys) {
                    AsyncStorage.getItem(keys, (error, stores) => {
                        try {
                            stores.map((result, i) => {
                                let key = result[0];
                                let value = result[1];
                                if (value) {
                                    items.push(JSON.parse(value));
                                }
                            });
                            resolve(items);
                        } catch(e) {
                            reject(e);
                        }
                    });
                } else {
                    resolve(items);
                }
            }).catch(e => {
                reject(e);
            })
        });
    }

}
