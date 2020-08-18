import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabbarPage from './TabbarPage';
import DetailPage from './DetailPage';
import WebViewPage from './WebViewPage';
import AboutPage from './about/AboutPage';
import AboutMePage from './about/AboutMePage';
import SortKeyPage from './SortKeyPage';
import CustomKeyPage from './CustomKeyPage';

const Stack = createStackNavigator();
export default class MainPage extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name = "TabbarPage" component = {TabbarPage} options = {{headerShown: false}}/>
                    <Stack.Screen name = "DetailPage" component = {DetailPage} options = {{headerShown: false}}/>
                    <Stack.Screen name = "WebViewPage" component = {WebViewPage} options = {{headerShown: false}}/>
                    <Stack.Screen name = "AboutPage" component = {AboutPage} options = {{headerShown: false}}/>
                    <Stack.Screen name = "AboutMePage" component = {AboutMePage} options = {{headerShown: false}}/>
                    <Stack.Screen name = "SortKeyPage" component = {SortKeyPage} options = {{headerShown: false}}/>
                    <Stack.Screen name = "CustomKeyPage" component = {CustomKeyPage} options = {{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
