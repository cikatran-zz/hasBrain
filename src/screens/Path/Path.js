import React, {Component} from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableWithoutFeedback, Image, SectionList, FlatList
} from 'react-native'
import { colors } from '../../constants/colors'
import _ from 'lodash'
import PathRecommend from "./PathRecommend";
import PathBookmarked from "./PathBookmarked";

export default class Path extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 0
        }
    }

    componentDidMount() {
        //this.props.getUserPath();
    }

    _toggleTab = () => {
        const {selectedTab} = this.state;
        selectedTab === 0 ? this.setState({selectedTab: 1}) : this.setState({selectedTab: 0});
    };

    _renderTabContain (){
        const  {selectedTab} = this.state;
        if (selectedTab === 0) {
             return (
                 <PathRecommend style={{width:'100%', marginTop: 10}} navigation={this.props.navigation}/>
            )
        } else {
            return(
                <PathBookmarked style={{width:'100%', marginTop: 10}} navigation={this.props.navigation}/>
            )
        }
    }

    render() {
        const {selectedTab} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.toggleButtonContainer}>
                    <TouchableWithoutFeedback onPress={this._toggleTab}>
                        <View style={[
                            styles.toggleTab,
                            {borderBottomLeftRadius: 3, borderTopLeftRadius: 3},
                            selectedTab === 0 ? styles.activeTab : styles.inactiveTab]}>
                            <Text style={[
                                styles.toggleTabTitle,
                                selectedTab === 0 ? {color: colors.mainWhite} : {color: colors.darkBlue}
                            ]}>Recommend</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={this._toggleTab}>
                        <View style={[
                            styles.toggleTab,
                            {borderBottomRightRadius: 3, borderTopRightRadius: 3},
                            selectedTab === 1 ? styles.activeTab : styles.inactiveTab]}>
                            <Text style={[
                                styles.toggleTabTitle,
                                selectedTab === 1 ? {color: colors.mainWhite} : {color: colors.darkBlue}
                            ]}>Current</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {this._renderTabContain()}
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
    profileContainer: {
        flexDirection: 'row',
        width: '85%',
        height:'20%',
        justifyContent: 'space-between',
    },
    profileTextContainer: {
        flexDirection: 'column',
        width: '60%',
        height: 75,
        marginTop: -5
    },
    profileName: {
        fontSize: 25,
        color: colors.blackText,
        fontWeight: 'bold'
    },
    profileTitle: {
        color: colors.blackHeader,
        fontSize: 18,
        marginTop: -5
    },
    profileActionButtonContainer: {
        flexDirection: 'column',
        alignItems:'center',
        height: 75
    },
    toggleButtonContainer: {
        flexDirection: 'row',
        marginBottom: 10
    },
    signOut: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: (Platform.OS === 'ios') ? 17 : 30,
        backgroundColor: colors.redButton,
        fontSize: 17,
        color: '#ffffff',
        overflow: 'hidden',
        textAlign: 'center',
        paddingTop: 8,
        paddingBottom: 8
    },
    toggleTab: {
        height: 30,
        width: 110,
        borderColor: colors.darkBlue,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    toggleTabTitle: {
        fontSize: 13
    },
    activeTab: {
        backgroundColor: colors.darkBlue
    },
    inactiveTab: {
        backgroundColor: colors.mainWhite
    }
})
