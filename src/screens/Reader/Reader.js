import React from 'react'
import {StyleSheet, WebView, Linking, AppState, NativeModules, Platform} from 'react-native'
import {colors} from "../../constants/colors";
import CustomWebview from "../../components/CustomWebview"


export default class Reader extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const {contentId} = this.props.navigation.state.params;
        return (
            <CustomWebview url={contentId}
                           style={styles.webView}/>
        )
    }
}

const styles = StyleSheet.create({
    webView: {
        backgroundColor: colors.mainWhite
    }
});
