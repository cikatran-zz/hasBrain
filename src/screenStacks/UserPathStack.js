import {StackNavigator} from 'react-navigation'
import UserPath from "../screens/UserPath";

export default UserPathStack = StackNavigator({
    UserPath: {
        screen: UserPath,
    }
},{
    headerMode: 'none'
});