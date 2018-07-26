import React from 'react'
import {
    View, StyleSheet, Image, Platform, TextInput, TouchableOpacity, NativeModules,
    ActivityIndicator
} from 'react-native'
import {colors} from "../../constants/colors";
import _ from 'lodash'
import {strings} from "../../constants/strings";
import NavigationActions from 'react-navigation/src/NavigationActions'
import IndicatorModal from "../../components/IndicatorModal";
import Toast from "react-native-root-toast";
import HBText from '../../components/HBText'
import NavigationService from '../../NavigationService'
import {DotsLoader} from "react-native-indicator";

export default class Authentication extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const {authentication} = nextProps;

        if (authentication.signedIn) {
            this.props.createUser();
            // Request onboarded after signed in
            if (!authentication.checkedOnboarded && !authentication.isCheckingOnboarded) {
                this.props.checkOnboarded();
                return;
            } else if (authentication.checkedOnboarded && !authentication.isCheckingOnboarded) {
                // Go to next screen after check onboarded
                this._nextScreen(authentication);
                return
            }
        }

        // Show error
        if (authentication.error) {
            this._showMessage(authentication.error);
        }
    }
    _nextScreen = (authentication) => {
        if (authentication.onboarded){
            NavigationService.reset("Home");
        } else {
            NavigationService.navigate("Onboarding");
        }
    };

    _showMessage = (message) => {
        if (message === "") {
            return;
        }
        Toast.show(message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            onShow: () => {

            },
            onShown: () => {
            },
            onHide: () => {

            },
            onHidden: () => {

            }
        });
    };

    render() {
        const {authentication} = this.props;
        if (authentication.affiliateLoggingIn) {
            return (<View style={styles.container}>
                <View style={styles.dots}>
                    <DotsLoader color={colors.mainDarkGray} size={20} betweenSpace={10}/>
                </View>
            </View>);
        }

        return (
            <View style={styles.container}>
                <Image style={styles.image} source={require('../../assets/ic_hasbrain.png')}/>
                <HBText style={styles.text}>hasBrain</HBText>
                <TouchableOpacity
                    style={[styles.colorButton, {marginTop: 44.5}]}
                    onPress={() => this.props.logInWithGoogle()}>
                    <Image source={require('../../assets/ic_gg_plus_icon.png')}
                           style={{height: '100%', resizeMode: 'contain'}}/>
                    <HBText style={styles.buttonText}>Continue with Google</HBText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.colorButton, {marginTop: 15}]}
                    onPress={() => this.props.logInWithFacebook()}>
                    <Image source={require('../../assets/ic_fb_logo.png')}
                           style={{height: '100%', resizeMode: 'contain'}}/>
                    <HBText style={styles.buttonText}>Continue with Facebook</HBText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.colorButton, {marginTop: 15}]}
                    onPress={() => NavigationService.navigate('AuthenticationEmail')}>
                    <Image source={require('../../assets/ic_mail.png')}
                           style={{height: '100%', resizeMode: 'contain'}}/>
                    <HBText style={styles.buttonText}>Continue with email</HBText>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.mainWhite,
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
        fontFamily: 'CircularStd-Bold',
        marginBottom: 15
    },
    colorButton: {
        borderRadius: 3,
        width: '65%',
        paddingVertical: 15,
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
        fontSize: 14
    }
})