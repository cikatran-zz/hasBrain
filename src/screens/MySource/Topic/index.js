import Topic from './Topic'
import {connect} from 'react-redux';
import {getTopicList} from '../../../actions/getTopicList'
import {updateFollowTopics} from '../../../actions/updateFollowTopics'
function mapStateToProps(state) {
    return {
        topic: state.topicListReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTopicList: () => dispatch(getTopicList()),
        updateFollowTopics: (topics) => dispatch(updateFollowTopics(topics))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Topic);