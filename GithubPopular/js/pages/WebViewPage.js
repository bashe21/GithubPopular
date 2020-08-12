import React from 'react';
import {StyleSheet} from 'react-native';
import NavigatorBar from '../public/NavigatorBar';
import NavigationUtils from '../utils/NavigationUtils';
import ViewUtils from '../utils/ViewUtils';
import SafeAreaViewPlus from '../public/SafeAreaViewPlus';
import {WebView} from 'react-native-webview';

export default class WebViewPage extends React.Component {
    constructor(props) {
        super(props);
        const {title, url} = props.route.params;
        this.state = {
            title: title,
            url: url,
            canGoBack: false,
        };
    }

    onNavigationStateChange(navState) {
        this.setState({
            url: navState.url,
            canGoBack: navState.canGoBack,
        });
    }

    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack();
        } else {
            NavigationUtils.goBack(this.props.navigaton);
        }
    }

    render() {
        let navigator = <NavigatorBar 
            title={this.state.title}
            leftButton={ViewUtils.getLeftBackButton(() => this.onBack())}
        />;

        return (
            <SafeAreaViewPlus>
                {navigator}
                <WebView 
                    ref = {(webView) => this.webView = webView}
                    startInLoadingState = {true}
                    onNavigationStateChange = {(e) = this.onNavigationStateChange(e)}
                    source = {{uri: this.state.url}}
                />
            </SafeAreaViewPlus>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});