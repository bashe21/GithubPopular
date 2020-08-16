import React from 'react';
import {View, Linking, Clipboard} from 'react-native';
import ViewUtils from '../../utils/ViewUtils';
import {MoreMenu} from '../../public/MoreMenu';
import GlobalStyles from '../../res/styles/GlobalStyles';
import AboutCommon from './AboutCommon';
import config from '../../res/data/config.json';
import NavigationUtils from '../../utils/NavigationUtils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-easy-toast';

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
        if (!menu) return;
        const {navigation} = this.props;
        if (menu.url) {
            NavigationUtils.goPage(navigation, 'WebViewPage', {
                url: menu.url,
                title: menu.title,
            });
            return;
        }
        
        if (menu.account && menu.account.indexOf('@') > -1) {
            let url = 'mainto' + menu.account;
            Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log('Can\'t open url:' + url);
                }
            }).catch(e => {
                console.log(e);
            });

            Clipboard.setString(tab.account);
            this.toast.show(menu.title + menu.account + '已复制到剪切板');
        }
        
    }

    _item(data, isShow, key) {
        let Icon = Ionicons;
        if (key === 'showContact') {
            Icon = MaterialIcons;
        }
        return (
            ViewUtils.getSettingItem(() => {
                this.setState({
                    [key]: !this.state[key],
                });
            }, data.name, '#678', Icon, data.icon, isShow? 'ios-arrow-up' : 'ios-arrow-down')
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