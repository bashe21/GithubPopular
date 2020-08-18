import React from 'react';
import {View, Linking} from 'react-native';
import ViewUtils from '../../utils/ViewUtils';
import {MoreMenu} from '../../public/MoreMenu';
import GlobalStyles from '../../res/styles/GlobalStyles';
import AboutCommon from './AboutCommon';
import config from '../../res/data/config.json';
import NavigationUtils from '../../utils/NavigationUtils';

export default class AboutPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.route.params;
        this.theme = this.params.theme;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: props.navigation,
        }, data => {this.setState(...data)});
        this.state = {
            data: config,
        }
    }

    onClick(menu) {
        const {navigation} = this.props;
        let routeName, params = {};
        switch(menu) {
            case MoreMenu.Tutorial:
                routeName = 'WebViewPage'
                params = {
                    url: 'https://coding.m.imooc.com/classindex.html?cid=89',
                    title: '教程',
                    theme: this.theme,
                };
                break;
            case MoreMenu.About_Author:
                routeName = 'AboutMePage';
                params = {
                    theme: this.theme,
                }
                break;
            case MoreMenu.Feedback:
                const url = 'mailto://crazycodebody@gmail.com';
                Linking.canOpenURL(url).then((supported) => {
                    if (supported) {
                        Linking.openURL(url);
                    } else {
                        console.log('Can\'t open url:' + url);
                    }
                }).catch(e => {
                    console.log(e);
                })
        }
        if (routeName) {
            NavigationUtils.goPage(navigation, routeName, params);
        }
        
    }

    getItem(menu) {
        return ViewUtils.getMenuItem(() => this.onClick(menu), menu, '#678');
    }

    render() {
        let content = <View>
            {this.getItem(MoreMenu.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.Feedback)}
        </View>;

        return this.aboutCommon.render(content, this.state.data.app);
    }
}