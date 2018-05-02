import {StackNavigator} from 'react-navigation'
import Save from "../screens/Save";

export default SaveStack = StackNavigator({
    Save: {
        screen: Save
    }
}, {
    headerMode: 'none',
    navigationOptions: {
        gesturesEnabled: false,
    }
});