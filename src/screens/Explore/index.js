import Explore from './Explore'
import {connect} from 'react-redux';
import {getArticles} from "../../actions/getArticles";
import {getPlaylist} from "../../actions/getPlaylist";
import {getSaved} from "../../actions/getSaved";

function mapStateToProps(state) {
    return {
        articles: state.articlesReducer,
        playlist: state.playlistReducer,
        saved: state.savedReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getArticles: (page, perPage) => dispatch(getArticles(page, perPage)),
        getPlaylist: ()=> dispatch(getPlaylist()),
        getSaved: () => dispatch(getSaved(1, 10))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explore);