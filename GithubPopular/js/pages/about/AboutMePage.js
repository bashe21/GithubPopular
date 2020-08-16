import React from 'react';
import {View} from 'react-native';
import ViewUtils from '../../utils/ViewUtils';
import {MoreMenu} from '../../public/MoreMenu';
import GlobalStyles from '../../res/styles/GlobalStyles';
import AboutCommon from './AboutCommon';
import config from '../../res/data/config.json';
import NavigationUtils from '../../utils/NavigationUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';
import { floor } from 'react-native-reanimated';

export default class AboutMePage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.route.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: props.navigation,
        }, data => {this.setState(...data)});
        this.state = {
            data: config,
            showTutarial: true,
            showBlog: false,
            showQQ: false,
            showContact: false,
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
                };
                break;
            
                
        }
        if (routeName) {
            NavigationUtils.goPage(navigation, routeName, params);
        }
        
    }

    _item(data, isShow, key) {
        return (
            ViewUtils.getSettingItem(() => this.setState({
                [key]: !this.state.key,
            }), data.name, '#678', Ionicons, data.icon, isShow? 'ios-arrow-up' : 'ios-arrow-down')
        );
    }

    renderItem(items, isShowAccount) {
        if (!items) return null;
        let content = [];
        // items.forEach((item, i) => {
        //     let title = isShowAccount ? (item.title + `:${item.account}`) : item.title;
        //     content.push(
        //         <View key={i}>
        //             {ViewUtils.getSettingItem(() => this.onClick(items), title, '#678')}
        //             <View style={GlobalStyles.line} />
        //         </View>
        //     )
        // })
        for (let i in items) {
            let title = isShowAccount ? (items[i].title + `:${items[i].account}`) : items[i].title;
            content.push(
                <View key={i}>
                    {ViewUtils.getSettingItem(() => this.onClick(items[i]), title, '#678')}
                    <View style={GlobalStyles.line} />
                </View>
            )
        }
        return content;
    }

    render() {
        let content = <View>
            {this._item(this.state.data.aboutMe.Tutorial, this.state.showTutarial, 'showTutarial')}
            <View style={GlobalStyles.line} />
            {this.state.showTutarial ? this.renderItem(this.state.data.aboutMe.Tutorial.items) : null}

            {this._item(this.state.data.aboutMe.Blog, this.state.showBlog, 'showBlog')}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItem(this.state.data.aboutMe.Blog.items) : null}

            {this._item(this.state.data.aboutMe.QQ, this.state.showQQ, 'showQQ')}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItem(this.state.data.aboutMe.QQ.items) : null}

            {this._item(this.state.data.aboutMe.Contact, this.state.showContact, 'showContact')}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItem(this.state.data.aboutMe.Contact.items, true) : null}
        </View>;

        return <View style={{flex: 1}}>
            {this.aboutCommon.render(content, this.state.data.author)}
            <Toast 
                ref={(toast => this.toast = toast)}
                position={'center'}
            />
        </View>;
    }
}