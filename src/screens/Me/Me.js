import React from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableWithoutFeedback, Image, TextInput
} from 'react-native'
import { colors } from '../../constants/colors'
import {NavigationActions} from "react-navigation";
import CircleImage from '../../components/CircleImage'
import About from './About'
import HighLight from './HighLight'
import _ from 'lodash'

export default class Me extends React.Component {
    _titleTextInput = null;
    _about = null;

    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 0,
            editMode: false
        }
    }

    componentDidMount() {
        this.props.getUserProfile();
        this.props.getUserAnalyst();
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
        const  {selectedTab, editMode} = this.state;
        if (selectedTab == 0) {
            return (
                <About onRef={component => this._about = component} editMode={editMode} style={{width:'85%', marginTop: 10}}/>
            )
        } else {
            return  <HighLight style={{width:'85%', marginTop: 10}}/>;
        }
    }

    _renderEditButton () {
        const {editMode} = this.state;
        if (editMode) {
            return (
                <Image source={require('../../assets/btn_edit_on.png')}/>
            )
        } else {
            return (
                <Image source={require('../../assets/btn_edit.png')}/>
            )
        }
    }

    _toggleEdit = () => {
        const {editMode} = this.state;
        const {user} = this.props;
        if (editMode) {
            let title = "";
            let description = "";
            if (user.userProfileData) {
                title = user.userProfileData.role;
                description = user.userProfileData.about;
            };
            if (this._titleTextInput._lastNativeText)
                title = this._titleTextInput._lastNativeText;
            if (this._about._getSummaryValue())
                description = this._about._getSummaryValue();
            this.props.updateUserProfile(title, description);
        }
        this.setState({editMode: !editMode});
    }

    render() {
        const {selectedTab, editMode} = this.state;
        const {user} = this.props;
        let title = null;
        if (user.userProfileData) {
            title = user.userProfileData.role
        };
        if (_.isEmpty(title)) {
            title = "Enter your title here"
        }
        return (
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <CircleImage
                        size={75}
                        source={require('../../assets/ic_hasbrain.png')}/>

                    <View style={styles.profileTextContainer}>
                        <Text numberOfLines={1} style={styles.profileName}>{user.userName ? user.userName : ''}</Text>
                        <TextInput ref={component => this._titleTextInput = component}  multiline={true} underlineColorAndroid="transparent" numberOfLines={2} style={styles.profileTitle} defaultValue={title} editable={editMode}/>
                    </View>

                    <View style={styles.profileActionButtonContainer}>
                        <TouchableWithoutFeedback onPress={this._toggleEdit}>
                            {this._renderEditButton()}
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={this._signOut}>
                            <Image style={{marginTop: 15, tintColor: colors.grayText}}source={require('../../assets/ic_signout.png')}/>
                        </TouchableWithoutFeedback>
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
