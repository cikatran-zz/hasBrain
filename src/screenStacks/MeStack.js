import {StackNavigator} from 'react-navigation'
import Me from "../screens/Me";

export default MeStack = StackNavigator({
    Me: {
        screen: Me,
    }
},{
    headerMode: 'none'
});
