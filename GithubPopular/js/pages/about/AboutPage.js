import React from 'react';
import {View} from 'react-native';
import ViewUtils from '../../utils/ViewUtils';
import {MoreMenu} from '../../public/MoreMenu';
import GlobalStyles from '../../res/styles/GlobalStyles';
import AboutCommon from './AboutCommon';

export default class AboutPage extends React.Component {
    constructor(props) {
        super(props);
        this.params = props.route.params;
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: props.navigation,
        }, data => {this.setState(...data)});
    }

    onClick(menu) {

    }

    getItem(menu) {
        return ViewUtils.getMenuItem(() => this.onClick(menu), menu, '#678');
    }

    render() {
        let content = <View>
            {this.getItem(MoreMenu.Tutorial)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MoreMenu.Feedback)}
        </View>;

        return this.aboutCommon.render(content, this.state.data.app);
    }
}