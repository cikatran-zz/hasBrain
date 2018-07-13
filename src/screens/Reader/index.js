import Reader from './Reader'
import { connect } from 'react-redux'
import {createBookmark} from "../../actions/createBookmark";
import {removeBookmark} from "../../actions/removeBookmark";
import {getWatchingHistory} from "../../actions/getWatchingHistory";
import {createHighlight} from "../../actions/createHightlight";
import {getArticleDetail, getArticleDetailByUrl, removeArticleDetail} from "../../actions/getArticleDetail";
import {updateReadingHistory} from "../../actions/updateReadingHistory";
import {trackCategory, trackConsume} from "../../actions/userkitTracking";
import {strings} from "../../constants/strings";
import {getHighlightByArticle} from "../../actions/getHighlightByArticle";
import {removeHighlight} from "../../actions/removeHighlight";

function mapStateToProps(state) {
    return {
        watchingHistory: state.watchingHistoryReducer,
        bookmarkedIds: state.bookmarkedReducer,
        articleDetail: state.articleDetailReducer,
        hightlights: state.highlightByArticleReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        createBookmark: (id, type, trackingType) => dispatch(createBookmark(id, type, trackingType, dispatch)),
        removeBookmark: (id, type, trackingType) => dispatch(removeBookmark(id, type, trackingType, dispatch)),
        getWatchingHistory: (contentId) => dispatch(getWatchingHistory(contentId)),
        createHighlight: (id, highlight, position, comment, note) => dispatch(createHighlight(id, highlight, position, comment, note, dispatch)),
        getArticleDetail: (id)=>dispatch(getArticleDetail(id)),
        getArticleDetailByUrl: (url)=>dispatch(getArticleDetailByUrl(url)),
        updateReadingHistory: (articleId, scrollOffset) => dispatch(updateReadingHistory(articleId, scrollOffset, dispatch)),
        trackContentConsumed: (readingTime, articleId)=>dispatch(trackConsume(readingTime, articleId, strings.trackingType.article)),
        trackCategoryComsumed: (category, timeConsumed)=>dispatch(trackCategory(category, timeConsumed)),
        removeArticleDetail: () =>dispatch(removeArticleDetail()),
        getHighlights: (id) =>dispatch(getHighlightByArticle(id)),
        removeHighlight: (article, highlight)=>dispatch(removeHighlight(article, highlight, dispatch))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Reader)
