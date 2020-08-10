import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import actions from '../actions';
import {connect} from 'react-redux';

class WelcomePage extends React.Component {
    componentDidMount() {
        const {launchApp} = this.props;
        setTimeout(() => {
            launchApp();
        }, 2.0);
    }

    render() {
        return (
            <View style = {styel.container}>
                <Text>Welcome!</Text>
            </View>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    launchApp: () => dispatch(actions.launchApp()),
});

export default connect(null, mapDispatchToProps)(WelcomePage);

const styel = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});