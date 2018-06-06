import React, {Component} from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableWithoutFeedback, Image, SectionList, FlatList
} from 'react-native'
import { colors } from '../../constants/colors'
import {NavigationActions} from "react-navigation";
import ReaderManager from "../../modules/ReaderManager";
import _ from 'lodash'

export default class UserPath extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getUserPath();
    }

    _renderSection = ({item}) => {
        if (item == null || _.isEmpty(item)) {
            return null;
        }
        return (
            <View style={styles.sectionContainer}>
                <View style={styles.verticalLine}/>
                <FlatList
                    style={{marginTop: 15}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={item.contentData}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderSeriesItem}/>
            </View>
        )
    }

    _renderSeriesItem = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={() => this._openReadingView(item)}>
                <View style={{flexDirection:'column', marginRight: 20, width: 217}}>

                    <View style={styles.placeHolder}>
                        <Text style={styles.textPlaceHolder}>hasBrain</Text>
                    </View>
                    <Image style={styles.seriesItemImage} source={{uri: item.sourceImage}}/>
                    <Text style={styles.seriesItemText}>{item.title}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }


    _keyExtractor = (item, index) => index.toString();

    _renderSectionHeader = ({section}) => {
        let title = section.title.toUpperCase();
        return (
            <View style={styles.sectionHeader}>
                <View style={styles.circlePoint}/>
                <Text ellipsizeMode="tail" numberOfLines={1} style={styles.seriesTitle}>{title}</Text>
            </View>
        )
    };

    _openReadingView = (item) => {
        if (Platform.OS === "ios") {
            ReaderManager.sharedInstance._open(item, _.findIndex(this.state.bookmarked, (o) => (o === item._id)) !== -1, () => {
                this._setUpReadingTime();
            });
        } else {
            this.props.navigation.navigate("Reader", item);
        }

    };
    render() {
        const {userPath} = this.props;
        if (!userPath.data)
            return null;
        let sections = userPath.data.contentData.map(data => {
            return {
                data: [data],
                renderItem: this._renderSection,
                showHeader: true,
                title: data.title
            }
        })
        return (
            <View style={styles.container}>
                <View style={styles.pathInfoContainer}>
                    <Text style={styles.pathInfoTitle}>{userPath.data.title}</Text>
                    <Text style={styles.pathInfoDescription}>{userPath.data.shortDescription}</Text>
                </View>
                <SectionList
                    style={{marginTop: 20, marginRight: 2}}
                    refreshing={userPath.isFetching}
                    onRefresh={() => this.props.getUserPath()}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    renderSectionHeader={this._renderSectionHeader}
                    bounces={true}
                    sections={sections}
                />
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
        paddingTop: 30,
        width: '100%'
    },
    pathInfoContainer: {
        flexDirection: 'column',
        width: '85%',
    },
    pathInfoTitle: {
        color: colors.blackText,
        fontSize: 30,
        fontWeight: 'bold'
    },
    pathInfoDescription: {
        color: colors.blackHeader,
        fontSize: 15,
    },
    circlePoint: {
        borderColor: colors.darkBlue,
        borderWidth: 3,
        borderRadius: 12,
        height: 24,
        width: 24,
        marginLeft: 30,
        marginRight: 15
    },
    seriesTitle: {
        color: colors.darkBlue,
        fontSize: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:-1.5,
        width: '70%'
    },
    sectionContainer: {
        flexDirection: 'row',
        width: '90%'
    },
    verticalLine: {
        backgroundColor: colors.darkBlue,
        marginLeft: 40.5,
        marginRight: 18,
        width: 3,
        height:'100%',
        paddingTop: -2,
        paddingBottom: -2
    },
    seriesItemImage: {
        borderRadius: 3,
        overflow: 'hidden',
        width: 217,
        height: 115
    },
    seriesItemText: {
        color: colors.blackText,
        fontSize: 15,
        marginVertical: 20,
        width: 217
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
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPlaceHolder: {
        color: colors.grayText
    }
})
