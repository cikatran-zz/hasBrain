import Explore from './Explore'
import {connect} from 'react-redux';
import {getArticles} from "../../actions/getArticles";
import {getPlaylist} from "../../actions/getPlaylist";
import {getSaved} from "../../actions/getSaved";
import {getSourceList} from "../../actions/getSourceList";
import {updateUserSourceTag} from '../../actions/updateUserSources';
import {updateSourceList} from '../../actions/updateUserSources';
import {createBookmark} from "../../actions/createBookmark";
import {removeBookmark} from "../../actions/removeBookmark";
import {getFeed} from "../../actions/getFeed";
import {getBookmarkedIds} from "../../actions/getBookmarkedIds";

function mapStateToProps(state) {
    return {
        articles: state.articlesReducer,
        playlist: state.playlistReducer,
        saved: state.savedReducer,
        source: state.sourcelistReducer,
        feed: state.feedReducer,
        bookmarkedIds: state.bookmarkedIdsReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getArticles: (limit, skip, sources, tags) => dispatch(getArticles(limit, skip, sources, tags)),
        getPlaylist: ()=> dispatch(getPlaylist()),
        getSaved: () => dispatch(getSaved(1, 10)),
        getSourceList: () => dispatch(getSourceList()),
        updateUserSourceTag: (tagMap) => dispatch(updateUserSourceTag(tagMap)),
        updateSourceList: (sources) => dispatch(updateSourceList(sources)),
        createBookmark: (id, type, trackingType) => dispatch(createBookmark(id, type, trackingType)),
        removeBookmark: (id, type, trackingType) => (dispatch(removeBookmark(id, type, trackingType))),
        getFeed: (page, perPage, rank)=>(dispatch(getFeed(page, perPage, rank))),
        getBookmarkedIds: () => dispatch(getBookmarkedIds())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explore);