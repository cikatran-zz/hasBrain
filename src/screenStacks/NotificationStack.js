import {StackNavigator} from 'react-navigation'
import Notification from "../screens/Notification";
import {colors} from "../constants/colors";

getNavigationOptions = () => {
    //if (Platform.OS === 'ios') {
        return {
            title:"Notification",
            headerTitleStyle: {
                color: colors.mainDarkGray,
                fontWeight: 'bold',
                fontSize: 25
            },
        }
};

export default NotificationStack = StackNavigator({
    Notification: {
        screen: Notification,
    }
},{
    headerMode: 'none'
});
