import {StackNavigator, TabNavigator} from 'react-navigation'
import ExploreStack from './screenStacks/ExploreStack'
import SaveStack from "./screenStacks/SaveStack";
import {Image, StyleSheet} from "react-native";
import React from "react";

const TabNav = TabNavigator({
    Explore: {
        screen: ExploreStack,
        navigationOptions: ({navigation}) => ({
            header: null,
            tabBarIcon: ({tintColor}) => (<Image source={require('./assets/ic_home.png')} style={{tintColor: tintColor, width: 25, height: 25}}/>),
            tabBarOptions: {
                activeTintColor: '#ffffff',
                inactiveTintColor: '#ECECEC'
            }
        }),
    },
    Save: {
        screen: SaveStack,
        navigationOptions: ({navigation}) => ({
            header: null,
            tabBarIcon: ({tintColor}) => (<Image source={require('./assets/ic_bookmark.png')} style={{tintColor: tintColor, width: 25, height: 25}}/>),
            tabBarOptions: {
                activeTintColor: '#ffffff',
                inactiveTintColor: '#ECECEC'
            }
        }),
    }
}, {
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
        style: {
            backgroundColor: '#4ec2ea'
        },
        showLabel: false,
        showIcon: true,
        activeTintColor: '#ffffff',
        inactiveTintColor: '#808285'
    }
});

export const ScreenStack = StackNavigator({
    Root: {
        screen: TabNav
    }
}, {
    navigationOptions: {
        gesturesEnabled: false,
    }
});