import React from 'react';
import {View, StyleSheet} from 'react-native';
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
            tabs.push(<Tab.Screen name = {item} key = {item}>{props => <PopularTab {...props}/>}</Tab.Screen>);
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


class PopularTab extends React.Component {
    render() {
        return <View style = {styles.container}/>
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});