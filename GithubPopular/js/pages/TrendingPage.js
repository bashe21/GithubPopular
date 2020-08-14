import React from 'react';
import {View, StyleSheet,FlatList, RefreshControl, Text, ActivityIndicator, TouchableOpacity, DeviceEventEmitter} from 'react-native';
import {connect} from 'react-redux';
import actions from '../actions';
import NavigatorBar from '../public/NavigatorBar'
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import TrendingItem from '../public/TrendingItem';
import NavigationUtils from '../utils/NavigationUtils';
import Toast from 'react-native-easy-toast';
import TrendingDiag, {TimeSpans} from '../public/TrendingDiag';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FLAG_STORAGE } from '../dao/DataStorage';
import FavoriteUtils from '../utils/FavoriteUtils';
import FavoriteDao from '../dao/FavoriteDao';
import EventTypes from '../utils/EventTypes';

const DEVICE_EVENT_TIMESPAN_CHANGE = 'DEVICE_EVENT_TIMESPAN_CHANGE';
const Tab = createMaterialTopTabNavigator();
class TrendingPage extends React.Component {
    constructor(props) {
        super(props);
        this.keys = ['swift', 'ios', 'php', 'javascript'];
        this.state = {
            timeSpan: TimeSpans[0],
        }
    }

    componentDidMount() {
       console.log('componentDidMount');
    }

    _genScreens() {
        let tabs = [];
        this.keys.forEach((item, index) => {
            tabs.push(<Tab.Screen name = {item} key = {item}>{props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan}/>}</Tab.Screen>);
        });
        return tabs;
    }

    renderTitleView() {
        return (
            <View>
                <TouchableOpacity
                    underlayColor={'transparent'}
                    onPress={() => this.dialog.show()}
                >
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'white', fontWeight: '400'}}>趋势 {this.state.timeSpan.showText}</Text>
                        <MaterialIcons 
                            name={'arrow-drop-down'}
                            size={22}
                            style={{color: 'white'}}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    onSelectTimeSpan(tab) {
        this.dialog.dismiss();
        this.setState({
            timeSpan: tab,
        });
        DeviceEventEmitter.emit(DEVICE_EVENT_TIMESPAN_CHANGE, tab);
    }

    renderTrendingDiag() {
        return (
            <TrendingDiag 
                ref={dialog => {
                    this.dialog = dialog
                }}
                onSelect={tab => this.onSelectTimeSpan(tab)}
            />
        );
    }

    render() {
        let navigator = <NavigatorBar 
            titleView={this.renderTitleView()}

        />;

        let topTab = <Tab.Navigator
            tabBarOptions = {{
                tabStyle: {
                    width: 120,
                    backgroundColor: 'white',
                    marginBottom: 2,
                },
                scrollEnabled: true,
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
                topColor = 'blue'
            >
                {navigator}
                {topTab}
                {this.renderTrendingDiag()}
            </SafeAreaViewPlus>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    
});

export default connect(null, mapDispatchToProps)(TrendingPage);

const URL = 'https://trendings.herokuapp.com/repo';
const QUERY_STR = '?since=weekly';
const pageSize = 10;
const favorite = new FavoriteDao(FLAG_STORAGE.flag_trending);
class TrendingTab extends React.Component {
    constructor(props) {
        super(props);
        const {name} = props.route;
        this.storeName = name;
        this.timeSpan = props.timeSpan;
        this.isFavoriteChange = false;
    }

    componentWillMount() {
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(DEVICE_EVENT_TIMESPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan;
            this.loadData();
        });
    }

    componentDidMount() {
        this.loadData();
        this.favorite_change_listener = DeviceEventEmitter.addListener(EventTypes.favorite_change_trending, (data) => {
            this.isFavoriteChange = true;
        });
        this.tabPress_listener = DeviceEventEmitter.addListener(EventTypes.trending_tabPress, () => {
            if (this.isFavoriteChange) {
                this.loadData(false, true);
            }
        })
    }

    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove();
        }
        if (this.favorite_change_listener) {
            this.favorite_change_listener.remove();
        }
        if (this.tabPress_listener) {
            this.tabPress_listener.remove();
        }
    }

    loadData(loadMore = false, refreshFavorite = false) {
        let store = this.fetchStore();
        const {onloadTrendingData, onloadMoreTrendingData, onflushTrendingFavoriteData} = this.props;
        let url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onloadMoreTrendingData(this.storeName, ++store.pageIndex, pageSize, store.items, favorite, callback => {
                this.refs.toast.show('no more data');
            });
        } else if (refreshFavorite) {
            onflushTrendingFavoriteData(this.storeName, store.pageIndex, pageSize, store.items, favorite);
        } else {
            onloadTrendingData(this.storeName, url, pageSize, favorite);
        }
    }

    genFetchUrl(key) {
        return URL + `?${this.timeSpan.searchText}` + `&lang=${key}`;
    }

    fetchStore() {
        const {trending} = this.props;
        let store = trending[this.storeName];
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true,
            }
        }
        return store;
    }

    renderItem(data) {
        const item = data.item;

        return (
            <TrendingItem 
                projectModel = {item}
                onSelect = {(callback) => {
                    const {navigation} = this.props;
                    NavigationUtils.goPage(navigation, 'DetailPage', {
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_trending,
                        callback,
                    });
                }}
                onFavorite = {(item, isFavorite) => {
                    FavoriteUtils.onFavorite(favorite, item, isFavorite, FLAG_STORAGE.flag_trending);
                }}
            />
        );
    }

    genFooterIndicator() {
        let store = this.fetchStore();
        store.hideLoadingMore ? null : (
            <View style={styles.indicatorContainer}>
                <ActivityIndicator style={styles.indicator}/>
                <Text>正在加载更多</Text>
            </View>
        );
    }

    render() {
        let store = this.fetchStore();
        return (<View style={{flex: 1}}>
            <FlatList 
                data = {store.projectModels}
                renderItem = {(data) => this.renderItem(data)}
                keyExtractor = {item => "" + (item.item.repo_link)}
                refreshControl = {
                    <RefreshControl 
                        title = {'loading'}
                        titleColor = {'red'}
                        colors = {['red']}
                        refreshing = {store.isLoading}
                        onRefresh = {() => this.loadData()}
                        tintColor = {'red'}
                    />
                }
                ListFooterComponent = {this.genFooterIndicator()}
                onEndReached = {() => {
                    setTimeout(() => {
                        console.log('----onEndReached----')
                        this.loadData(true);
                    }, 100);
                }}
                onEndReachedThreshold = {0.5}
                onMomentumScrollBegin = {() => {
                    console.log('----onMomentumScrollBegin----')
                }}
            />
            <Toast 
                ref={'toast'}
                positon={'center'}
            />
        </View>);
    }
}

const mapPopularTabStateToProps = state => ({
    trending: state.trending,
});

const mapPopularTabDispatchToProps = dispatch => ({
    onloadTrendingData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onloadTrendingData(storeName, url, pageSize, favoriteDao)),
    onloadMoreTrendingData: (storeName, pageIndex, pageSize, items, favorite, callback) => dispatch(actions.onloadMoreTrendingData(storeName, pageIndex, pageSize, items, favorite, callback)),
    onflushTrendingFavoriteData: (storeName, pageIndex, pageSize, items, favorite) => dispatch(actions.onflushTrendingFavoriteData(storeName, pageIndex, pageSize, items, favorite)),
});

const TrendingTabPage = connect(mapPopularTabStateToProps, mapPopularTabDispatchToProps)(TrendingTab);


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