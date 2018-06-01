import {NativeModules, NativeEventEmitter, Share, AppState} from "react-native";
import _ from 'lodash'
import {getUrlInfo, postArticleCreateIfNotExist, postBookmark, postHighlightText, postUnbookmark} from "../api";
import {getIDOfCurrentDate} from "../utils/dateUtils";
import {strings} from "../constants/strings";

const {RNCustomWebview, RNUserKit} = NativeModules;
const customWebViewEmitter = new NativeEventEmitter(RNCustomWebview);

export default class ReaderManager {
    static sharedInstance = new ReaderManager();

    _isShowing = false;
    _currentItem = null;
    _scrollOffset = {x: 0, y: 0};
    _timer = null;
    _appState = AppState.currentState;
    _readingTimeInSeconds = 0;
    _totalReadingTimeInSeconds = 0;
    _loading = false;
    _onDismiss = null;

    constructor() {

        AppState.addEventListener('change', this._handleAppStateChange);
        customWebViewEmitter.addListener("onShare", (event) => {
            let message = _.get(this._currentItem, 'shortDescription', '');
            let title = _.get(this._currentItem, 'title', '');
            let url = _.get(this._currentItem, 'contentId', 'http://www.hasbrain.com/');
            let content = {
                message: message == null ? '' : message,
                title: title == null ? '' : title,
                url: url == null ? '' : url
            };
            Share.share(content, {subject: 'HasBrain - ' + title})
        });

        customWebViewEmitter.addListener("onDismiss", (event) => {
            this._isShowing = false;
            this._content_consumed_event();
            this._updateDailyReadingTime();
            clearInterval(this._timer);
            this._onDismiss();
        });

        customWebViewEmitter.addListener("onHighlighted", (event) => {
            let highlightedText = event.text;
            let id = _.get(this._currentItem, '_id', '');
            postHighlightText(id, highlightedText).then(value => {
                console.log("SUCCESS highlight");
            }).catch(err => {
                console.log("ERROR highlight", err);
            })
        });

        customWebViewEmitter.addListener("onScroll", (event) => {
            this._scrollOffset = {x: event.x, y: event.y};
            this._updateReading(_.get(this._currentItem, '_id', 'http://www.hasbrain.com/'));
        });

        customWebViewEmitter.addListener("onBookmark", (event) => {
            let isBookmarked = _.get(event, "bookmarked", false);
            console.log("BOOKMARK", _.get(this._currentItem,"_id", ""));
            if (isBookmarked) {
                postBookmark(_.get(this._currentItem,"_id", "")).then(value => {
                    console.log("SUCCESS BOOK");
                }).catch((err)=> {
                    console.log("ERROR BOOK", err);
                });
            } else {
                postUnbookmark(_.get(this._currentItem,"_id", "")).then(value => {
                    console.log("SUCCESS UNBOOK");
                }).catch((err)=> {
                    console.log("ERROR UNBOOK", err);
                });
            }

        });

        customWebViewEmitter.addListener("onUrlChange", (event) => {
            let item = _.cloneDeep(this._currentItem);
            this._content_consumed_event();
            this._updateDailyReadingTime();
            _.update(item, 'contentId', event.new);
            this._currentItem = item;
            getUrlInfo(event.new).then((info) => {
                RNCustomWebview.setHeader(Math.round(info.read) + " Min Read")
                _.update(item, 'readingTime', info.read);
                postArticleCreateIfNotExist({
                    url: event.new,
                    title: _.get(info, 'title', ''),
                    readingTime: _.get(info, 'read', 0),
                    sourceImage: _.get(info, 'img', ''),
                    tags: _.get(info, 'tags', [])
                }).then((result) => {
                    console.log(result);
                    let data = _.get(result, 'data.user.articleCreateIfNotExist', {});
                    let isBookmarked = _.get(data, 'isBookmarked', false);
                    this._currentItem = _.get(data, 'record', {});
                    console.log("NEW URL", this._currentItem);
                    RNCustomWebview.setHeader(Math.round(_.get(this._currentItem, 'readingTime', 0)) + " Min Read")
                    RNCustomWebview.bookmark(isBookmarked ? isBookmarked : false);
                })
            });
        });

        customWebViewEmitter.addListener("onDoneReading", (event) => {
            let id = _.get(this._currentItem, '_id', '');
            this._doneReading(id);
        });

        customWebViewEmitter.addListener("onLoading", (event) => {
            console.log("Loading", event.loading);
            this._loading = _.get(event, "loading", false);
        });
    }

    _continueReadingPosition = (contentId) => {
        RNUserKit.getProperty(strings.readingPositionKey+"."+contentId, (error, result) => {
            let lastReadingPosition = _.get(result[0], strings.readingPositionKey+"."+contentId, {x:0, y:0}) ;
            if (lastReadingPosition != null) {
                RNCustomWebview.scrollToPosition(lastReadingPosition.x == null ? 0 : lastReadingPosition.x, lastReadingPosition.y == null ? 0 : lastReadingPosition.y);
            }
        });
    };

    _doneReading = (contentId) => {
        RNUserKit.getProperty(strings.readingPositionKey, (error, result) => {
            if (!error && result != null) {
                let readingHistory = _.get(result[0], strings.readingPositionKey);
                delete readingHistory[contentId];
                RNUserKit.storeProperty({[strings.readingPositionKey]: readingHistory}, (e, r) => {
                });
            } else {
                console.log(error);
            }
        });
    };

    _updateReading = (contentId) => {
        console.log("Update reading", contentId, this._scrollOffset);
        RNUserKit.storeProperty({[strings.readingPositionKey+"."+contentId]: this._scrollOffset}, (e, r) => {
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

                let dailyReadingTimeValue = readingTime;
                if (dailyReadingTime[dateID] != null) {
                    dailyReadingTimeValue += dailyReadingTime[dateID];
                }
                dailyReadingTime = {[dateID]: dailyReadingTimeValue};
                console.log("Update daily reading time", dailyReadingTime);
                RNUserKit.storeProperty({[strings.dailyReadingTimeKey] : dailyReadingTime}, (e, r) => {
                });
            } else {
                console.log(error);
            }
        });
    };

    _intervalCalculateReadingTime = () => {
        if (this._loading === false && this._appState === 'active') {
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
            [strings.contentConsumed.contentId]: _.get(this._currentItem, '_id', ''),
            [strings.contentConsumed.mediaType]: strings.articleType
        };

        // Increase tag score
        let tags = _.get(this._currentItem, 'tags', []);
        if (tags != null) {
            let increment = {};
            tags.forEach((x)=>{
                increment[strings.readingTagsKey+"."+x] = this._totalReadingTimeInSeconds;
            });
            console.log("INCREMENT", increment);
            RNUserKit.incrementProperty(increment, (err, res)=> {});
        }
        this._totalReadingTimeInSeconds = 0;

        RNUserKit.track(strings.contentConsumed.event, props);
    };

    _open = (item, isBookmarked, onDismiss) => {
        if (!this._isShowing) {
            this._isShowing = true;
            this._currentItem = item;
            let url = _.get(item, 'contentId', 'http://www.hasbrain.com/');
            RNCustomWebview.open(url, Math.round(_.get(item, 'readingTime', 0)) + " Min Read");
            this._continueReadingPosition(_.get(item, '_id', ''));
            RNCustomWebview.bookmark(isBookmarked);

            this._timer = setInterval(this._intervalCalculateReadingTime, 1000);
            this._appState = AppState.currentState;
            this._onDismiss = onDismiss;
        }
    }
}