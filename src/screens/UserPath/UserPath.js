import React, {Component} from 'react'
import {
    View, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Image, SectionList, FlatList
} from 'react-native'
import { colors } from '../../constants/colors'
import _ from 'lodash'
import {rootViewTopPadding} from '../../utils/paddingUtils'
import HBText from "../../components/HBText";
import PathSectionItem from './PathSectionItem'

export default class UserPath extends Component {

    constructor(props) {
        super(props)
        this.state = {
            firstLoad: true,
            sectionMap: new Map()
        };
        this._pathItems = {};
    }

    componentDidMount() {
        const {_id} = this.props.navigation.state.params;
        console.log(this.props.navigation.state.params);
        this.props.getUserPath(_id);
    }

    _renderSection = ({item, section}) => {
        if (item == null || _.isEmpty(item)) {
            return null;
        }
        return (
            <PathSectionItem ref={ref => this._pathItems[section.index] = ref} data={item.articleData}/>
        )
    }


    _keyExtractor = (item, index) => index.toString();

    _renderVerticalLine(index, isTop) {
        if (isTop) {
            return (
                <View style={[styles.verticalLine, {marginLeft: 4.5, height: 3, backgroundColor: (index > 0) ?  colors.pathVerticalLine : 'transparent'}]}/>
            )
        } else {
            return (
                <View style={[styles.verticalLine, {marginLeft: 4.5, height: 3}]}/>
            )
        }
    }

    _toggleCollapse = (index) => {
        let pathItem = this._pathItems[index];
        this.setState((state) => {
            let sectionMap = state.sectionMap;
            let expanded = sectionMap.get(index);
            if (expanded == undefined)
                expanded = true;
            pathItem._toggle(expanded);
            sectionMap.set(index, !expanded);
            return {sectionMap}
        });
    }

    _renderSectionHeader = ({section}) => {
        let title = section.title.toUpperCase();
        const {sectionMap} = this.state;
        let expanded = sectionMap.get(section.index);
        if (expanded == undefined)
            expanded = true;
        let arrowIcon = expanded ? require('../../assets/ic_arrow_up.png') : require('../../assets/ic_arrow_down.png')
        return (
            <TouchableWithoutFeedback onPress={() => this._toggleCollapse(section.index)}>
                <View style={styles.sectionHeader}>
                    <View style={{flexDirection: 'column', height: 13, width: 10, marginLeft: 30,
                        marginRight: 15}}>
                        {this._renderVerticalLine(section.index, true)}
                        <View style={styles.circlePoint}/>
                        {this._renderVerticalLine(section.index, false)}
                    </View>
                    <HBText ellipsizeMode="tail" numberOfLines={1} style={styles.seriesTitle}>{title}</HBText>
                    <Image style={styles.collapseArrow} source={arrowIcon}/>
                </View>
            </TouchableWithoutFeedback>
        )
    };


    _onClosePress = () => {
        this.props.navigation.goBack();
    }

    _renderListFooter = () => {
        return <View style={{height: 150}}/>;

    };

    _renderContain() {
        const {userPath} = this.props;
        const {firstLoad} = this.state;
        const {_id} = this.props.navigation.state.params;
        if (firstLoad && userPath.isFetching)
            return (
                <View style={styles.container}>
                    <ActivityIndicator color={colors.blueText}/>
                </View>
            );
        if (!userPath.data)
            return null;
        let sections = userPath.data.topicData.map((data, i) => {
            return {
                data: [data],
                renderItem: this._renderSection,
                showHeader: true,
                title: data.title,
                index: i
            }
        })
        let url = `https://s3-ap-southeast-1.amazonaws.com/userkit-identity-pro/avatars/${userPath.data.profileId}medium.jpg`;
        return (
            <View style={{backgroundColor: colors.lightGray, width: '100%', height: '100%', alignItems:'center',}}>
                <View style={styles.pathInfoContainer}>
                    <HBText style={styles.pathInfoTitle}>{userPath.data.title}</HBText>
                    <HBText numberOfLines={2} ellipziseMode="tail" style={styles.pathInfoDescription}>{userPath.data.shortDescription}</HBText>
                    <View style={{height: 30, width: 30, borderRadius: 15, overflow:'hidden', marginTop: 10}}>
                        <Image resizeMode='contain' source={{uri: url, height: 30, width: 30}}/>
                    </View>
                </View>
                <View style={{backgroundColor: colors.pathVerticalLine, height: 0.5, width: '100%', marginTop: 20, marginBottom: 10}} />
                <SectionList
                    style={{marginTop: 20, marginRight: 2, width:'100%', paddingTop: 2}}
                    refreshing={!firstLoad && userPath.isFetching}
                    onRefresh={() => {
                        this.setState({firstLoad: false});
                        this.props.getUserPath(_id)
                    }}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalIndicator={false}
                    horizontal={false}
                    alwaysBounceHorizontal={false}
                    ListFooterComponent={() => this._renderListFooter()}
                    renderSectionHeader={this._renderSectionHeader}
                    bounces={true}
                    sections={sections}
                />
            </View>
        )
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.backButton} onPress={() => this._onClosePress()}>
                        <Image style={styles.backIcon} source={require('../../assets/ic_arrow_left.png')}/>
                    </TouchableOpacity>
                    <HBText style={styles.headerTitle}>Path Details</HBText>
                </View>
                {this._renderContain()}
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainWhite,
        alignItems:'center',
        width: '100%'
    },
    pathInfoContainer: {
        flexDirection: 'column',
        width: '85%',
        marginTop: 20
    },
    pathInfoTitle: {
        color: colors.darkBlue,
        fontSize: 24,
        fontFamily: 'CircularStd-Bold',
    },
    pathInfoDescription: {
        color: colors.articleCategory,
        fontSize: 14,
        marginTop: 5
    },
    circlePoint: {
        backgroundColor: colors.pathSection,
        borderRadius: 5,
        height: 10,
        width: 10,
    },
    seriesTitle: {
        color: colors.pathSection,
        fontSize: 14,
        fontFamily: 'CircularStd-Bold',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: -3
    },
    sectionContainer: {
        flexDirection: 'row',
    },
    verticalLine: {
        backgroundColor: colors.pathVerticalLine,
        marginLeft: 34.5,
        marginRight: 18,
        width: 1,
        height:'100%',
    },
    seriesItemImage: {
        width: 260,
        height: 120
    },
    seriesItemText: {
        color: colors.darkBlue,
        fontSize: 16,
        marginVertical: 20,
        marginHorizontal: 10,
    },
    placeHolder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 115,
        zIndex: -1,
        borderWidth: 0.5,
        borderColor: colors.grayText,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPlaceHolder: {
        color: colors.grayText
    },
    headerTitle: {
        color: colors.darkBlue,
        fontSize: 18,
        left: 0,
        right: 0,
        height: '100%',
        alignItems:'center',
        position: 'absolute',
        textAlign: 'center',
        zIndex: -1
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
    headerView: {
        flexDirection: 'row',
        marginTop: rootViewTopPadding() + 10,
        alignItems: 'center',
        backgroundColor: colors.mainWhite,
        paddingBottom: 10,
        width: '100%'
    },
    seriesContainer: {
        flexDirection: 'column',
        width: 260,
        height: 190,
        marginRight: 20,
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
        shadowColor: colors.grayText,
        shadowOffset: {width:5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginBottom: 20,
        elevation: 1,
        overflow: 'hidden'
    },
    collapseArrow: {
        position: 'absolute',
        right: 15,
        top: 8,
        width: 8,
        height: 5
    }
})
