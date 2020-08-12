import React from 'react';
import {TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class ViewUtils {
    // 获取左侧返回按钮
    static getLeftBackButton(callback) {
        return (
            <TouchableOpacity
                style={{padding: 8, paddingLeft: 12}}
                onPress={callback}
            >
                <Ionicons 
                    name={'ios-arrow-back'}
                    size={26}
                    style={{color: 'white'}}
                />
            </TouchableOpacity>
        );
    }

    // 获取右侧分享按钮
    static getRightShareButton(callback) {
        return (
            <TouchableOpacity
                underlayColor={'transparent'}
                onPress={callback}
            >
                <Ionicons 
                    name={'md-share'}
                    size={20}
                    style={{color: 'white', opacity: 0.9, marginRight: 10}}
                />

            </TouchableOpacity>
        );
    }
}