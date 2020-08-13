import React from 'react';
import {View, StyleSheet,FlatList, RefreshControl, Text, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import actions from '../actions';
import NavigatorBar from '../public/NavigatorBar'
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import PopularItem from '../public/PopularItem';
import NavigationUtils from '../utils/NavigationUtils';
import Toast from 'react-native-easy-toast';
import FavoriteUtils from '../utils/FavoriteUtils';
import FavoriteDao from '../dao/FavoriteDao';
import { FLAG_STORAGE } from '../dao/DataStorage';

const Tab = createMaterialTopTabNavigator();
class PopularPage extends React.Component {
    constructor(props) {
        super(props);
        this.keys = ['java', 'ios', 'php', 'javascript'];
    }

    componentDidMount() {
       
    }

    _genScreens() {
        let tabs = [];
        this.keys.forEach((item, index) => {
            tabs.push(<Tab.Screen name = {item} key = {item}>{props => <PopularTabPage {...props}/>}</Tab.Screen>);
        });
        return tabs;
    }

    render() {
        let navigator = <NavigatorBar 
            title = "最热"

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
            </SafeAreaViewPlus>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    
});

export default connect(null, mapDispatchToProps)(PopularPage);

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
const pageSize = 10;
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
class PopularTab extends React.Component {
    constructor(props) {
        super(props);
        const {name} = props.route;
        this.storeName = name;
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(loadMore = false, refreshFavorite = false) {
        let store = this.fetchStore();
        const {onloadPopularData, onloadMorePopularData} = this.props;
        let url = this.genFetchUrl(this.storeName);
        if (loadMore) {
            onloadMorePopularData(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('no more data');
            });
        } else if (refreshFavorite) {
            
        } else {
            onloadPopularData(this.storeName, url, pageSize, favoriteDao);
        }
    }

    genFetchUrl(key) {
        return URL + key + QUERY_STR;
    }

    fetchStore() {
        const {popular} = this.props;
        let store = popular[this.storeName];
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
            <PopularItem 
                projectModel = {item}
                onSelect = {(callback) => {
                    const {navigation} = this.props;
                    NavigationUtils.goPage(navigation, 'DetailPage', {
                        projectModel: item,
                        callback,
                    });
                }}
                onFavorite = {(item, isFavorite) => {
                    FavoriteUtils.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular);
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
                keyExtractor = {item => "" + item.item.id}
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
    popular: state.popular,
});

const mapPopularTabDispatchToProps = dispatch => ({
    onloadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onloadPopularData(storeName, url, pageSize, favoriteDao)),
    onloadMorePopularData: (storeName, pageIndex, pageSize, items, favorite, callback) => dispatch(actions.onloadMorePopularData(storeName, pageIndex, pageSize, items, favorite, callback)),
});

const PopularTabPage = connect(mapPopularTabStateToProps, mapPopularTabDispatchToProps)(PopularTab);


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