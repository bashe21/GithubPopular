import React from 'react';
import WelcomePage from './WelcomePage';
import MainPage from './MainPage';
import {connect} from 'react-redux';

class ContainerPage extends React.Component {
    render() {
        const {isLoaded} = this.props;
        return (isLoaded ? <MainPage /> : <WelcomePage />);
    }
}

const mapToProps = state => ({
    isLoaded: state.launch.isLoaded,
});

export default connect(mapToProps)(ContainerPage);