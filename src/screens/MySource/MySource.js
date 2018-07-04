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
    TouchableWithoutFeedback
} from 'react-native'
import {colors} from '../../constants/colors'
import _ from 'lodash'
import {strings} from "../../constants/strings";
import {rootViewTopPadding} from "../../utils/paddingUtils";
import {navigationTitleStyle} from "../../constants/theme";
import CheckComponent from '../../components/CheckComponent';
import HBText from '../../components/HBText'
import Sources from './Sources'
import Topic from './Topic'
import People from './People'

export default class MySource extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0,
        };

        this._debounceToggleTab = _.debounce(this._selectTab, 500);
    }

    componentDidMount() {
        if (!this.props.source.fetched) {
            this.props.getSourceList();
        }
    }



    _onBackPress = () => {
        //const {selectedTab} = this.state;
        // switch (selectedTab) {
        //     case 0:
        //         this._sources.updateFollow();
        //         break;
        //     case 1:
        //         this._people.updateFollow();
        //         break;
        //     case 2:
        //         this._topics.updateFollow();
        //         break;
        //     default:
        //         break;
        // }
        //this.props.getFeed(1, 10);
        this.props.navigation.goBack();
    };

    _selectTab = (index) => {
        switch (index) {
            case 0:
                if (!this.props.source.fetched) {
                    console.log("Get source");
                    this.props.getSourceList();
                }
                break;
            case 1:
                if (!this.props.contributor.fetched) {
                    console.log("Get contributor");
                    this.props.getContributorList();
                }
                break;
            case 2:
                if (!this.props.topic.fetched) {
                    console.log("Get topic");
                    this.props.getTopicList();
                }
                break;
            default:
                break;
        }

        this.setState({selectedTab: index});
    };

    _toggleTab = (index) => {
        // switch (selectedTab) {
        //     case 0:
        //         this._sources.updateFollow();
        //         break;
        //     case 1:
        //         this._people.updateFollow();
        //         break;
        //     case 2:
        //         this._topics.updateFollow();
        //         break;
        //     default:
        //         break;
        // }
        this._debounceToggleTab(index)
    };

    _renderTabContainer (){
        const  {selectedTab} = this.state;
        switch (selectedTab) {
            case 0:
                return <Sources onRef={component => this._sources = component}/>
            case 1:
                return <People onRef={component => this._people = component}/>;
            case 2:
                return <Topic onRef={component => this._topics = component}/>
            default:
                return null;
        }
    }

    render() {
        const {selectedTab} = this.state;
        return (
            <View style={styles.rootView}>
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.backButton} onPress={() => this._onBackPress()}>
                        <Image style={styles.backIcon} source={require('../../assets/ic_arrow_left.png')}/>
                    </TouchableOpacity>
                    <HBText style={styles.headerTitle}>Edit interest</HBText>
                </View>
                <View style={{backgroundColor: colors.lightGray}}>
                    <View style={styles.tabContainer}>
                        <TouchableWithoutFeedback onPress={() => this._toggleTab(0)}>
                            <HBText style={[
                                styles.tabTitle,
                                selectedTab == 0 ? {color: colors.blueText} : {color: colors.tagGrayText}
                            ]}>Source</HBText>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => this._toggleTab(1)}>
                            <HBText style={[
                                styles.tabTitle,
                                selectedTab == 1 ? {color: colors.blueText} : {color: colors.tagGrayText}
                            ]}>People</HBText>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => this._toggleTab(2)}>
                            <HBText style={[
                                styles.tabTitle,
                                selectedTab == 2 ? {color: colors.blueText} : {color: colors.tagGrayText}
                            ]}>Topic</HBText>
                        </TouchableWithoutFeedback>
                    </View>
                    {this._renderTabContainer()}
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainWhite
    },
    headerView: {
        flexDirection: 'row',
        marginTop: rootViewTopPadding() + 10,
        alignItems: 'center',
        backgroundColor: colors.mainWhite,
        paddingBottom: 10,
    },
    tabContainer: {
        flexDirection: 'row',
        marginVertical: 10,
        marginHorizontal: 20
    },
    tabTitle: {
        height: 17,
        width: 73,
        fontSize: 13
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
    sourceText: {
        color: colors.darkBlue,
        fontFamily: 'CircularStd-Book',
        fontSize: 18,
        marginLeft: 20,
        width: '60%'
    },
    searchBar: {
        flexDirection: 'row',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: colors.whiteGray,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        backgroundColor: colors.lightGray,
        height: 49,
        alignItems: 'center'
    },
    searchIcon: {
        width: 20,
        resizeMode: 'contain',
        aspectRatio: 1,
        tintColor: '#A6B2C4'
    },
    searchText: {
        marginLeft: 15,
        fontSize: 14,
        color: colors.grayTextSearch,
        fontFamily: 'CircularStd-Book',
        opacity: 0.5
    },
});
