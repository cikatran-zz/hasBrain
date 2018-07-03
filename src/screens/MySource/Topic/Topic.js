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

export default class Topic extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedState: (new Map(): Map<string, boolean>)
        }
    }

    componentDidMount() {
        this.props.onRef(this)
        this.props.getTopicList();
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    _onPressItem = (id) => {
        const {topic} = this.props;
        const {chosenTopic} = topic;

        this.setState((state) => {
            let checkedState = state.checkedState;
            if (checkedState.size < 1) {
                let topics = topic.data.map(item => {
                    return item._id
                });
                for (let key of topics) {
                    checkedState.set(key, chosenTopic.includes(key));
                }
            }
            let checked = !checkedState.get(id);
            checkedState.set(id, checked);
            return {checkedState}
        });
    }

    _renderListFooter = () => {
        return <View style={{height: 150}}/>;

    };

    _keyExtractor = (item, index) => index.toString();
    _renderListItem = ({item}) => {
        const {checkedState} = this.state;
        const {topic} = this.props;
        const {chosenTopic} = topic;
        let checkedItem = false;
        if (checkedState.size < 1) {
            checkedItem = chosenTopic.includes(item._id);

        } else {
            checkedItem = checkedState.get(item._id);
        }

        return (
            <View style={styles.listRow}>
                {/*<Image resizeMode='contain' sytle={styles.iconImage} source={{uri: item.image ? item.image : "", width: 60, height: 60}}/>*/}
                <View style={{height: 60, width: 60, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.darkBlue}}>
                    <HBText style={{fontSize: 25, color: colors.mainWhite}}>{item.title.toUpperCase().charAt(0)}</HBText>
                </View>
                <View style={styles.detailsContainer}>
                    <HBText style={styles.titleText}>{item.title}</HBText>
                    {/*<HBText style={styles.descText}>{item.shortDescription ? item.shortDescription : ""}</HBText>*/}
                </View>
                <CheckComponent id={item.title} checkedItem={checkedItem} onPressItem={(title)=>this._onPressItem(item._id)}/>
            </View>
        )
    }

    updateFollow() {
        const {checkedState} = this.state;
        const {topic} = this.props;
        let newTopics = topic.data.map((item) => {
            if (checkedState.get(item._id)) {
                return item._id;
            }
        });
        newTopics = _.compact(newTopics);
        //if (!_.isEmpty(newTopics))
        if (checkedState.size !== 0)
            this.props.updateFollowTopics(newTopics);
    }

    _renderSectionHeader = ({section}) => {
        return (
            <HBText style={styles.sectionHeader}>{section.title.toUpperCase()}</HBText>
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
        const {topic} = this.props;
        if (!topic.data)
            return null;
        let sections = []
        for (let group of _.keys(topic.groupTopics)) {
            let section = {
                data: [_.get(topic.groupTopics, group)],
                renderItem: this._renderSection,
                showHeader: true,
                title: group
            }
            sections.push(section)
        }

        return (
            <SectionList
                refreshing={topic.isFetching}
                onRefresh={() => this.props.getTopicList()}
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
        height: 60,
        width: 60,
        overflow: 'hidden'
    },
    titleText: {
        color: colors.darkBlue,
        fontFamily: 'CircularStd-Book',
        fontSize: 16,
        marginVertical:10
    },
    sectionHeader: {
        color: colors.darkBlue,
        fontSize: 16,
        marginLeft: 20,
        marginVertical: 20
    },
    detailsContainer: {
        width: '60%',
        height: '100%',
        marginLeft: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    descText: {
        fontSize: 12,
        marginBottom: 5,
        color: colors.tagGrayText
    }
});
