import React from 'react';
import PropTypes from 'prop-types';
import DeviceInfo from 'react-native-device-info';
import {Platform, View, StyleSheet, ViewPropTypes, StatusBar, Text} from 'react-native';

const NAV_BAR_HEIGHT_IOS = 44;
const NAV_BAR_HEIGHT_ANDROID = 50;
const STATUS_BAR_HEIGHT = DeviceInfo.hasNotch() ? 0 : 20; // 状态栏高度

export default class NavigatorBar extends React.Component {
    render() {
        let statusBar = this.props.statusBar.hidden ? null : 
        <View style = {styles.statusBar}>
            <StatusBar {...this.props.statusBar}/>
        </View>;

        let titleView = this.props.titleView ? this.props.titleView : 
        <Text ellipsizeMode = 'head' numberOfLines = {1} style = {styles.title}>{this.props.title}</Text>;

        let content = this.props.hide ? null : 
        <View style = {styles.navBar}>
            <View style = {styles.leftButton}>
                {this.props.leftButton}
            </View>

            <View style = {[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                {titleView}
            </View>

            <View style = {styles.rightButton}>
                {this.props.rightButton}
            </View>
        </View>;

        return (
            <View style = {[styles.container, this.props.style]}>
                {statusBar}
                {content}
            </View>
        );
    }
}

NavigatorBar.propTypes = {
    style: ViewPropTypes.style,
    title: PropTypes.string,
    titleView: PropTypes.element,
    titleLayoutStyle: ViewPropTypes.style,
    hide: PropTypes.bool,
    statusBar: PropTypes.shape(StatusBarShape),
    rightButton: PropTypes.element,
    leftButton: PropTypes.element,
}

const StatusBarShape= { // 设置状态栏所接受的属性
    barStyle: PropTypes.oneOf((['light-content', 'default'])),
    hidden: PropTypes.bool,
    background: PropTypes.string,
}

// 设置默认属性
NavigatorBar.defaultProps = {
    statusBar: {
        barStyle: 'light-content',
        hidden: false,
    }
}

const styles = StyleSheet.create({
    navBarButton: {
        alignItems: 'center',
    },

    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
    },

    title: {
        fontSize: 20,
        color: 'white',
    },

    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ?  NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
        paddingTop: 20,
    },

    container: {
        backgroundColor: '#2196f3',
    },

    navBarTitleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 60,
        right: 60,
        top: 0,
        bottom: 0,
    },

    leftButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: 60,
        top: 0,
        bottom: 0,
        left: 2,
    }, 

    rightButton: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: 60,
        top: 0,
        bottom: 0,
        right: 2,
    }
});