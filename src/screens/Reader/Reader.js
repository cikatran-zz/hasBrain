import React from 'react'
import {StyleSheet, WebView, Linking, AppState, NativeModules, Platform, View, ProgressBarAndroid, ProgressViewIOS} from 'react-native'
import {colors} from "../../constants/colors";
import CustomWebview from "../../components/CustomWebview"


export default class Reader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }
    }

    _renderProgressBar = () => {
        if (this.state.progress === 0) {
            return null;
        }
        if (Platform.OS === "ios") {
            return (<ProgressViewIOS style={styles.progress} progress={this.state.progress} progressTintColor={colors.blueText}/>)
        } else {
            return (<ProgressBarAndroid style={styles.progress} progress={this.state.progress} color={colors.blueText} styleAttr={'Horizontal'} indeterminate={false}/>)
        }
    };

    _updateProgress = (progressObj) => {
        if (progressObj.isLoading) {
            this.setState({progress: progressObj.progress})
        } else {
            this.setState({progress: 0})
        }

    };

    render() {
        const {contentId, content} = this.props.navigation.state.params;
        return (
            <View style={styles.rootView}>
                {this._renderProgressBar()}
                <CustomWebview source={contentId}
                               style={styles.webView}
                               onLoadingChanged={(event)=>this._updateProgress(event.nativeEvent)}/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    rootView: {
        flexDirection: 'column',
        flex: 1
    },
    webView: {
        backgroundColor: colors.mainWhite,
        width: '100%',
        height: '100%',
        flex: 1
    },
    progress: {
        width: '100%',
        height: 3
    }
});
