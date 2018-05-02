import {StackNavigator} from 'react-navigation'
import Explore from "../screens/Explore";

export default ExploreStack = StackNavigator({
    Explore: {
        screen: Explore
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false,
    }
});