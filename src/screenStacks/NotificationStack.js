import {StackNavigator} from 'react-navigation'
import Notification from "../screens/Notification";

export default NotificationStack = StackNavigator({
    Notification: {
        screen: Notification,
    }
},{
    headerMode: 'none'
});
