import React from 'react';
import {Platform, View, Image, Text, Dimensions, StyleSheet} from 'react-native';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtils from '../../utils/ViewUtils';
import NavigationUtils from '../../utils/NavigationUtils';
import BackPressComponent from '../BackPressComponent';
import DeviceInfo from 'react-native-device-info'
import GlobalStyles from '../../res/styles/GlobalStyles';

const AVATAR_SIZE = 90;
const PARALLAX_HEADER_HEIGHT = 270;
const TOP = (Platform.OS === 'ios') ? 20 + (DeviceInfo.hasNotch() ? 24 : 0) : 0;
const STICKY_HEADER_HEIGHT = (Platform.OS === 'ios') ? ( GlobalStyles.nav_bar_height_ios + TOP) : GlobalStyles.nav_bar_height_android;
const window = Dimensions.get('window');

export default class AboutCommon {
    constructor(props, updateState) {
      this.props = props;
        this.updateState = updateState;
        this.backPress = new BackPressComponent({backPress: () => this.onBackPress()});
    }

    componentDidMount() {
        this.backPress.componentDidMount();
        this.fetchData();
    }

    componentWillUnmount() {
        this.backPress.componentWillUnmount();
    }

    onBackPress() {
        NavigationUtils.goBack(this.props.navigation);
        return true;
    }

    fetchData() {
        const url = 'http://www.devio.org/io/GitHubPopular/json/github_app_config.json';
        fetch(url).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Network Error');
        }).then(config => {
            if (config) {
                this.updateState({
                    data: config,
                });
            }
        }).catch(e => {
            console.log(e);
        });
    }

    getParallaxRenderConfig(params) {
        let config = {};
        config.renderBackground = () => (
            <View key="background">
                <Image source={{uri: params.backgroundImg,
                                width: window.width,
                                height: PARALLAX_HEADER_HEIGHT}}/>
                <View style={{position: 'absolute',
                              top: 0,
                              width: window.width,
                              backgroundColor: 'rgba(0,0,0,0.4)',
                              height: PARALLAX_HEADER_HEIGHT}}/>
            </View>
        );

        let avatar = typeof(params.avatar) === 'string' ? {uri: params.avatar} : params.avatar;
        config.renderForeground = () => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar } source={avatar}/>
                <Text style={ styles.sectionSpeakerText }>
                  {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                  {params.description}
                </Text>
            </View>
        );

        config.renderStickyHeader = () => (
            <View key="sticky-header" style={styles.stickySection}>
              <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
          )

          config.renderFixedHeader = () => (
            <View key="fixed-header" style={styles.fixedSection}>
              {ViewUtils.getLeftBackButton(() => {
                  NavigationUtils.goBack(this.props.navigation);
              })}
              {ViewUtils.getRightShareButton(() => this.onShare())}
            </View>
          )

        return config;
    }

    render(contentView, params) {
        const renderConfig = this.getParallaxRenderConfig(params);
        return (
            <ParallaxScrollView
              backgroundColor={'#678'}
              contentBackgroundColor={GlobalStyles.backgroundColor}
              parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
              stickyHeaderHeight={STICKY_HEADER_HEIGHT}
              backgroundScrollSpeed={10}
              {...renderConfig}
              >
                  {contentView}
            </ParallaxScrollView>
          );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black'
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: window.width,
      height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
      height: STICKY_HEADER_HEIGHT,
      justifyContent: 'flex-end',
      paddingTop: TOP,
      alignItems: 'center',
    },
    stickySectionText: {
      color: 'white',
      fontSize: 20,
      margin: 10
    },
    fixedSection: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      paddingRight: 8,
      paddingTop: Platform.OS === 'ios' ? 20 : 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: TOP,
    },
    fixedSectionText: {
      color: '#999',
      fontSize: 20
    },
    parallaxHeader: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      paddingTop: 100
    },
    avatar: {
      marginBottom: 10,
      borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
      color: 'white',
      fontSize: 24,
      paddingVertical: 5,
      marginBottom: 10,
    },
    sectionTitleText: {
      color: 'white',
      fontSize: 16,
      marginLeft: 10,
      marginRight: 10,
    },
  });