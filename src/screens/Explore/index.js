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
import {getCategory} from "../../actions/getCategory";

function mapStateToProps(state) {
    return {
        articles: state.articlesReducer,
        playlist: state.playlistReducer,
        saved: state.savedReducer,
        source: state.sourcelistReducer,
        category: state.categoryReducer
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
        getCategory: () => (dispatch(getCategory()))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explore);