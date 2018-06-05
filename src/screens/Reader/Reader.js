import React from 'react'
import {StyleSheet, WebView, Linking, AppState, NativeModules, Platform, View} from 'react-native'
import {colors} from "../../constants/colors";
import CustomWebview from "../../components/CustomWebview"


export default class Reader extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const {contentId} = this.props.navigation.state.params;
        return (
            <View style={{flex: 1}}>
                <CustomWebview source={contentId}
                               style={styles.webView}/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    webView: {
        backgroundColor: colors.mainWhite,
        width: '100%',
        height: '100%',
        flex: 1
    }
});
