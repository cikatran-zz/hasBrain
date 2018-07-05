import {StackNavigator} from 'react-navigation'
import UserPath from "../screens/UserPath";
import Path from "../screens/Path";

export default PathStack = StackNavigator({
    Path: {
        screen: Path
    },
    UserPath: {
        screen: UserPath,
    }
},{
    headerMode: 'none'
});