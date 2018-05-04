import Explore from './Explore'
import {connect} from 'react-redux';
import {getArticles} from "../../actions/getArticles";
import {getPlaylist} from "../../actions/getPlaylist";

function mapStateToProps(state) {
    return {
        articles: state.articlesReducer,
        playlist: state.playlistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getArticles: (page, perPage) => dispatch(getArticles(page, perPage)),
        getPlaylist: ()=> dispatch(getPlaylist())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explore);