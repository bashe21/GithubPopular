import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import TabbarPage from './TabbarPage';

const Stack = createStackNavigator();
export default class MainPage extends React.Component {
    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name = "TabbarPage" component = {TabbarPage} options = {{headerShown: false}}/>
                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
