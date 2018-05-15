import React from 'react'
import {StyleSheet, WebView, Linking, AppState, NativeModules} from 'react-native'
import {colors} from "../../constants/colors";
import {getIDOfCurrentDate} from "../../utils/dateUtils";
import _ from 'lodash'
import {strings} from "../../constants/strings";
import WKWebView from 'react-native-wkwebview-reborn';


export default class Reader extends React.PureComponent {

    constructor(props) {
        super(props);
        this.webView = null;
        this.isLoading = false;
        this.readingTimeInSeconds = 0;
        this.readingPosition = 0;

        this.state = {
            timer: null,
            appState: AppState.currentState
        };
        this.consumedLengthPath = "";
        this.readingPositionPath = ""

        this.scrollTracking = `
            window.addEventListener('scroll', function(e) {
              last_known_scroll_position = window.scrollY;
              window.postMessage({"message":last_known_scroll_position, "event": "scrolling"});
            });
            
        `;
    }

    componentDidMount() {
        let timer = setInterval(this._intervalCalculateReadingTime, 1000);
        this.setState({timer});
        const {articleID} = this.props.navigation.state.params;
        this.consumedLengthPath = getIDOfCurrentDate() + '.' + articleID + "." + strings.consumedLengthKey;
        this.readingPositionPath = getIDOfCurrentDate() + '.' + articleID + "." + strings.readingPositionKey;

        AppState.addEventListener('change', this._handleAppStateChange);

        NativeModules.RNUserKit.getProperty(strings.readingHistoryKey, (error, result) => {
            let readingHistory = JSON.parse(result[0]);
            let lastReadingPosition = _.get(readingHistory, this.readingPositionPath, 0);
            console.log("HISTORY", _.get(readingHistory, getIDOfCurrentDate() + '.' + articleID))
            console.log("LAST READING",lastReadingPosition);
            this.readingPosition = lastReadingPosition;
            this._continueReading();
        });
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
            console.log("READING TIME", this.readingTimeInSeconds);
            this._updateReadingHistory();
        }
    };

    _updateReadingHistory = () => {
        const {readingTime, articleID} = this.props.navigation.state.params;
        NativeModules.RNUserKit.getProperty(strings.readingHistoryKey, (error, result) => {
            console.log("userkit props",result);
            if (!error && result != null) {
                // Get current date
                let readingHistory = JSON.parse(result[0]);
                let lastReadingTime = _.get(readingHistory, this.consumedLengthPath, 0);
                if (lastReadingTime + this.readingTimeInSeconds <= readingTime * 60) {
                    let newReadingTime = lastReadingTime + this.readingTimeInSeconds;
                    let newObject = _.cloneDeep(readingHistory);
                    _.update(newObject, this.consumedLengthPath, _.constant(newReadingTime));
                    _.update(newObject, this.readingPositionPath, _.constant(this.readingPosition));
                    console.log("UPDATE", newObject);
                    NativeModules.RNUserKit.storeProperty(strings.readingHistoryKey, newObject, (e, r) => {
                    });
                }
            } else {
                console.log(error);
            }
        });
    };

    _handleMessage = (event) => {
        if (_.get(event, 'nativeEvent.data.event', '') === "scrolling") {
            this.readingPosition = event.nativeEvent.data.message;
        }
    };

    _startLoading = () => {
        this.isLoading = true;
    };

    _endLoading = () => {
        this.isLoading = false;
        this._continueReading();
    };

    _continueReading = () => {
        let scrollingScript = `
            window.scrollTo({
                top: ${this.readingPosition},
                behavior: "smooth"
            });
        `;
        console.log(scrollingScript);
        if (this.webView != null) {
            console.log("Continue reading");
            this.webView.evaluateJavaScript(scrollingScript);
        }
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
            <WKWebView ref={(webView) => this.webView = webView}
                       source={{uri: this.props.navigation.state.params.url}}
                       startInLoadingState={true}
                       onLoadStart={this._startLoading}
                       onLoad={this._endLoading}
                       onMessage={this._handleMessage}
                       onNavigationStateChange={this._onShouldStartLoadWithRequest}
                       injectedJavaScript={this.scrollTracking}
                       javaScriptEnabled={true}
                       style={styles.webView}/>
        )
    }
}

const styles = StyleSheet.create({
    webView: {
        backgroundColor: colors.mainWhite
    }
});
