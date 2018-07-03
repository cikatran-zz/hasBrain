import React from 'react'
import {
    ActivityIndicator,
    FlatList,
    SectionList,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Share, NativeModules, Platform, Image,
    Alert
} from 'react-native'
import {colors} from '../../../constants/colors'
import _ from 'lodash'
import {rootViewTopPadding} from "../../../utils/paddingUtils";
import CheckComponent from '../../../components/CheckComponent';
import HBText from '../../../components/HBText'

export default class People extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedState: (new Map(): Map<string, boolean>)
        }
    }

    componentDidMount() {
        this.props.onRef(this)
        this.props.getContributorList();
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    _onPressItem = (id) => {
        const {contributor} = this.props;
        const {chosenContributors} = contributor;

        this.setState((state) => {
            let checkedState = state.checkedState;
            if (checkedState.size < 1) {
                let contributors = contributor.data.map(item => {
                    return item._id
                });
                for (let key of contributors) {
                    checkedState.set(key, chosenContributors.includes(key));
                }
            }
            let checked = !checkedState.get(id);
            checkedState.set(id, checked);
            return {checkedState}
        });
    }

    _renderListFooter = () => {
        return <View style={{height: 150}}/>;
ß
    };

    _keyExtractor = (item, index) => index.toString();
    _renderListItem = ({item}) => {
        const {checkedState} = this.state;
        const {contributor} = this.props;
        const {chosenContributors} = contributor;
        let checkedItem = false;
        if (checkedState.size < 1) {
            checkedItem = chosenContributors.includes(item._id);

        } else {
            checkedItem = checkedState.get(item._id);
        }

        const avatarLen = item.avatar.length;
        const url = avatarLen > 0 ? item.avatar[avatarLen - 1].url : ""

        return (
            <View style={styles.listRow}>
                <View style={{alignSelf: 'center', borderRadius: 25, overflow: 'hidden'}}>
                    <Image resizeMode='contain' sytle={styles.iconImage} source={{uri: url, width: 50, height: 50}}/>
                </View>
                <View style={styles.detailsContainer}>
                    <HBText style={styles.titleText}>{item.name}</HBText>
                    <HBText numberOfLines={2} ellipsizeMode="tail" style={styles.descText}>{item.topics ? item.topics : ""}</HBText>
                </View>
                <CheckComponent id={item._id} checkedItem={checkedItem} onPressItem={this._onPressItem}/>
            </View>
        )
    }

    updateFollow() {
        const {checkedState} = this.state;
        const {contributor} = this.props;
        let newContributors = contributor.data.map((item) => {
            if (checkedState.get(item._id)) {
                return item._id;
            }
        });
        newContributors = _.compact(newContributors);
        if (checkedState.size !== 0)//!_.isEmpty(newContributors))
            this.props.updateFollowContributor(newContributors);
    }

    _renderSectionHeader = ({section}) => {
        return (
            <HBText style={styles.sectionHeader}>{section.title}</HBText>
        )
    };

    _renderSection = ({item}) => {
        return(
            <FlatList
                style={{marginHorizontal:10, flex: 1}}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                horizontal={false}
                data={item}
                renderItem={this._renderListItem}
                showsVerticalScrollIndicator={false}/>
        )
    }

    render() {
        const {contributor} = this.props;
        if (!contributor.data)
            return null;
        let sections = []
        for (let group of _.keys(contributor.groupContributors)) {
            let section = {
                data: [_.get(contributor.groupContributors, group)],
                renderItem: this._renderSection,
                showHeader: true,
                title: group
            }
            sections.push(section)
        }

        return (
            <SectionList
                refreshing={contributor.isFetching}
                onRefresh={() => this.props.getContributorList()}
                keyExtractor={this._keyExtractor}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                bounces={true}
                renderSectionHeader={this._renderSectionHeader}
                sections={sections}
                ListFooterComponent={() => this._renderListFooter()}
            />

        )
    }

}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        marginTop: rootViewTopPadding() + 10,
        alignItems: 'center',
        backgroundColor: colors.mainWhite,
        paddingBottom: 10
    },
    backIcon: {
        width: 16,
        height: 12,
        resizeMode: 'contain'
    },
    backButton: {
        padding: 10,
        marginRight: 5
    },
    listRow: {
        flexDirection: 'row',
        width:'100%',
        alignItems:'center',
        marginVertical: 10,
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
        marginHorizontal: 10,
        height: 60,
        overflow: 'hidden'
    },
    iconImage: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden'
    },
    titleText: {
        color: colors.darkBlue,
        fontFamily: 'CircularStd-Book',
        fontSize: 16,
        marginVertical: 5
    },
    sectionHeader: {
        color: colors.darkBlue,
        fontSize: 16,
        marginLeft: 20,
        marginVertical: 20
    },
    detailsContainer: {
        width: '58%',
        height: '100%',
        marginLeft: 20,
    },
    descText: {
        fontSize: 12,
        marginBottom: 5,
        color: colors.tagGrayText
    }
});
