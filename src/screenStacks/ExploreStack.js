import {StackNavigator} from 'react-navigation'
import Explore from "../screens/Explore";
import React from 'react'

export default ExploreStack = StackNavigator({
    Explore: {
        screen: Explore,
    }
},{
    headerMode: 'none'
});