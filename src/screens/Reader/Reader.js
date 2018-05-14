import React from 'react'
import {StyleSheet, WebView, Linking, AppState, NativeModules} from 'react-native'
import {colors} from "../../constants/colors";
import {getIDOfCurrentDate} from "../../utils/dateUtils";
import _ from 'lodash'
import {strings} from "../../constants/strings";


export default class Reader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.webView = null;
        this.isLoading = false;
        this.readingTimeInSeconds = 0;

        this.state = {
            timer: null,
            appState: AppState.currentState
        };
        this.consumedLengthPath = "";

        this.scrollTracking = `
            window.addEventListener('scroll', function(e) {
              last_known_scroll_position = window.scrollY;
              window.postMessage(last_known_scroll_position+"");
            });
            
        `;
    }

    componentDidMount() {
        let timer = setInterval(this._intervalCalculateReadingTime, 1000);
        this.setState({timer});
        const {articleID} = this.props.navigation.state.params;
        this.consumedLengthPath = getIDOfCurrentDate() + '.' + articleID + "." + strings.consumedLengthKey;

        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        this._updateReadingHistory();
        clearInterval(this.state.timer);
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
        this.setState({appState: nextAppState});
    };

    _intervalCalculateReadingTime = () => {
        if (this.isLoading === false && this.state.appState === 'active') {
            this.readingTimeInSeconds += 1;

            if (this.readingTimeInSeconds % 20 !== 0) {
                return;
            }
            this._updateReadingHistory();
        }
    };

    _updateReadingHistory = () => {
        const {readingTime, articleID} = this.props.navigation.state.params;
        NativeModules.RNUserKit.getProperty(strings.readingHistoryKey, (error, result) => {
            if (!error && result != null) {
                // Get current date
                let readingHistory = JSON.parse(result[0]);
                let lastReadingTime = _.get(readingHistory, this.consumedLengthPath, 0);
                if (lastReadingTime + this.readingTimeInSeconds <= readingTime * 60) {
                    let newReadingTime = lastReadingTime + this.readingTimeInSeconds;
                    let newObject = _.cloneDeep(readingHistory);
                    _.update(newObject, this.consumedLengthPath, _.constant(newReadingTime));
                    NativeModules.RNUserKit.storeProperty(strings.readingHistoryKey, newObject, (e, r) => {
                    });
                }
            } else {
                console.log(error);
            }
        });
    };

    _handleMessage = (event) => {
        console.log("MESSAGE", event.nativeEvent.data);
    };

    _startLoading = () => {
        this.isLoading = true;
    };

    _endLoading = () => {
        this.isLoading = false;
    };

    _onShouldStartLoadWithRequest = (navigator) => {
        // const {url} = this.props.navigation.state.params;
        // if (navigator.url === url) {
        //     return true;
        // } else {
        //     console.log(navigator.url);
        //     console.log(url);
        //     this.webView.stopLoading();
        //     Linking.openURL(navigator.url);
        //     return false;
        // }
        return true;
    };

    render() {

        return (
            <WebView ref={(webView) => this.webView = webView}
                     source={{uri: this.props.navigation.state.params.url}}
                     startInLoadingState={true}
                     onLoadStart={this._startLoading}
                     onLoadEnd={this._endLoading}
                     //onMessage={this._handleMessage}
                     onNavigationStateChange={this._onShouldStartLoadWithRequest}
                     //injectedJavaScript={this.scrollTracking}
                     javaScriptEnabled={true}
                     style={styles.webView} />
        )
    }
}

const styles = StyleSheet.create({
    webView: {
        backgroundColor: colors.mainWhite
    }
});
