import People from './People'
import {connect} from 'react-redux';
import {getContributorList} from '../../../actions/getContributorList'
import {updateFollowContributor} from '../../../actions/updateFollowContributor'
function mapStateToProps(state) {
    return {
        contributor: state.contributorListReducer
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getContributorList: () => dispatch(getContributorList()),
        updateFollowContributor: (contributors) => dispatch(updateFollowContributor(contributors))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(People);