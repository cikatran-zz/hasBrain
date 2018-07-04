import MySource from './MySource'
import {connect} from 'react-redux';
import {getFeed} from "../../actions/getFeed";
import {getSourceList} from "../../actions/getSourceList";
import {getContributorList} from "../../actions/getContributorList";
import {getTopicList} from "../../actions/getTopicList";
function mapStateToProps(state) {
    return {
        contributor: state.contributorListReducer,
        topic: state.topicListReducer,
        source: state.sourcelistReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        // getSourceList: () => dispatch(getSourceList()),
        // updateSourceList: (sources) => dispatch(updateSourceList(sources)),
        //getFeed: (page, perPage) => dispatch(getFeed(page, perPage)),
        getSourceList: () => dispatch(getSourceList()),
        getContributorList: () => dispatch(getContributorList()),
        getTopicList: () => dispatch(getTopicList()),

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MySource);