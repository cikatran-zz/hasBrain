import {StackNavigator, TabNavigator} from 'react-navigation'
import Home from './screens/Home'

const HomeStack = StackNavigator({
    Home: {
        screen: Home
    }
});

const TabNav = TabNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: ({navigation}) => ({
            header: null,
        }),
    }
}, {
    swipeEnabled: false,
    animationEnabled: false,
});

export const ScreenStack = StackNavigator({
    Root: {
        screen: TabNav
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false,
    }
});