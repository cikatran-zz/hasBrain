import React, {Component} from 'react'
import {
    View, StyleSheet, TouchableOpacity, ActivityIndicator, TouchableWithoutFeedback, Image, SectionList, FlatList
} from 'react-native'
import { colors } from '../../constants/colors'
import _ from 'lodash'
import {rootViewTopPadding} from '../../utils/paddingUtils'
import HBText from "../../components/HBText";
import TabItem from "../../components/TabItem";
import MyPath from "./MyPath";
import RecommendPath from "./RecommendedPath";

export default class Path extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tabWidth: 0,
            selectedTab: 0
        }
        this._debounceToggleTab = _.debounce(this._selectTab, 500);
    }

    componentDidMount() {
    }

    _selectTab = () => {
        const {selectedTab: index} = this.state;
        switch (index) {
            case 0:
                if (!this.props.pathCurrent.fetched) {
                    this.props.getPathCurrent();
                }
                break;
            case 1:
                if (!this.props.pathRecommend.fetched) {
                    this.props.getPathRecommend(1,20);
                }
                break;
            default:
                break;
        }
    };

    _onToggleTab = (index) => {
        this.setState({selectedTab: index});
        this._debounceToggleTab();
    };

    _renderContainer = (index) => {
        const {selectedTab} = this.state;
        if (selectedTab === 0) {
            return (
                <MyPath style={{width:'100%'}} navigation={this.props.navigation}/>
            )
        } else {
            return(
                <RecommendPath style={{width:'100%'}} navigation={this.props.navigation}/>
            )
        }
    };

    render() {
        const {selectedTab} = this.state;
        return (
            <View style={styles.container}>
                <HBText style={styles.headerTitle}>Path</HBText>
                <View style={styles.tabView} onLayout={(event) => {
                    let {width} = event.nativeEvent.layout;
                    this.setState({tabWidth: (width-50)/2});
                }}>
                    <TabItem title="MY"
                             selected={selectedTab === 0}
                             style={[styles.tabItem, {width: this.state.tabWidth}]}
                             onClicked={()=>this._onToggleTab(0)}/>
                    <TabItem title="RECOMMENDED"
                             selected={selectedTab === 1}
                             style={[styles.tabItem,{width: this.state.tabWidth}]}
                             onClicked={()=>this._onToggleTab(1)}/>
                </View>
                {this._renderContainer()}
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
    headerTitle: {
        marginTop: rootViewTopPadding() + 10,
        color: colors.darkBlue,
        fontSize: 18,
        width: '100%',
        alignItems:'center',
        textAlign: 'center'
    },
    tabView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 25,
    },
    tabItem: {
        height: 36,
        marginTop: 18
    }
})
