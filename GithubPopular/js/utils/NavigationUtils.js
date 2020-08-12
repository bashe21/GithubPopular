import React from 'react';

export default class NavigationUtils extends React.Component {
    static goBack(navigation) {
        navigation.goBack();
    }

    static goPage(navigation, routeName, params) {
        navigation.navigate(routeName, params);
    }
}