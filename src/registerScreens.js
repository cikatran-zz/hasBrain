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
            title: 'Today I learnt',
            tabBarLabel: strings.exploreHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_menu_explore_inactive.png')}
                                                   style={[{ tintColor: tintColor }, styles.tabBarIcon]}/>)
        })
    },
    SAVED: {
        screen: SaveStack,
        navigationOptions: ({ navigation }) => ({
            title: 'Saved',
            tabBarLabel: strings.bookmarkHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_menu_saved_inactive.png')}
                                                   style={[{ tintColor: tintColor }, styles.tabBarIcon]}/>)
        })
    },
    Me: {
        screen: MeStack,
        navigationOptions: ({ navigation }) => ({
            title: 'Me',
            tabBarLabel: strings.meHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_menu_me_inactive.png')}
                                                   style={[{ tintColor: tintColor }, styles.tabBarIcon]}/>)
        })
    },
    NOTIFICATIONS: {
        screen: NotificationStack,
        navigationOptions: ({ navigation }) => ({
            title: 'Following',
            tabBarLabel: strings.notificationHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({ tintColor }) => (<Image source={require('./assets/ic_menu_noti_inactive.png')}
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
            fontSize: 8
        },
        showIcon: true,
        upperCaseLabel: true,
        activeTintColor: colors.blueText,
        inactiveTintColor: colors.mainDarkGray,
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
})
