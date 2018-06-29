import Topic from './Topic'
import {connect} from 'react-redux';
import {getFeed} from "../../../actions/getFeed";
import {getTopicList} from '../../../actions/getTopicList'
function mapStateToProps(state) {
    return {
        topic: state.topicListReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getFeed: (page, perPage) => dispatch(getFeed(page, perPage)),
        getTopicList: () => dispatch(getTopicList())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Topic);