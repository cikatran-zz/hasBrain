import { StackNavigator, TabNavigator } from 'react-navigation'
import ExploreStack from './screenStacks/ExploreStack'
import SaveStack from './screenStacks/SaveStack'
import NotificationStack from './screenStacks/NotificationStack'
import { Image, StyleSheet, NativeModules } from 'react-native'
import React from 'react'
import { colors } from './constants/colors'
import { strings } from './constants/strings'
import { defaultHeaderStyle } from './constants/theme'
import Authentication from './screens/Authentication/Authentication'
import Reader from './screens/Reader'
import MeStack from './screenStacks/MeStack'

const TabNav = TabNavigator({
    EXPLORE: {
        screen: ExploreStack,
        navigationOptions: ({ navigation }) => ({
            title: '00:00',
            tabBarLabel: strings.exploreHeader,
            ...defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_menu_explore.png')}
                                                   style={[{ tintColor: tintColor }, styles.tabBarIcon]}/>)
        })
    },
    SAVED: {
        screen: SaveStack,
        navigationOptions: ({ navigation }) => ({
            title: 'SAVED',
            tabBarLabel: strings.bookmarkHeader,
            ...defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_menu_saved.png')}
                                                   style={[{ tintColor: tintColor }, styles.tabBarIcon]}/>)
        })
    },
    Me: {
        screen: MeStack,
        navigationOptions: ({ navigation }) => ({
            title: 'ME',
            tabBarLabel: strings.meHeader,
            ...defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_menu_me.png')}
                                                   style={[{ tintColor: tintColor }, styles.tabBarIcon]}/>)
        })
    }
}, {
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
        style: {
            backgroundColor: colors.mainWhite
        },
        labelStyle: {
            fontSize: 8,
            fontWeight: 'bold'
        },
        showIcon: true,
        upperCaseLabel: true,
        activeTintColor: colors.blueText,
        inactiveTintColor: colors.blackHeader,
        indicatorStyle: {
            backgroundColor: 'transparent',
        }
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
    },
    Reader: {
        screen: Reader
    }
}, {
    navigationOptions: {
        gesturesEnabled: false
    }
});
