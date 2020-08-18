import React from 'react';
import {View, StyleSheet,FlatList, RefreshControl, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux';
import actions from '../actions';
import NavigatorBar from '../public/NavigatorBar'
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import PopularItem from '../public/PopularItem';
import TrendingItem from '../public/TrendingItem';
import NavigationUtils from '../utils/NavigationUtils';
import FavoriteDao from '../dao/FavoriteDao';
import {FLAG_STORAGE} from '../dao/DataStorage';
import FavoriteUtils from '../utils/FavoriteUtils';
import EventTypes from '../utils/EventTypes';

const Tab = createMaterialTopTabNavigator();
class FavoritePage extends React.Component {
    constructor(props) {
        super(props);
        this.keys = ['最热', '趋势'];
        this.flags = [FLAG_STORAGE.flag_popular, FLAG_STORAGE.flag_trending];
    }

    componentDidMount() {
       
    }

    _genScreens() {
        let tabs = [];
        this.keys.forEach((item, index) => {
            tabs.push(<Tab.Screen name = {item} key = {item}>{props => <FavoriteTabPage {...props} flag={this.flags[index]} theme={this.props.theme} />}</Tab.Screen>);
        });
        return tabs;
    }

    render() {
        const {theme} = this.props;
        let navigator = <NavigatorBar 
            title = "收藏"
            style = {theme.styles.navBar}
        />;

        let topTab = <Tab.Navigator
            tabBarOptions = {{
                tabStyle: {
                    backgroundColor: 'white',
                    marginBottom: 2,
                },
                scrollEnabled: false,
                activeTintColor: 'red',
                inactiveTintColor: 'black',
                indicatorStyle: {
                    backgroundColor: 'red',
                    height: 2,
                }
            }}
            lazy = {true}
        >
            {this._genScreens()}
        </Tab.Navigator>;

        return (
            <SafeAreaViewPlus
                topColor = {theme.themeColor}
            >
                {navigator}
                {topTab}
            </SafeAreaViewPlus>
        );
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme,
})

export default connect(mapStateToProps)(FavoritePage);

class FavoriteTab extends React.Component {
    constructor(props) {
        super(props);
        const {flag} = props;
        this.storeName = flag;
        this.favoriteDao = new FavoriteDao(flag);
    }

    componentDidMount() {
        this.loadData(false);
        this.tabPress_listener = DeviceEventEmitter.addListener(EventTypes.favorite_tabPress, () => {
            this.loadData();
        });
    }

    loadData(isShowLoading) {
        const {onloadFavoriteData} = this.props;
        onloadFavoriteData(this.storeName, isShowLoading);
    }


    fetchStore() {
        const {favorite} = this.props;
        let store = favorite[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
            }
        }
        return store;
    }

    onFavorite(item, isFavorite) {
        FavoriteUtils.onFavorite(this.favoriteDao, item, isFavorite, this.storeName);
        if (this.storeName == FLAG_STORAGE.flag_popular) {
            DeviceEventEmitter.emit(EventTypes.favorite_change_popular);
        } else {
            DeviceEventEmitter.emit(EventTypes.favorite_change_trending);
        }
    }

    renderItem(data) {
        const item = data.item;
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
        return (
            <Item 
                projectModel = {item}
                onSelect = {(callback) => {
                    const {navigation} = this.props;
                    NavigationUtils.goPage(navigation, 'DetailPage', {
                        projectModel: item,
                        callback,
                        theme: this.props.theme,
                    });
                }}
                onFavorite = {(item, isFavorite) => {
                    this.onFavorite(item, isFavorite);
                }}
            />
        );
    }

    render() {
        let store = this.fetchStore();
        return (<View style={{flex: 1}}>
            <FlatList 
                data = {store.projectModels}
                renderItem = {(data) => this.renderItem(data)}
                keyExtractor = {item => "" + (item.item.id || item.item.repo)}
                refreshControl = {
                    <RefreshControl 
                        title = {'loading'}
                        titleColor = {'red'}
                        colors = {['red']}
                        refreshing = {store.isLoading}
                        onRefresh = {() => this.loadData(true)}
                        tintColor = {'red'}
                    />
                }
            />
        </View>);
    }
}

const mapPopularTabStateToProps = state => ({
    favorite: state.favorite,
});

const mapPopularTabDispatchToProps = dispatch => ({
    onloadFavoriteData: (storeName, isShowLoading) => dispatch(actions.onloadFavoriteData(storeName, isShowLoading)),
});

const FavoriteTabPage = connect(mapPopularTabStateToProps, mapPopularTabDispatchToProps)(FavoriteTab);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5fcff',
    },

    indicatorContainer: {
        alignItems: 'center',
    },

    indicator: {
        color: 'red',
        margin: 10,
    }
});