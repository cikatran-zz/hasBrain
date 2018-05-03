import Explore from './Explore'
import {connect} from 'react-redux';
import {getArticles} from "../../actions/getArticles";

function mapStateToProps(state) {
    return {
        articles: state.articlesReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getArticles: (page, perPage) => dispatch(getArticles(page, perPage))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Explore);