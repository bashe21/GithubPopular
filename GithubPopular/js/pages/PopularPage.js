import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class PopularPage extends React.Component {
    render() {
        return (
            <View style = {styel.container}>
                <Text>Popular</Text>
            </View>
        );
    }
}

const styel = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});