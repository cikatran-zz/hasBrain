import React from 'react'
import {
    StyleSheet, WebView, Linking, AppState, NativeModules, Platform, View, ProgressBarAndroid, ProgressViewIOS,
    AlertIOS, Button, TouchableOpacity, Image, Text, Share, NativeEventEmitter
} from 'react-native'
import {colors} from "../../constants/colors";
import CustomWebview from "../../components/CustomWebview"
import Toast from "react-native-root-toast";
import {rootViewBottomPadding} from "../../utils/paddingUtils";
const {RNCustomWebview, RNUserKit} = NativeModules;
import _ from 'lodash'
import {strings} from "../../constants/strings";
import {getIDOfCurrentDate} from "../../utils/dateUtils";
import {getUrlInfo, postArticleCreateIfNotExist, postHighlightText, postRemoveBookmark} from "../../api";
import ContinueReadingModal from "../../components/ContinueReadingModal";


export default class Reader extends React.Component {

    static navigationOptions = ({navigation}) => {
        return {
            headerRight:
                <TouchableOpacity onPress={navigation.state.params.handleSwitch} style={{padding: 15}}>
                    <Image source={navigation.state.params.icon} style={{resizeMode: 'contain'}}/>
                </TouchableOpacity>
        }
    };

    _switchView = () => {
        if (this.state.currentUrl === this.state.currentItem.contentId) {
            this.props.navigation.setParams({handleSwitch: this._switchView, icon: require('../../assets/ic_webview.png')});
            this.setState({currentUrl: this.state.currentItem.content});
            this._showMessage("Switch to article view");
        } else {
            this.props.navigation.setParams({handleSwitch: this._switchView, icon: require('../../assets/ic_article.png')});
            this.setState({currentUrl: this.state.currentItem.contentId});
            this._showMessage("Switch to web view");
        }

    };

    _showMessage = (message) => {
        Toast.show(message, {
            duration: Toast.durations.SHORT,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {

            },
            onShown: () => {

            },
            onHide: () => {

            },
            onHidden: () => {

            }
        });
    };

    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
            currentItem: {},
            currentUrl: '',
            canGoBack: false,
            canGoForward: false,
            isBookmarked: false,
            initPosition: {}
        };
        this._last_reading = {};
        this.modal = null;
        this._scrollOffset = {x: 0, y: 0};
        this._timer = null;
        this._appState = AppState.currentState;
        this._readingTimeInSeconds = 0;
        this._totalReadingTimeInSeconds = 0;
    }

    componentDidMount() {
        this.props.navigation.setParams({handleSwitch: this._switchView, icon: require('../../assets/ic_webview.png')});
        this._timer = setInterval(this._intervalCalculateReadingTime, 1000);

        this._appState = AppState.currentState;
        AppState.addEventListener('change', this._handleAppStateChange);

        const {content, bookmarked} = this.props.navigation.state.params;
        console.log("Reader", this.props.navigation.state.params);
        this.setState({currentItem: this.props.navigation.state.params, currentUrl: content, isBookmarked: bookmarked});
        this._requestContinueReading(this.props.navigation.state.params);
    }

    componentWillUnmount() {
        this._updateReadingHistory();
        this._content_consumed_event();
        this._updateDailyReadingTime();
        clearInterval(this._timer);
    }

    _renderProgressBar = () => {
        if (this.state.progress === 0) {
            return null;
        }
        console.log("Render progress");
        if (Platform.OS === "ios") {
            return (<ProgressViewIOS style={styles.progress} progress={this.state.progress}
                                     progressTintColor={colors.blueText}/>)
        } else {
            return (<ProgressBarAndroid style={styles.progress} progress={this.state.progress} color={colors.blueText}
                                        styleAttr={'Horizontal'} indeterminate={false}/>)
        }
    };

    _updateProgress = (progressObj) => {
        console.log("Progress", progressObj.progress, progressObj.isLoading);
        if (progressObj.isLoading) {
            this.setState({progress: progressObj.progress})
        } else {
            this.setState({progress: 0})
        }

    };

    _updateNavigation = (navigationObject) => {
        this.setState({canGoBack: navigationObject.canGoBack, canGoForward: navigationObject.canGoForward})
    };

    _share = () => {
        let currentItem = this.props.navigation.state.params;
        let message = _.get(currentItem, 'shortDescription', '');
        let title = _.get(currentItem, 'title', '');
        let url = _.get(currentItem, 'contentId', 'http://www.hasbrain.com/');
        let content = {
            message: message == null ? '' : message,
            title: title == null ? '' : title,
            url: url == null ? '' : url
        };
        Share.share(content, {subject: 'HasBrain - ' + title})
    };

    _urlChange = (urlChangeObj) => {
        console.log("Change url", urlChangeObj.url);
        if (urlChangeObj.url.indexOf("https://s3") !== -1) {
            return;
        }
        let item = _.cloneDeep(this.state.currentItem);
        this._content_consumed_event();
        this._updateDailyReadingTime();
        _.update(item, 'contentId', urlChangeObj.url);
        this.props.navigation.setParams({handleSwitch: this._switchView, icon: require('../../assets/ic_article.png')});
        this.setState({currentItem:item, currentUrl: urlChangeObj.url});
        getUrlInfo(urlChangeObj.url).then((info) => {
            this.props.navigation.setParams({readingTime: info.read});
            _.update(item, 'readingTime', info.read);
            postArticleCreateIfNotExist({
                url: urlChangeObj.url,
                title: _.get(info, 'title', ''),
                readingTime: _.get(info, 'read', 0),
                sourceImage: _.get(info, 'img', ''),
                tags: _.get(info, 'tags', [])
            }).then((result) => {
                let data = _.get(result, 'data.user.articleCreateIfNotExist', {});
                let isBookmarked = _.get(data, 'isBookmarked', false);
                this.setState({currentItem: _.get(data, 'record', {}), isBookmarked: isBookmarked});
                this._requestContinueReading(_.get(data, 'record', {}));
                console.log("NEW URL", this.state.currentItem);
                this.props.navigation.setParams({readingTime: _.get(this.state.currentItem, 'readingTime', 0)});
            })
        });
    };

    _highlight = (highlightObj) => {
        let highlightedText = highlightObj.text;
        console.log("HIGHLIGHT", highlightedText);
        let id = _.get(this.state.currentItem, '_id', '');
        postHighlightText(id, highlightedText).then(value => {
            console.log("SUCCESS highlight");
        }).catch(err => {
            console.log("ERROR highlight", err);
        })
    };

    _bookmarkPress = () => {
        if (this.state.isBookmarked) {
            this.setState({isBookmarked: false});
            // Unbookmark
            postRemoveBookmark(_.get(this.state.currentItem,"_id", ""), "articletype").then(value => {
                console.log("SUCCESS UNBOOK");
            }).catch((err)=> {
                console.log("ERROR UNBOOK", err);
            });
        } else {
            this.setState({isBookmarked: true});
            // Bookmark
            this.props.createBookmark(_.get(this.state.currentItem,"_id", ""), "articletype", strings.articleType);
            // postCreateBookmark(_.get(this.state.currentItem,"_id", ""), "articletype").then(value => {
            //     console.log("SUCCESS BOOK");
            // }).catch((err)=> {
            //     console.log("ERROR BOOK", err);
            // });
        }
    };

    _scrollPositionChanged = (scrollObj) => {
        this._scrollOffset = {x: scrollObj.x, y: scrollObj.y, scale: scrollObj.scale};
    };

    _updateReadingHistory = () => {
        // Update position and order of reading items
        // Should called when app go to background or componentDidMount
        console.log("UPDATE READING HISTORY");
        let currentId = _.get(this.state.currentItem, '_id', '');
        RNUserKit.getProperty(strings.readingHistoryKey, (error, result)=> {
            if (error == null && result != null) {
                let readingHistory = _.get(result[0], strings.readingHistoryKey, []);
                console.log("Reading History", readingHistory);
                if (readingHistory == null) {
                    readingHistory = []
                }

                // Remove current item

                _.remove(readingHistory, (x)=> x.id === currentId);
                readingHistory = readingHistory.slice(0,29);

                // Insert item at 0
                readingHistory = [{id: currentId, ...this._scrollOffset}].concat(readingHistory)

                // Store back to UK
                RNUserKit.storeProperty({[strings.readingHistoryKey]: readingHistory}, (e,r)=>{})
            }
        });
    };

    _requestContinueReading = (item) => {
        let currentId = _.get(item, '_id', '');
        RNUserKit.getProperty(strings.readingHistoryKey, (error, result)=> {
            if (error == null && result != null) {
                let readingHistory = _.get(result[0], strings.readingHistoryKey, []);
                if (readingHistory == null) {
                    return;
                }

                // Get last reading position
                let foundIndex = _.findIndex(readingHistory, {id: currentId});
                if (foundIndex === -1) {
                    return;
                }

                this._last_reading = readingHistory[foundIndex];
                this.modal.setState({isShow: true});
            }
        });
    };

    _onConfirmContinueReading = () => {
        this.setState({initPosition: this._last_reading});
        this.modal.setState({isShow: false});
    };

    _onCancelContinueReading = () => {
        this.modal.setState({isShow: false});
    };

    _updateDailyReadingTime = () => {
        let readingTime = this._readingTimeInSeconds;
        this._totalReadingTimeInSeconds += readingTime;
        this._readingTimeInSeconds = 0;
        RNUserKit.getProperty(strings.dailyReadingTimeKey, (error, result) => {
            if (!error && result != null) {
                let dailyReadingTime = _.get(result[0], strings.dailyReadingTimeKey);

                let dateID = getIDOfCurrentDate();

                if (dailyReadingTime == null) {
                    return;
                }

                let dailyReadingTimeValue = readingTime;
                if (dailyReadingTime[dateID] != null) {
                    dailyReadingTimeValue += dailyReadingTime[dateID];
                }
                dailyReadingTime = {[dateID]: dailyReadingTimeValue};
                RNUserKit.storeProperty({[strings.dailyReadingTimeKey] : dailyReadingTime}, (e, r) => {
                });
            } else {
                console.log(error);
            }
        });
    };

    _intervalCalculateReadingTime = () => {
        if (this.state.progress === 0 && this._appState === 'active') {
            this._readingTimeInSeconds += 1;

            if (this._readingTimeInSeconds % 10 !== 0) {
                return;
            }
            this._updateDailyReadingTime();
        }
    };

    _handleAppStateChange = (nextAppState) => {
        this._appState = nextAppState;
    };

    _content_consumed_event = () => {
        let props = {
            [strings.contentConsumed.consumedLength]: this._totalReadingTimeInSeconds,
            [strings.contentConsumed.contentId]: _.get(this.state.currentItem, '_id', ''),
            [strings.contentConsumed.mediaType]: strings.articleType
        };

        // Increase tag score
        let tags = _.get(this.state.currentItem, 'tags', []);
        if (tags != null) {
            let increment = {};
            if (typeof(tags) === "string") {
                tags = [tags];
            }
            tags.forEach((x)=>{
                increment[strings.readingTagsKey+"."+x] = this._totalReadingTimeInSeconds;
            });
            RNUserKit.incrementProperty(increment, (err, res)=> {});
        }
        this._totalReadingTimeInSeconds = 0;
        this.props.trackEvent(strings.contentConsumed.event, props);
    };

    render() {

        return (
            <View style={styles.alertWindow}>
                <ContinueReadingModal ref={(ref)=>this.modal=ref}
                                      onYes={this._onConfirmContinueReading}
                                      onNo={this._onCancelContinueReading}/>
                {this._renderProgressBar()}
                <CustomWebview source={this.state.currentUrl}
                               initPosition={this.state.initPosition}
                               style={styles.webView}
                               onLoadingChanged={(event) => this._updateProgress(event.nativeEvent)}
                               onNavigationChanged={(event) => this._updateNavigation(event.nativeEvent)}
                               onHighlight={(event)=>this._highlight(event.nativeEvent)}
                               onScrollEnd={(event)=>this._scrollPositionChanged(event.nativeEvent)}
                               onUrlChanged={(event)=>this._urlChange(event.nativeEvent)}/>
                <View style={styles.bottomBar}>
                    <View style={styles.bottomBarLine}/>
                    <View style={styles.bottomBarButtons}>
                        <TouchableOpacity style={styles.bottomBarButton} onPress={()=>RNCustomWebview.goBack()}>
                            <Image style={styles.bottomBarImage} source={this.state.canGoBack ? require('../../assets/ic_prev_button.png') : require('../../assets/ic_disable_prev_button.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottomBarButton} onPress={()=>RNCustomWebview.goForward()}>
                            <Image style={styles.bottomBarImage} source={this.state.canGoForward ? require('../../assets/ic_next_button.png') : require('../../assets/ic_disable_next_button.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.bottomBarButton, {marginLeft: 10}]} onPress={()=>RNCustomWebview.reload()}>
                            <Image style={styles.bottomBarImage} source={require('../../assets/ic_refresh.png')}/>
                        </TouchableOpacity>
                        <View style={{flexDirection:'row', marginLeft: 'auto', marginRight: 10}}>
                            <TouchableOpacity style={[styles.bottomBarButton, {marginRight: 10}]} onPress={this._bookmarkPress}>
                                <Image style={styles.bottomBarImage} source={this.state.isBookmarked ? require('../../assets/ic_bookmark_active.png') : require('../../assets/ic_bookmark_inactive.png')}/>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.bottomBarButton, {marginRight: 10}]} onPress={this._share}>
                                <Image style={styles.bottomBarImage} source={require('../../assets/ic_share.png')}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    alertWindow: {
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
    },
    bottomBar: {
        width: '100%',
        alignSelf: 'flex-end',
        paddingBottom: rootViewBottomPadding(),
        flexDirection: 'column',
        backgroundColor: colors.mainWhite
    },
    bottomBarLine: {
        backgroundColor: colors.grayLine,
        height: 1,
        width: '100%'
    },
    bottomBarButtons: {
        flexDirection: 'row',
        width: '100%'
    },
    bottomBarButton: {
        padding: 10,
    },
    bottomBarImage: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    }
});
