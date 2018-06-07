import MySource from './MySource'
import {connect} from 'react-redux';
import {getArticles} from "../../actions/getArticles";
import {getPlaylist} from "../../actions/getPlaylist";
import {getSaved} from "../../actions/getSaved";

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MySource);