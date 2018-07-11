import React from 'react'
import {
    StyleSheet, WebView, Linking, AppState, NativeModules, Platform, View, ProgressBarAndroid, ProgressViewIOS,
    AlertIOS, Button, TouchableOpacity, Image, Text, Share, NativeEventEmitter, Animated
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
            topBarHeight: 46
        };
        this._last_reading = {};
        this._scrollOffset = {x: 0, y: 0};
        this._timer = null;
        this._appState = AppState.currentState;
        this._readingTimeInSeconds = 0;
        this._totalReadingTimeInSeconds = 0;
    }

    componentDidMount() {
        this._timer = setInterval(this._intervalCalculateReadingTime, 1000);

        this._appState = AppState.currentState;
        AppState.addEventListener('change', this._handleAppStateChange);

        const {_id} = this.props.navigation.state.params;
        this.props.getArticleDetail(_id);
        this.props.getWatchingHistory(_id);
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
        if (Platform.OS === "ios") {
            return (<ProgressViewIOS style={styles.progress} progress={this.state.progress}
                                     progressTintColor={colors.blueText}/>)
        } else {
            return (<ProgressBarAndroid style={styles.progress} progress={this.state.progress} color={colors.blueText}
                                        styleAttr={'Horizontal'} indeterminate={false}/>)
        }
    };

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
        this.setState({currentItem: item, currentUrl: urlChangeObj.url});
        // getUrlInfo(urlChangeObj.url).then((info) => {
        //     this.props.navigation.setParams({readingTime: info.read});
        //     _.update(item, 'readingTime', info.read);
        //     postArticleCreateIfNotExist({
        //         url: urlChangeObj.url,
        //         title: _.get(info, 'title', ''),
        //         readingTime: _.get(info, 'read', 0),
        //         sourceImage: _.get(info, 'img', ''),
        //         tags: _.get(info, 'tags', [])
        //     }).then((result) => {
        //         let data = _.get(result, 'data.user.articleCreateIfNotExist', {});
        //         let isBookmarked = _.get(data, 'isBookmarked', false);
        //         this.setState({currentItem: _.get(data, 'record', {}), isBookmarked: isBookmarked});
        //         this.props.getWatchingHistory(_.get(data, 'record._id', ""));
        //         console.log("NEW URL", this.state.currentItem);
        //         this.props.navigation.setParams({readingTime: _.get(this.state.currentItem, 'readingTime', 0)});
        //     })
        // });
    };

    _highlight = (highlightObj) => {
        let highlightedText = highlightObj.text;
        let id = _.get(this.state.currentItem, '_id', '');
        this.props.createHighlight(id, highlightedText, "", "", "")
        // postHighlightText(id, highlightedText).then(value => {
        //     console.log("SUCCESS highlight");
        // }).catch(err => {
        //     console.log("ERROR highlight", err);
        // })
    };

    _bookmarkPress = () => {
        console.log("Current Item: ", this.state.currentItem);
        if (this.state.isBookmarked) {
            this.setState({isBookmarked: false});
            // Unbookmark
            this.props.removeBookmark(_.get(this.state.currentItem, "_id", ""), strings.bookmarkType.article, strings.trackingType.article);
        } else {
            this.setState({isBookmarked: true});
            // Bookmark
            this.props.createBookmark(_.get(this.state.currentItem, "_id", ""), strings.bookmarkType.article, strings.trackingType.article);
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
        RNUserKit.getProperty(strings.readingHistoryKey, (error, result) => {
            if (error == null && result != null) {
                let readingHistory = _.get(result[0], strings.readingHistoryKey, []);
                console.log("Reading History", readingHistory);
                if (readingHistory == null) {
                    readingHistory = []
                }

                // Remove current item

                _.remove(readingHistory, (x) => x.id === currentId);
                readingHistory = readingHistory.slice(0, 29);

                // Insert item at 0
                readingHistory = [{id: currentId, ...this._scrollOffset}].concat(readingHistory)

                // Store back to UK
                RNUserKit.storeProperty({[strings.readingHistoryKey]: readingHistory}, (e, r) => {
                })
            }
        });
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
        let props = {
            [strings.contentConsumed.consumedLength]: this._totalReadingTimeInSeconds,
            [strings.contentEvent.contentId]: _.get(this.state.currentItem, '_id', ''),
            [strings.contentEvent.mediaType]: strings.articleType
        };

        // Increase tag score
        let tags = _.get(this.state.currentItem, 'tags', []);
        if (tags != null) {
            let increment = {};
            if (typeof(tags) === "string") {
                tags = [tags];
            }
            tags.forEach((x) => {
                increment[strings.readingTagsKey + "." + x] = this._totalReadingTimeInSeconds;
            });
            RNUserKit.incrementProperty(increment, (err, res) => {
            });
        }
        this._totalReadingTimeInSeconds = 0;
        RNUserKit.track(strings.contentConsumed.event, props);
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
            <Animated.View style={styles.topBarView}>
                <View style={styles.topBarContentView}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backButton}>
                        <Image source={require('../../assets/ic_reader_back.png')} style={styles.backImage}/>
                    </TouchableOpacity>
                    <Image source={{uri: sourceImage}} style={styles.sourceImage}/>
                    <View style={styles.infoView}>
                        {sourceTitle && (<HBText style={{color: colors.articleSubtitle}}>{sourceTitle}</HBText>)}
                        {(action !== '') && (<HBText style={{color: colors.articleSubtitle}}>{action}</HBText>)}
                    </View>
                </View>
            </Animated.View>)
    };

    _renderBottomBar = () => {
        const {bookmarkedIds} = this.props;
        const {_id} = this.props.navigation.state.params;
        let bookmarked = false;
        if (!_.get(bookmarkedIds, "data.articles")) {
            bookmarked = !!bookmarkedIds.data.articles.find((x) => x === _id);
        }
        return (
            <View style={styles.bottomBar}>
                <View style={styles.bottomBarLine}/>
                <View style={styles.bottomBarButtons}>
                    <TouchableOpacity style={styles.bottomBarButton} onPress={() => RNCustomWebview.goBack()}>
                        <Image style={styles.bottomBarImage}
                               source={this.state.canGoBack ? require('../../assets/ic_prev_button.png') : require('../../assets/ic_disable_prev_button.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bottomBarButton} onPress={() => RNCustomWebview.goForward()}>
                        <Image style={styles.bottomBarImage}
                               source={this.state.canGoForward ? require('../../assets/ic_next_button.png') : require('../../assets/ic_disable_next_button.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.bottomBarButton, {marginLeft: 10}]}
                                      onPress={() => RNCustomWebview.reload()}>
                        <Image style={styles.bottomBarImage} source={require('../../assets/ic_refresh.png')}/>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginLeft: 'auto', marginRight: 10}}>
                        <TouchableOpacity style={[styles.bottomBarButton, {marginRight: 10}]}
                                          onPress={this._bookmarkPress}>
                            <Image style={styles.bottomBarImage}
                                   source={bookmarked ? require('../../assets/ic_bookmark_active.png') : require('../../assets/ic_bookmark_inactive.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.bottomBarButton, {marginRight: 10}]} onPress={this._share}>
                            <Image style={styles.bottomBarImage} source={require('../../assets/ic_share.png')}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>)
    };

    render() {
        const {watchingHistory, articleDetail} = this.props;
        const {contentId} = this.props.navigation.state.params;
        let url = _.get(articleDetail, 'data.contentId');
        url = url ? url : contentId;
        return (
            <View style={styles.alertWindow}>

                {this._renderProgressBar()}
                <CustomWebview source={url}
                               topInset={66 + rootViewTopPadding()}
                               initPosition={watchingHistory.data ? watchingHistory.data : {}}
                               style={styles.webView}
                               onLoadingChanged={(event) => this._updateProgress(event.nativeEvent)}
                               onNavigationChanged={(event) => this._updateNavigation(event.nativeEvent)}
                               onHighlight={(event) => this._highlight(event.nativeEvent)}
                               onScrollEnd={(event) => this._scrollPositionChanged(event.nativeEvent)}
                               onUrlChanged={(event) => this._urlChange(event.nativeEvent)}/>
                {this._renderBottomBar()}
                {this._renderTopbar()}
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
