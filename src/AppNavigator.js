import React, {Component} from 'react';
import {ScreenStack} from './registerScreens';
import {
    addNavigationHelpers,
} from 'react-navigation';
import {connect} from "react-redux";
import {
    createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';
import {BackHandler } from 'react-native'
import {NavigationActions} from 'react-navigation'

function mapStateToProps (state) {
    return {
        nav: state.nav,
    }
}

const addListener = createReduxBoundAddListener("root");

class AppNavigator extends Component {
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    onBackPress() {
        const { dispatch, nav } = this.props;
        const activeRoute = nav.routes[nav.index];
        if (activeRoute.index === 0) {
            return false;
        }
        dispatch(NavigationActions.back());
        return true;
    }

    render() {
        return (
            <ScreenStack navigation={addNavigationHelpers({
                dispatch: this.props.dispatch,
                state: this.props.nav,
                addListener,
            })} />
        )
    };
}

export default connect(mapStateToProps)(AppNavigator);