import React from 'react'
import {
    Text, View, StyleSheet, Image, Platform, TextInput, TouchableOpacity, NativeModules,
    ActivityIndicator
} from 'react-native'
import {colors} from "../../constants/colors";
import IndicatorModal from "../../components/IndicatorModal";
import Toast from 'react-native-root-toast';
import {postCreateUser} from "../../api";
import _ from 'lodash'
import {strings} from "../../constants/strings";
import { facebookLogin } from '../../utils/facebookLogin'
import NavigationActions from 'react-navigation/src/NavigationActions'

export default class Authentication extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    _goToHomeScreen() {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "Home"
                })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    }

    _loginWithFacebook = () => {
        facebookLogin().then((value) => {
            this._goToHomeScreen();
        }).catch((error) => {
            console.log('Error when login with Facebook', error);
        })
    }

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/ic_hasbrain.png')}/>
                <Text style={styles.text}>hasBrain</Text>
                <TouchableOpacity
                    style={[styles.colorButton, {marginTop: 44.5}]}>
                    <Image source={require('../../assets/ic_gg_plus_icon.png')} style={{height: '100%', resizeMode: 'contain'}}/>
                    <Text style={styles.buttonText}>Continue with Google</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.colorButton, {marginTop: 15}]}
                    onPress={() => this._loginWithFacebook()}>
                    <Image source={require('../../assets/ic_fb_logo.png')} style={{height: '100%', resizeMode: 'contain'}}/>
                    <Text style={styles.buttonText}>Continue with Facebook</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.colorButton, {marginTop: 15}]}
                    onPress={() => navigation.navigate('AuthenticationEmail')}>
                    <Image source={require('../../assets/ic_mail.png')} style={{height: '100%', resizeMode: 'contain'}}/>
                    <Text style={styles.buttonText}>Continue with email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgotPasswordContainer}>
                    <Text style={styles.forgotPasswordText}>Forgot password ?</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.mainLightGray,
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    image: {
        width: '50%',
        aspectRatio: 1,
        resizeMode: 'contain',
        marginBottom: 15
    },
    text: {
        color: colors.mainDarkGray,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
    colorButton: {
        borderRadius: 3,
        width: '65%',
        paddingVertical: 9,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: colors.mainWhite,
        elevation: 3,
        shadowOffset: {width: 2, height: 2},
        shadowColor: colors.mainDarkGray,
        shadowOpacity: 0.5
    },
    buttonText: {
        textAlign: 'center',
        color: colors.blackText,
        fontSize: 17
    },
    forgotPasswordContainer: {
        height: 100
    },
    forgotPasswordText: {
        marginTop: 44.5,
        color: '#64abab',
        fontSize: 16
    }
})