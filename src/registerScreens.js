import {StackNavigator, TabNavigator} from 'react-navigation'
import ExploreStack from './screenStacks/ExploreStack'
import SaveStack from "./screenStacks/SaveStack";
import NotificationStack from './screenStacks/NotificationStack'
import {Image, StyleSheet, NativeModules} from "react-native";
import React from "react";
import {colors} from "./constants/colors";
import {strings} from "./constants/strings";
import {defaultHeaderStyle} from "./constants/theme";
import Authentication from "./screens/Authentication/Authentication";

const TabNav = TabNavigator({
    EXPLORE: {
        screen: ExploreStack,
        navigationOptions: ({navigation}) => ({
            title: 'Today I learnt',
            tabBarLabel: strings.exploreHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({tintColor}) => (<Image source={require('./assets/ic_explore.png')} style={[{tintColor: tintColor}, styles.tabBarIcon]}/>),
        }),
    },
    SAVED: {
        screen: SaveStack,
        navigationOptions: ({navigation}) => ({
            title: 'Saved',
            tabBarLabel: strings.bookmarkHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({tintColor}) => (<Image source={require('./assets/ic_saved.png')} style={[{tintColor: tintColor}, styles.tabBarIcon]}/>),
        }),
    },
    NOTIFICATIONS: {
        screen: NotificationStack,
        navigationOptions: ({navigation}) => ({
            title: 'Following',
            tabBarLabel: strings.notificationHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({tintColor}) => (<Image source={require('./assets/ic_notification.png')} style={[{tintColor: tintColor}, styles.tabBarIcon]}/>),
        }),
    },
    Me: {
        screen: MeStack,
        navigationOptions: ({ navigation }) => ({
            title: strings.meHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_hasbrain.png')}
                                                   style={[{ tintColor: tintColor }, styles.tabBarIcon]}/>)
        })
    },
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
        style: {
            backgroundColor: colors.mainWhite
        },
        showIcon: true,
        upperCaseLabel: true,
        activeTintColor: colors.blueText,
        inactiveTintColor: colors.mainDarkGray
    }
});

const styles = StyleSheet.create({
    tabBarIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
});

export const ScreenStack = StackNavigator({

    Root: {
        screen: Authentication,
        navigationOptions: {
            header: null
        }
    },
    Home: {
        screen: TabNav
    }
}, {
    navigationOptions: {
        gesturesEnabled: false,
    }
});
