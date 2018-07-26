import React from 'react'
import {
    StyleSheet, WebView, Linking, AppState, NativeModules, Platform, View, ProgressBarAndroid, ProgressViewIOS,
    AlertIOS, Button, TouchableOpacity, Image, Text, Share, NativeEventEmitter, Animated, Dimensions, Alert
} from 'react-native'
import {colors} from "../../constants/colors";
import CustomWebview from "../../components/CustomWebview"
import Toast from "react-native-root-toast";
import {rootViewBottomPadding, rootViewTopPadding} from "../../utils/paddingUtils";

const {RNCustomWebview, RNUserKit} = NativeModules;
import _ from 'lodash'
import {strings} from "../../constants/strings";
import {getIDOfCurrentDate, getPublishDateDescription, getReadingTimeDescription} from "../../utils/dateUtils";
import {getUrlInfo, postArticleCreateIfNotExist, postHighlightText, postRemoveBookmark} from "../../api";
import ContinueReadingModal from "../../components/ContinueReadingModal";
import HBText from "../../components/HBText";
import {trackSharing} from "../../actions/userkitTracking";

const screenHeight = Dimensions.get('window').height;
export default class Reader extends React.Component {

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
            initPosition: {},
            _animated: new Animated.Value(1)
        };
        this._currentPositionVal = 1;
        this._scrollOffset = {x: 0, y: 0};
        this._timer = null;
        this._appState = AppState.currentState;
        this._readingTimeInSeconds = 0;
        this._totalReadingTimeInSeconds = 0;
        this.initUrl = null;
    }

    componentDidMount() {
        this._timer = setInterval(this._intervalCalculateReadingTime, 1000);

        this._appState = AppState.currentState;
        AppState.addEventListener('change', this._handleAppStateChange);

        const {_id} = this.props.navigation.state.params;
        this.props.getArticleDetail(_id);
        this.props.getWatchingHistory(_id);
        this.props.getHighlights(_id);
    }

    componentWillUnmount() {
        //this._updateReadingHistory();
        //this._content_consumed_event();
        //this._updateDailyReadingTime();
        clearInterval(this._timer);
    }

    _renderProgressBar = () => {
        if (this.state.progress === 0) {
            return null;
        }
        if (Platform.OS === "ios") {
            return (<ProgressViewIOS style={styles.progress} progress={this.state.progress}
                                     progressTintColor={colors.blueText}/>)
        } else {
            return (<ProgressBarAndroid style={styles.progress} progress={this.state.progress} color={colors.blueText}
                                        styleAttr={'Horizontal'} indeterminate={false}/>)
        }
    };

    componentWillReceiveProps(nextProps) {

        const {articleDetail} = this.props;
        const {articleDetail: nextDetail} = nextProps;
        let id = _.get(articleDetail, 'data._id');
        let newId = _.get(nextDetail, 'data._id');
        if (id !== newId) {
            this.props.getHighlights(newId);
        }

    }

    _updateProgress = (progressObj) => {
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
        const {articleDetail} = this.props;
        if (!articleDetail.data) {
            return
        }
        let message = _.get(articleDetail, 'data.shortDescription', '');
        let title = _.get(articleDetail, 'data.title', '');
        let url = _.get(articleDetail, 'data.contentId', 'http://www.hasbrain.com/');
        let content = {
            message: message == null ? '' : message,
            title: title == null ? '' : title,
            url: url == null ? '' : url
        };
        Share.share(content, {subject: 'HasBrain - ' + title}).then(({action}) => {
            if(action !== Share.dismissedAction) {
                trackSharing(_.get(articleDetail, 'data._id', ''), strings.trackingType.article)
            }
        });
    };

    _trackEndEvent = () => {
        this._updateReadingHistory();
        this._content_consumed_event();
        this._updateDailyReadingTime();
    };

    _urlChange = (urlChangeObj) => {
        const {articleDetail} = this.props;
        let url = _.get(articleDetail, 'data.contentId');
        if (url === urlChangeObj.url) {
            return;
        }
        this._updateReadingHistory();
        this._content_consumed_event();
        this._updateDailyReadingTime();
        this.props.getArticleDetailByUrl(urlChangeObj.url);
    };

    _highlight = (highlightObj) => {
        const {_id} = this.props.navigation.state.params;
        const {articleDetail} = this.props;
        let id = _.get(articleDetail, 'data._id');
        id && this.props.createHighlight({id: id, ...highlightObj})
        this.props.getHighlights(_id);
    };

    _isBookmarked = () => {
        const {bookmarkedIds} = this.props;

        let bookmarked = false;
        let id = this._getCurrentId();
        if (_.get(bookmarkedIds, "data.articles")) {
            bookmarked = !!bookmarkedIds.data.articles.find((x) => x === id);
        }
        return bookmarked;
    };

    _getCurrentId = () => {
        const {articleDetail} = this.props;
        let _id = _.get(articleDetail, 'data._id');
        if (!_id) {
            _id = this.props.navigation.state.params._id;
        }
        return _id;
    };

    _bookmarkPress = () => {

        if (this._isBookmarked()) {
            // Unbookmark
            this.props.removeBookmark(this._getCurrentId(), strings.bookmarkType.article, strings.trackingType.article);
        } else {
            // Bookmark
            this.props.createBookmark(this._getCurrentId(), strings.bookmarkType.article, strings.trackingType.article);
        }
    };

    _scrollPositionChanged = (scrollObj) => {
        this._scrollOffset = {x: scrollObj.x, y: scrollObj.y, scale: scrollObj.scale};
    };

    _updateReadingHistory = () => {
        let currentId = this._getCurrentId();
        this.props.updateReadingHistory(currentId, this._scrollOffset);
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
                RNUserKit.storeProperty({[strings.dailyReadingTimeKey]: dailyReadingTime}, (e, r) => {
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

        this.props.trackContentConsumed(this._totalReadingTimeInSeconds, this._getCurrentId());

        // Increase tag score
        const {articleDetail} = this.props;
        this.props.trackCategoryComsumed(_.get(articleDetail, 'data.category'), this._totalReadingTimeInSeconds);
        this._totalReadingTimeInSeconds = 0;
    };

    _renderTopbar = () => {
        const {articleDetail} = this.props;
        const {readingTime} = this.props.navigation.state.params;

        let fetchedReadingTime = _.get(articleDetail, 'data.readingTime');
        fetchedReadingTime = fetchedReadingTime ? fetchedReadingTime : readingTime;
        let sourceImage = _.get(articleDetail, 'data.sourceData.sourceImage');
        let sourceTitle = _.get(articleDetail, 'data.sourceData.title');
        let sourceCreatedAt = _.get(articleDetail, 'data.sourceCreatedAt');
        let action = getReadingTimeDescription(fetchedReadingTime);
        if (action !== '' && getPublishDateDescription(sourceCreatedAt) !== '') {
            action += "  \u2022  ";
            action += getPublishDateDescription(sourceCreatedAt);
        }

        return (
            <Animated.View style={[styles.topBarView, {transform: [{
                    translateY: this.state._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-67,0],
                        extrapolate: 'clamp',
                    }),
                }]}]}>
                <View style={styles.topBarContentView}>
                    <TouchableOpacity onPress={() => {
                        this._trackEndEvent();
                        this.props.removeArticleDetail();
                        this.props.navigation.goBack();
                    }} style={styles.backButton}>
                        <Image source={require('../../assets/ic_reader_back.png')} style={styles.backImage}/>
                    </TouchableOpacity>
                    <Image source={{uri: sourceImage}} style={styles.sourceImage}/>
                    <View style={styles.infoView}>
                        {sourceTitle && (<HBText style={{color: colors.articleSubtitle}}>{sourceTitle}</HBText>)}
                        {(action !== '') && (<HBText style={{color: colors.articleSubtitle}}>{action}</HBText>)}
                    </View>
                </View>
                {this._renderProgressBar()}
            </Animated.View>)
    };

    _renderBottomBar = () => (
            <Animated.View style={[styles.bottomBar, {
                transform: [{
                    translateY: this.state._animated.interpolate({
                        inputRange: [0, 1],
                        outputRange: [screenHeight,screenHeight-(rootViewBottomPadding()+45)],
                        extrapolate: 'clamp',
                    }),
                }]
            }]}>
                {/*<View style={styles.bottomBarLine}/>*/}
                <View style={styles.bottomBarButtons}>
                    <TouchableOpacity style={styles.bottomBarButton} onPress={() => RNCustomWebview.goBack()}>
                        <Image style={[styles.bottomBarImage]}
                               source={this.state.canGoBack ? require('../../assets/ic_prev_button.png') : require('../../assets/ic_disable_prev_button.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomBarButton} onPress={() => RNCustomWebview.goForward()}>
                        <Image style={[styles.bottomBarImage]}
                               source={this.state.canGoForward ? require('../../assets/ic_next_button.png') : require('../../assets/ic_disable_next_button.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bottomBarButton, {marginLeft: 10}]}
                                      onPress={() => RNCustomWebview.reload()}>
                        <Image style={styles.bottomBarImage} source={require('../../assets/ic_refresh.png')}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 10}}>
                        <TouchableOpacity style={[styles.bottomBarButton, {marginRight: 10}]}
                                          onPress={this._bookmarkPress}>
                            <Image style={[styles.bottomBarImage, {width: 18, height: 18}]}
                                   source={this._isBookmarked() ? require('../../assets/ic_saved.png') : require('../../assets/ic_save.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.bottomBarButton, {marginRight: 10}]} onPress={this._share}>
                            <Image style={[styles.bottomBarImage, {width: 18, height: 18}]} source={require('../../assets/ic_share.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>);

    _showHideTopbar = () => {
        Animated.spring(this.state._animated, {
            toValue: 1-this._currentPositionVal,
            friction: 7,
            tension: 40,
        }).start();
    };

    _onScroll = (event) => {
        const {y: currentOffset, layoutHeight, contentHeight} = event.nativeEvent;
        const dif = currentOffset - (this.offset || 0);
        let endOffset = layoutHeight + currentOffset;
        const height = 66 + rootViewTopPadding();
        if (this.state.progress !== 0 || contentHeight === 0 || currentOffset < 0) {
            this._currentPositionVal = 0;
            // Show
            this._showHideTopbar();
            return
        }
        if ((dif < 0 || currentOffset <= 0) && (endOffset < contentHeight)) {
            // Show
            this._currentPositionVal = Math.max(this._currentPositionVal - Math.abs(dif) / height, 0);
            this._showHideTopbar();
        } else {

            // Hide
            this._currentPositionVal = Math.min(Math.abs(dif) / height + this._currentPositionVal, 1);
            this._showHideTopbar();
        }
        this.offset = currentOffset;
    };

    _animatedScrollEnd = () => {
        if (this._currentPositionVal < 0.5) {
            // Show
            this._currentPositionVal = 0;
            this._showHideTopbar();
        } else {
            // Hide
            this._currentPositionVal = 1;
            this._showHideTopbar();
        }
    };

    _callRemoveHighlight = (id, text) => {
        const {articleDetail, hightlights: {dataMap}} = this.props;
        const highlightId = dataMap.get(text);
        this.props.removeHighlight(_.get(articleDetail, 'data._id'), highlightId);
        RNCustomWebview.removeHighlight(id);
    };

    _onRemoveHighlight = (event)=>{
        const {text, id} = event;
        Alert.alert(
            'Remove this highlight?',
            text,
            [
                {text: 'No', style: 'cancel'},
                {text: 'Yes', onPress: () => this._callRemoveHighlight(id, text)},
            ],
            { cancelable: false }
        )
    };

    render() {
        const {watchingHistory, articleDetail, hightlights} = this.props;
        const {contentId} = this.props.navigation.state.params;
        let url = _.get(articleDetail, 'data.contentId');
        url = url ? url : contentId;
        if (!this.initUrl && url) {
            this.initUrl = url;
        }
        return (
            <View style={styles.alertWindow}>
                <CustomWebview source={this.initUrl ? this.initUrl : ""}
                               highlightData={JSON.stringify(hightlights.data ? hightlights.data : {highlights:[]})}
                               topInset={66 + rootViewTopPadding()}
                               initPosition={watchingHistory.data ? watchingHistory.data : {}}
                               style={styles.webView}
                               onLoadingChanged={(event) => this._updateProgress(event.nativeEvent)}
                               onNavigationChanged={(event) => this._updateNavigation(event.nativeEvent)}
                               onHighlight={(event) => this._highlight(event.nativeEvent)}
                               onScrollEnd={(event) => {
                                   this._scrollPositionChanged(event.nativeEvent);
                                   this._animatedScrollEnd();
                               }}
                               onScrollEndDragging={(event)=>{this._animatedScrollEnd()}}
                               onScroll={this._onScroll}
                               onUrlChanged={(event) => this._urlChange(event.nativeEvent)}
                               onHighlightRemove={(event)=>this._onRemoveHighlight(event.nativeEvent)}/>
                {this._renderBottomBar()}
                {this._renderTopbar()}
                <View style={styles.rootTopView}/>
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
        left: 0,
        right: 0,
        height: 45 + rootViewBottomPadding(),
        position: 'absolute',
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
    },
    topBarView: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'absolute',
        backgroundColor: colors.mainWhite,
        height: 66 + rootViewTopPadding(),
        left: 0,
        right: 0
    },
    rootTopView: {
        height: rootViewTopPadding(),
        left: 0,
        right: 0,
        backgroundColor: colors.mainWhite,
        position: 'absolute'
    },
    topBarContentView: {
        flexDirection: 'row',
        marginBottom: 20,
        width: '100%',
        backgroundColor: colors.mainWhite,
        marginVertical: 20,
        alignItems: 'center'
    },
    backButton: {
        padding: 15,
        marginLeft: 15
    },
    backImage: {
        width: 16,
        resizeMode: 'contain'
    },
    sourceImage: {
        marginLeft: 8,
        borderRadius: 10,
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    infoView: {
        flexDirection: 'column',
        marginLeft: 15
    }
});
