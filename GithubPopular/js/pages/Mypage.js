import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {MoreMenu} from '../public/MoreMenu';
import NavigatorBar from '../public/NavigatorBar';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import GlobalStyles from '../res/styles/GlobalStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ViewUtils from '../utils/ViewUtils';
import NavigationUtils from '../utils/NavigationUtils';
import {FLAG_LANGUAGE} from '../dao/LanguageDao';

export default class MyPage extends React.Component {
    onClick(menu) {
        const {navigation} = this.props;
        let routeName, params = {};
        switch(menu) {
            case MoreMenu.About:
                routeName = 'AboutPage';
                break;
            case MoreMenu.Tutorial:
                routeName = 'WebViewPage';
                params = {
                    url: 'https://coding.m.imooc.com/classindex.html?cid=89',
                    title: '教程',
                }
                break;
            case MoreMenu.Sort_Language:
                routeName = 'SortKeyPage';
                params = {
                    flag: FLAG_LANGUAGE.flag_language,
                }
                break;
            case MoreMenu.Sort_Key:
                routeName = 'SortKeyPage';
                params = {
                    flag: FLAG_LANGUAGE.flag_key,
                }
                break;
            default: 
                break;
        }
        if (routeName) {
            NavigationUtils.goPage(navigation, routeName, params);
        }
    }

    getItem(menu) {
        return ViewUtils.getMenuItem(() => this.onClick(menu), menu, '#678');
    }

    render() {
        let navigartor = <NavigatorBar title={'我的'}/>;
        let content = <ScrollView>
            <TouchableOpacity 
                onPress={() => this.onClick(MoreMenu.About)}
                style={styles.item}
            >
                <View style={styles.about_left}>
                    <Ionicons 
                        name={MoreMenu.About.icon}
                        size={40}
                        style={{marginRight: 40, color: '#678'}}
                    />
                    <Text>Github Popular</Text>
                </View>
                <Ionicons 
                    name={'ios-arrow-forward'}
                    size={16}
                    style={{marginLeft: 10, alignSelf: 'center', color: '#678'}}
                />
            </TouchableOpacity>
            <View style={GlobalStyles.line}/>

            {this.getItem(MoreMenu.Tutorial)}
            <View style={GlobalStyles.line}/>

            {/* {趋势管理} */}
            <Text style = {styles.groupTitle}>趋势管理</Text>
            {/* {自定义语言} */}
            {this.getItem(MoreMenu.Custom_Language)}
            <View style={GlobalStyles.line}/>
            {/* {语言排序} */}
            {this.getItem(MoreMenu.Sort_Language)}

            {/* {最热管理} */}
            <Text style = {styles.groupTitle}>最热管理</Text>
            {/* {自定义标签} */}
            {this.getItem(MoreMenu.Custom_Key)}
            {/* {标签排序} */}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.Sort_Key)}
            {/* {标签移除} */}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.Remove_Key)}

            {/* {设置管理} */}
            <Text style = {styles.groupTitle}>设置</Text>
            {/* {自定义主题} */}
            {this.getItem(MoreMenu.Custom_Theme)}
            {/* {关于作者} */}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.About_Author)}
            {/* {反馈} */}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.Feedback)}
            {/* {CodePush} */}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.CodePush)}
        </ScrollView>;
        return (
            <SafeAreaViewPlus topColor={'blue'}>
                {navigartor}
                {content}
            </SafeAreaViewPlus>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    about_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    item: {
        backgroundColor: 'white',
        padding: 10,
        height: 90,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    groupTitle: {
        marginLeft: 10, 
        marginTop: 10, 
        marginBottom: 5, 
        fontSize: 12, 
        color: 'gray',
    }
});