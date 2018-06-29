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
        const {source} = this.props;
        const {chosenSources} = source;

        this.setState((state) => {
            let checkedState = state.checkedState;
            if (checkedState.size < 1) {
                let sources = source.data.map(item => {
                    return item.sourceId
                });
                for (let key of sources) {
                    checkedState.set(key, chosenSources.includes(key));
                }
            }
            let checked = !checkedState.get(id);
            checkedState.set(id, checked);
            return {checkedState}
        });
    }

    _keyExtractor = (item, index) => index.toString();
    _renderListItem = ({item}) => {
        const {checkedState} = this.state;
        const {topic} = this.props;
        const {chosenTopic} = topic;
        let checkedItem = false;
        if (checkedState.size < 1) {
            checkedItem = chosenTopic.includes(item.title);

        } else {
            checkedItem = checkedState.get(item.title);
        }

        return (
            <View style={styles.listRow}>
                <Image resizeMode='contain' sytle={styles.iconImage} source={{uri: item.image, width: 60, height: 60}}/>
                <View style={styles.detailsContainer}>
                    <HBText style={styles.titleText}>{item.title}</HBText>
                    <HBText style={styles.descText}>{item.shortDescription}</HBText>
                </View>
                <CheckComponent id={item.title} checkedItem={checkedItem} onPressItem={this._onPressItem}/>
            </View>
        )
    }

    _onBackPress() {
        const {checkedState} = this.state;
        const {source} = this.props;
        let newSources = source.data.map((item) => {
            if (checkedState.get(item.sourceId)) {
                return item.sourceId;
            }
        });
        newSources = _.compact(newSources);
        if (!_.isEmpty(newSources))
            this.props.updateSourceList(newSources);
        this.props.getFeed(1, 10);
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
                keyExtractor={this._keyExtractor}
                stickySectionHeadersEnabled={false}
                showsVerticalScrollIndicator={false}
                bounces={true}
                renderSectionHeader={this._renderSectionHeader}
                sections={sections}
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
    },
    descText: {
        fontSize: 12,
        marginBottom: 5,
        color: colors.tagGrayText
    }
});
