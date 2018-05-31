import React from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableWithoutFeedback, Image
} from 'react-native'
import { colors } from '../../constants/colors'
import {NavigationActions} from "react-navigation";
import CircleImage from '../../components/CircleImage'
import About from './About'
import HighLight from './HighLight'

export default class Me extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 0
        }
    }

    componentDidMount() {
        // this.props.getMe()
    }

    _signOut = () => {
        NativeModules.RNUserKitIdentity.signOut();
        this.props.navigation.navigate('Root')
    };

    _toggleTab = () => {
        const {selectedTab} = this.state;
        selectedTab == 0 ? this.setState({selectedTab: 1}) : this.setState({selectedTab: 0});
    }

    _renderTabContain (){
        const  {selectedTab} = this.state;
        if (selectedTab == 0) {
            return (
                <About style={{width:'85%', marginTop: 10}}/>
            )
        } else {
            return  <HighLight style={{width:'85%', marginTop: 10}}/>;
        }
    }

    render() {
        const  {selectedTab} = this.state;
        return (
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <CircleImage
                        size={75}
                        url="https://ia.media-imdb.com/images/M/MV5BZTRiNTA4MjItNmQzMi00OWJiLWEwOTktNmRlNTAzYzZhN2UyL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMjIyNzU0OA@@._V1_.jpg"/>

                    <View style={styles.profileTextContainer}>
                        <Text numberOfLines={1} style={styles.profileName}>Jang Na Ra</Text>
                        <Text numberOfLines={2} style={styles.profileTitle}>Software Engineer Paypal</Text>
                    </View>

                    <View style={styles.profileActionButtonContainer}>
                        <Image source={require('../../assets/btn_edit.png')}/>
                        <Image style={{marginTop: 15}}source={require('../../assets/ic_settings_gear.png')}/>
                    </View>
                </View>

                <View style={styles.toggleButtonContainer}>
                    <TouchableWithoutFeedback onPress={this._toggleTab}>
                        <View style={[
                            styles.toggleTab,
                            {borderBottomLeftRadius: 3, borderTopLeftRadius: 3},
                            selectedTab == 0 ? styles.activeTab : styles.inactiveTab]}>
                            <Text style={[
                                styles.toggleTabTitle,
                                selectedTab == 0 ? {color: colors.mainWhite} : {color: colors.darkBlue}
                            ]}>About</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <TouchableWithoutFeedback onPress={this._toggleTab}>
                        <View style={[
                            styles.toggleTab,
                            {borderBottomRightRadius: 3, borderTopRightRadius: 3},
                            selectedTab == 1 ? styles.activeTab : styles.inactiveTab]}>
                            <Text style={[
                                styles.toggleTabTitle,
                                selectedTab == 1 ? {color: colors.mainWhite} : {color: colors.darkBlue}
                            ]}>Highlights</Text>
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
        justifyContent: 'space-between'
    },
    profileTextContainer: {
        flexDirection: 'column',
        width: '60%',
        height: 75,
        alignItems:'stretch'
    },
    profileName: {
        fontSize: 25,
        color: colors.blackText,
        fontWeight: 'bold'
    },
    profileTitle: {
        color: colors.blackHeader,
        fontSize: 18
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
