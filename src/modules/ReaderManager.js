import {NativeModules, NativeEventEmitter, Share} from "react-native";
import _ from 'lodash'
import {getUrlInfo, postArticleCreateIfNotExist, postBookmark, postUnbookmark} from "../api";
import {getIDOfCurrentDate} from "../utils/dateUtils";
import {strings} from "../constants/strings";

const {RNCustomWebview, RNUserKit} = NativeModules;
const customWebViewEmitter = new NativeEventEmitter(RNCustomWebview);

export default class ReaderManager {
    static sharedInstance = new ReaderManager();

    _isShowing = false;
    _currentItem = null;
    _scrollOffset = {x: 0, y: 0};

    constructor() {
        customWebViewEmitter.addListener("onShare", (event) => {
            let message = _.get(this._currentItem, 'shortDescription', '');
            let title = _.get(this._currentItem, 'title', '');
            let url = _.get(this._currentItem, 'url', 'http://www.hasbrain.com/');
            let content = {
                message: message == null ? '' : message,
                title: title == null ? '' : title,
                url: url == null ? '' : url
            };
            Share.share(content, {subject: 'HasBrain - ' + title})
        });

        customWebViewEmitter.addListener("onDismiss", (event) => {
            this._isShowing = false;
            // TODO: - update reading event

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
            _.update(item, 'url', event.new);
            this._currentItem = item;
            getUrlInfo(event.new).then((info) => {
                RNCustomWebview.setHeader(Math.round(info.read) + " Min Read")
                _.update(item, 'readingTime', info.read);
                console.log("URL CHANGE",{
                    url: event.new,
                    title: _.get(info, 'title', ''),
                    readingTime: _.get(info, 'read', 0),
                    sourceImage: _.get(info, 'img', ''),
                    tags: _.get(info, 'tags', [])
                })
                postArticleCreateIfNotExist({
                    url: event.new,
                    title: _.get(info, 'title', ''),
                    readingTime: _.get(info, 'read', 0),
                    sourceImage: _.get(info, 'img', '')
                }).then((result) => {
                    console.log(result);
                    let data = _.get(result, 'data.user.articleCreateIfNotExist', {});
                    let isBookmarked = _.get(data, 'isBookmarked', false);
                    this._currentItem = _.get(data, 'record', {});
                    RNCustomWebview.bookmark(isBookmarked ? isBookmarked : false);
                })
            });

            // TODO: - update reading event

        });

        customWebViewEmitter.addListener("onDoneReading", (event) => {
            let id = _.get(this._currentItem, '_id', '');
            this._doneReading(id);
        });
    }

    _continueReadingPosition = (contentId) => {
        RNUserKit.getProperty(strings.continueReadingKey, (error, result) => {
            let readingHistory = JSON.parse(result[0]);
            let lastReadingPosition = _.get(readingHistory, contentId, {x: 0, y: 0});
            console.log("Continue", readingHistory, contentId, lastReadingPosition)
            RNCustomWebview.scrollToPosition(lastReadingPosition.x, lastReadingPosition.y);
        });
    };

    _doneReading = (contentId) => {
        NativeModules.RNUserKit.getProperty(strings.continueReadingKey, (error, result) => {
            if (!error && result != null) {
                let readingHistory = JSON.parse(result[0]);
                delete readingHistory[contentId];
                NativeModules.RNUserKit.storeProperty(strings.continueReadingKey, readingHistory, (e, r) => {
                });
            } else {
                console.log(error);
            }
        });
    };

    _updateReading = (contentId) => {
        NativeModules.RNUserKit.getProperty(strings.continueReadingKey, (error, result) => {
            if (!error && result != null) {
                let readingHistory = JSON.parse(result[0]);
                readingHistory[contentId] = this._scrollOffset;
                console.log("Update", contentId, readingHistory, this._scrollOffset);
                NativeModules.RNUserKit.storeProperty(strings.continueReadingKey, readingHistory, (e, r) => {
                });
            } else {
                console.log(error);
            }
        });
    };

    _open = (item, isBookmarked) => {
        if (!this._isShowing) {
            this._isShowing = true;
            this._currentItem = item;
            let url = _.get(item, 'url', 'http://www.hasbrain.com/');
            RNCustomWebview.open(url, Math.round(_.get(item, 'readingTime', 0)) + " Min Read");
            this._continueReadingPosition(_.get(item, '_id', ''));
            RNCustomWebview.bookmark(isBookmarked);
        }
    }
}