import React from 'react';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import {View, StyleSheet, ViewPropTypes} from 'react-native';

export default class SafeAreaViewPlus extends React.Component {
    genSafeAreaViewPlus() {
        const {children, topColor, bottomColor, topInset, bottomInset} = this.props;
        return <View style = {[styles.container, this.props.style]}>
            {this.genTopArea(topColor, topInset)}
            {children}
            {this.genBottomArea(bottomColor, bottomInset)}
        </View>
    }

    genSafeAreaView() {
        const {children} = this.props;
        return <View style = {[styles.container, this.props.style]}>
            {children}
        </View>
    }

    genTopArea(topColor, topInset) {
        return !DeviceInfo.hasNotch() || !topInset ? null : 
            <View style = {[styles.topArea, {backgroundColor: topColor}]} />
    }

    genBottomArea(bottomColor, bottomInset) {
        return !DeviceInfo.hasNotch() || !bottomInset ? null : 
            <View style = {[styles.bottomArea, {backgroundColor: bottomColor}]} />
    }

    render() {
        const enablePlus = DeviceInfo.hasNotch();
        return enablePlus ? this.genSafeAreaViewPlus() : this.genSafeAreaView();
    }
}

SafeAreaViewPlus.propTypes = {
    ...ViewPropTypes,
    topColor: PropTypes.string,
    bottomColor: PropTypes.string,
    enablePlus: PropTypes.bool,
    topInset: PropTypes.bool,
    bottomInset: PropTypes.bool,
}

SafeAreaViewPlus.defaultProps = {
    topColor: 'transparent',
    bottomColor: '#f8f8f8',
    enablePlus: true,
    topInset: true,
    bottomInset: false,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    topArea: {
        height: 44,
    },

    bottomArea: {
        height: 34,
    },
});