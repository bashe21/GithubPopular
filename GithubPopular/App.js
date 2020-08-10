/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {Provider} from 'react-redux';
import store from './js/store';
import ContainerPage from './js/pages/ContainerPage';

class App extends React.Component {
    render() {
        return (
          <Provider store = {store}>
            <ContainerPage />
          </Provider>
        );
    }
}

export default App;
