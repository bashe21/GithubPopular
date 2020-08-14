import React from 'react';
import {TouchableOpacity} from 'react-native';
import NavigatorBar from '../public/NavigatorBar';
import NavigationUtils from '../utils/NavigationUtils';
import ViewUtils from '../utils/ViewUtils';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import {WebView} from 'react-native-webview';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FavoriteDao from '../dao/FavoriteDao';

export default class DetailPage extends React.Component {
    constructor(props) {
        super(props);
        const {projectModel, flag} = props.route.params;
        this.url = projectModel.item.html_url || projectModel.item.repo_link;
        const title = projectModel.item.full_name || projectModel.item.repo;
        this.favoriteDao = new FavoriteDao(flag);
        this.state = {
            title: title,
            url: this.url,
            canGoBack: false,
            isFavorite: projectModel.isFavorite,
        };
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtils.goBack(this.props.navigation);
        }
    }

    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url,
        });
    }

    onFavoriteButtonClick() {
        const {projectModel, callback} = this.props.route.params;
        const isFavorite = projectModel.isFavorite = !projectModel.isFavorite;
        this.setState({isFavorite: isFavorite});
        callback(isFavorite);
        let key = projectModel.item.repo || projectModel.item.id.toString();
        if (projectModel.isFavorite) {
            this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item));
        } else {
            this.favoriteDao.removeFavoriteItem(key);
        }
    }

    renderRightButton() {
        return (
            <TouchableOpacity
                onPress={() => this.onFavoriteButtonClick()}
                style={{flexDirection: 'row', alignItems: 'center'}}
            >
                <FontAwesome 
                    name={this.state.isFavorite ? 'star' : 'star-o'}
                    size={20}
                    style={{color: 'white', marginRight: 15}}
                />
                {ViewUtils.getRightShareButton()}
            </TouchableOpacity>
        );
    }

    render() {
        let navigatorBar = <NavigatorBar 
            title={this.state.title}
            leftButton={ViewUtils.getLeftBackButton(() => this.onBack())}
            rightButton={this.renderRightButton()}
        />;

        return (
            <SafeAreaViewPlus>
                {navigatorBar}
                <WebView 
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{uri: this.state.url}}
                />
            </SafeAreaViewPlus>
        );
    }

}