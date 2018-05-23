import {NativeModules, NativeEventEmitter, Share} from "react-native";
import _ from 'lodash'

const { RNCustomWebview } = NativeModules;
const customWebViewEmitter = new NativeEventEmitter(RNCustomWebview);

export default class ReaderManager {
    static sharedInstance = new ReaderManager();

    _isShowing = false;
    _currentItem = null;

    constructor() {
        customWebViewEmitter.addListener("onShare", (event)=> {
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

        customWebViewEmitter.addListener("onDismiss", (event)=> {
            this._isShowing = false
        });
    }


    _open = (item) => {
        if (!this._isShowing) {
            this._isShowing = true;
            this._currentItem = item;
            RNCustomWebview.open(_.get(item, 'url', 'http://www.hasbrain.com/'), _.get(item, 'readingTime', 0) + " Min Read");
        }
    }
}