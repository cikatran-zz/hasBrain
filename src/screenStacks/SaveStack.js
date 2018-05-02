import {StackNavigator} from 'react-navigation'
import Save from "../screens/Save";
import {colors} from "../constants/colors";

getNavigationOptions = () => {
    //if (Platform.OS === 'ios') {
        return {
            title:"Bookmark",
            headerTitleStyle: {
                color: colors.mainDarkGray,
                fontWeight: 'bold',
                fontSize: 25
            },
        }
};

export default SaveStack = StackNavigator({
    Save: {
        screen: Save,
    }
},{
    headerMode: 'none'
});