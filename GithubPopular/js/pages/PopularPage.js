import React from 'react';
import {View, StyleSheet,FlatList, RefreshControl, Text} from 'react-native';
import {connect} from 'react-redux';
import actions from '../actions';
import NavigatorBar from '../public/NavigatorBar'
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'


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
        const {onloadPopularData} = this.props;
        let url = this.genFetchUrl(this.storeName);
        if (loadMore) {

        } else if (refreshFavorite) {

        } else {
            onloadPopularData(this.storeName, url, pageSize);
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
        return <View style = {styles.container}>
            <Text>{data}</Text>
        </View>
    }

    render() {
        let store = this.fetchStore();
        return (<View>
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
            />
        </View>);
    }
}

const mapPopularTabStateToProps = state => ({
    popular: state.popular,
});

const mapPopularTabDispatchToProps = dispatch => ({
    onloadPopularData: (storeName, url, pageSize, favoriteDao) => dispatch(actions.onloadPopularData(storeName, url, pageSize, favoriteDao)),
});

const PopularTabPage = connect(mapPopularTabStateToProps, mapPopularTabDispatchToProps)(PopularTab);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});