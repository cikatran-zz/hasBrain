import React, {Component} from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableWithoutFeedback, Image, SectionList, FlatList
} from 'react-native'
import { colors } from '../../constants/colors'
import {NavigationActions} from "react-navigation";
import _ from 'lodash'

export default class UserPath extends Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
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
                    data={item}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderSeriesItem}/>
            </View>
        )
    }

    _renderSeriesItem = ({item}) => {
        return (
            <View style={{flexDirection:'row', marginRight: 20}}>
                <Image style={styles.seriesItemImage} source={{uri: item.sourceImage}}/>
                <Text style={styles.seriesItemText}>{item.title}</Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => index.toString();

    _renderSectionHeader = ({section}) => {
        let title = section.title.toUpperCase();
        return (
            <View style={styles.sectionHeader}>
                <View style={styles.circlePoint}/>
                <Text style={styles.seriesTitle}>{title}</Text>
            </View>
        )
    };
    render() {
        //TODO: Move this data process to reducer
        let sections = [];
        for (let data in fakeData) {
            let section = {
                data: [data],
                renderItem: this._renderSection,
                showHeader: true,
                title: data.title
            }
            sections.push(section);
        }
        return (
            <View style={styles.container}>
                <View style={styles.pathInfoContainer}>
                    <Text style={styles.pathInfoTitle}>{fakeData.title}</Text>
                    <Text style={styles.pathInfoDescription}>{fakeData.longDescription}</Text>
                    <SectionList
                        style={{flex: 1}}
                        keyExtractor={this._keyExtractor}
                        stickySectionHeadersEnabled={false}
                        showsVerticalScrollIndicator={false}
                        renderSectionHeader={this._renderSectionHeader}
                        bounces={true}
                        sections={sections}
                    />
                </View>

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
        paddingTop: 50
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
        marginRight: 20
    },
    seriesTitle: {
        color: colors.darkBlue,
        fontSize: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    sectionContainer: {
        flexDirection: 'row'
    },
    verticalLine: {
        backgroundColor: colors.darkBlue,
        marginLeft: 42,
        marginRight: 32,
        width: 3,
        height:'100%'
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
        marginVertical: 20
    }
})


const fakeData = `{
    title: "System Design for Fresh Graduates", 
    longDescription: "Follow this series from the collaboration  of tech gurus to demyth data engineering.", 
    contentData: [
        {
            title: "Introduction", 
            contentData: [
                    {
                      title: "What is System Design?",
                      sourceImage: "https://cdn-images-1.medium.com/max/2000/0*W3LI86Xp8u_JEGfc.jpg"
                    }, 
                    {
                       title: "Scalability Lectue at Harvard",
                       sourceImage: "https://cdn-images-1.medium.com/max/2000/0*W3LI86Xp8u_JEGfc.jpg"
                    },
            ]
        },
        {
            title: "Application Layers",
            contentData: [
                    {
                      title: "What are Application Layer?",
                      sourceImage: "https://cdn-images-1.medium.com/max/2000/0*W3LI86Xp8u_JEGfc.jpg"
                    },
                    {
                      title: "How does Microservices work in real life?",
                      sourceImage: "https://cdn-images-1.medium.com/max/2000/0*W3LI86Xp8u_JEGfc.jpg"  
                    }
            ]            
        }, 
        {
            title: "Database",
            contentData: [
                    {
                      title: "What is Database?",
                      sourceImage: "https://cdn-images-1.medium.com/max/2000/0*W3LI86Xp8u_JEGfc.jpg"
                    },
                    {
                      title: "How does Database work in real life?",
                      sourceImage: "https://cdn-images-1.medium.com/max/2000/0*W3LI86Xp8u_JEGfc.jpg"  
                    }
            ]   
        }]
    }`
