import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PopularPage from './PopularPage';
import TrendingPage from './TrendingPage';
import FavoritePage from './FavoritePage';
import Mypage from './Mypage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const Tab = createBottomTabNavigator();
export default class TabbarPage extends React.Component {
    render() {
        return (
            <Tab.Navigator 
                screenOptions = {
                    ({route}) => ({
                        tabBarIcon: ({focused, color, size}) => {
                            let iconName = '';
                            if (route.name === '最热')  {
                                iconName = 'whatshot';
                                return <MaterialIcons name={iconName} size={size} color={color} />;
                            } else if (route.name === '趋势')  {
                                iconName = 'md-trending-up';
                                return <Ionicons name={iconName} size={size} color={color} />;
                            } else if (route.name === '趋势')  {
                                iconName = 'favotite';
                                return <MaterialIcons name={iconName} size={size} color={color} />;
                            } else {
                                iconName = 'user';
                                return <Entypo name={iconName} size={size} color={color} />;
                            }   
                        }
                    })
                }
                tabBarOptions = {{
                    inactiveTintColor: 'gray',
                    activeTintColor: 'red',
                }}
            >
                <Tab.Screen name = "最热" component = {PopularPage} />
                <Tab.Screen name = "趋势" component = {TrendingPage} />
                <Tab.Screen name = "收藏" component = {FavoritePage} />
                <Tab.Screen name = "我的" component = {Mypage} />
            </Tab.Navigator>
        );
    }
}