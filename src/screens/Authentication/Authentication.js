import React from 'react'
import {
    Text, View, StyleSheet, Image, Platform, TextInput, TouchableOpacity, NativeModules,
    ActivityIndicator
} from 'react-native'
import {colors} from "../../constants/colors";
import _ from 'lodash'
import {strings} from "../../constants/strings";
import { facebookLogin } from '../../utils/facebookLogin'
import { googleLogin } from '../../utils/googleLogin'
import NavigationActions from 'react-navigation/src/NavigationActions'
import PathSlider from "../../components/PathSlider";
import {postCreateUser} from "../../api";
import IndicatorModal from "../../components/IndicatorModal";
import Toast from "react-native-root-toast";

export default class Authentication extends React.PureComponent {

    constructor(props) {
        super(props);
        this.indicatorModal = null;
        this.callbackMessage = "";
    }

    componentDidMount() {
        NativeModules.RNUserKitIdentity.checkSignIn((err, events) => {
            let result = JSON.parse(events[0]);
            if (result["is_sign_in"] === true) {
                this._goToNextScreen();
            }
        })
    }

    _goToNextScreen() {
        NativeModules.RNUserKit.getProperty(strings.mekey+'.'+strings.experienceKey, (error, result)=> {
            if (error == null && result != null) {
                let experience = _.get(result[0], strings.mekey+'.'+strings.experienceKey);
                if (experience == null) {
                    this._goToOnBoarding();
                } else {
                    this.props.navigation.navigate("Home");
                }
            } else {
                this._goToOnBoarding();
            }
        });
    }

    _goToOnBoarding = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "Onboarding"
                })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    _createUser = (profile) => {
        postCreateUser(_.get(profile, 'id', ''), _.get(profile, '_name', '')).then((value) => {
            //console.log(value);
        }).catch((error) => {
            //console.log(error);
        });
    };

    _loginWithFacebook = () => {
        this.indicatorModal.setState({isShow: true});
        facebookLogin().then((value) => {
            this.indicatorModal.setState({isShow: false});
            if (value.new) {
                this._createUser(_.get(value, 'profiles[0]', {}));
            }
            this._goToNextScreen();
        }).catch((error) => {
            this.callbackMessage = error;
            this.indicatorModal.setState({isShow: false});
        })
    };

    _loginWithGooglePlus = () => {
        this.indicatorModal.setState({isShow: true});
        googleLogin().then((value) => {
            this.indicatorModal.setState({isShow: false});
            if (value.new) {
                this._createUser(_.get(value, 'profiles[0]', {}));
            }
            this._goToNextScreen();
        })
        .catch((err) => {
            this.callbackMessage = err;
            this.indicatorModal.setState({isShow: false});
        })
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
                this.callbackMessage = "";
            },
            onHide: () => {

            },
            onHidden: () => {

            }
        });
    };

    onDismissIndicatorModal() {
        this._showMessage(this.callbackMessage)
    }

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <IndicatorModal ref={(modal) => {
                    this.indicatorModal = modal
                }} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <Image style={styles.image} source={require('../../assets/ic_hasbrain.png')}/>
                <Text style={styles.text}>hasBrain</Text>
                <TouchableOpacity
                    style={[styles.colorButton, {marginTop: 44.5}]}
                    onPress={() => this._loginWithGooglePlus()}>
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
        fontWeight: 'bold',
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