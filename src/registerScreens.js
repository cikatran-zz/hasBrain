import {StackNavigator, TabNavigator} from 'react-navigation'
import ExploreStack from './screenStacks/ExploreStack'
import SaveStack from "./screenStacks/SaveStack";
import {Image, StyleSheet} from "react-native";
import React from "react";
import {colors} from "./constants/colors";
import {strings} from "./constants/strings";
import {defaultHeaderStyle} from "./constants/theme";

const TabNav = TabNavigator({
    Explore: {
        screen: ExploreStack,
        navigationOptions: ({navigation}) => ({
            title: strings.exploreHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({tintColor}) => (<Image source={require('./assets/ic_home.png')} style={{tintColor: tintColor, width: 25, height: 25}}/>),
        }),
    },
    Save: {
        screen: SaveStack,
        navigationOptions: ({navigation}) => ({
            title: strings.bookmarkHeader,
            headerTitleStyle: defaultHeaderStyle,
            tabBarIcon: ({tintColor}) => (<Image source={require('./assets/ic_bookmark.png')} style={{tintColor: tintColor, width: 25, height: 25}}/>),
        }),
    }
}, {
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
        style: {
            backgroundColor: colors.mainWhite
        },
        showLabel: false,
        showIcon: true,
        activeTintColor: colors.mainDarkGray,
        inactiveTintColor: colors.mainLightGray
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