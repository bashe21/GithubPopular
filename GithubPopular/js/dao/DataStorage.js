import AsyncStorage from '@react-native-community/async-storage';

export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};

export default class DataStore {
    // 保存数据
    _saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback);
    }

    // 对数据进行包裹时间戳
    _wrapData(data) {
        return {data: data, timeStamp: new Date().getTime()};
    }

    // 获取本地数据
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (result, error) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result));
                    } catch(error) {
                        reject(error);
                        console.error(error);
                    } 
                } else {
                    reject(error);
                    console.error(error);
                }
            });
        }); 
    }

    // 获取网络数据
    fetchNetworkData(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('network response is not ok');
            })
            .then(responseData => {
                this._saveData(url, responseData, resolve(responseData));
            })
            .catch(error => {
                reject(error);
                console.error(error);
            });
        });
    }

    // 获取数据，优先获取本地数据，如果没有本地数据或者本地数据已经过期，则获取网络数据
    fetchData(url) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url)
                .then((wrapData) => {
                    if (wrapData && DataStore.checkDataIsExpired(wrapData.timeStamp)) {
                        resolve(wrapData);
                    } else {
                        this.fetchNetworkData(url)
                            .then(responseData => {
                                resolve(this._wrapData(responseData));
                            })
                            .catch(error => {
                                reject(error);
                                console.error(error);
                            });
                    }
                })
                .catch(error => {
                    this.fetchNetworkData(url)
                        .then(responseData => {
                            resolve(this._wrapData(responseData));
                        })
                        .catch(error => {
                            reject(error);
                            console.error(error);
                        });
                })
        })
    }

    // 检查数据是否过期
    static checkDataIsExpired(timeStamp) {
        let currentDate = new Date();
        let targetDate = new Date();
        targetDate.setTime(timeStamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) return true;
        if (currentDate.getDay() !== targetDate.getDay()) return true;
        if (currentDate.getHours() - targetDate.getHours() > 4) return true;
        return false;
    }
}