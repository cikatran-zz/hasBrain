import React from 'react'
import {
    View, StyleSheet, Image, Platform, TextInput, TouchableOpacity, NativeModules,
    ActivityIndicator, Animated, ScrollView, FlatList
} from 'react-native'
import {colors} from "../../../constants/colors";
import IndicatorModal from "../../../components/IndicatorModal";
import Toast from 'react-native-root-toast';
import {postCreateUser} from "../../../api/index";
import _ from 'lodash'
import {strings} from "../../../constants/strings";
import {rootViewBottomPadding, rootViewTopPadding} from "../../../utils/paddingUtils";
import HBText from '../../../components/HBText'

export default class Explore extends React.PureComponent {

    constructor(props) {
        super(props);
        this.email = "";
        this.password = "";
        this.name = "";
        this.confirmPassword = "";
        this.indicatorModal = null;
        this.callbackMessage = "";
        this.state = {
            signUp: false
        };
        this._signUpShown = new Animated.Value(0);
        this._signInShown = new Animated.Value(1);
    }

    componentDidMount() {
    }

    trim(s) {
        return (s || '').replace(/^\s+|\s+$/g, '');
    }

    _signUp = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
            this._showMessage("Invalid email");
            return;
        }
        if (this.password !== this.confirmPassword) {
            this._showMessage("Password is not match");
            return;
        }
        if (this.trim(this.name) === "") {
            this._showMessage("Name should not be empty");
            return;
        }
        this.indicatorModal.setState({isShow: true});
        NativeModules.RNUserKitIdentity.signUpWithEmail(this.email, this.password, {_name: this.name, name: this.name }, (error, results) => {
            console.log();
            if (error != null) {
                this.callbackMessage = JSON.parse(error).message;
                this.indicatorModal.setState({isShow: false});
            } else {
                this.props.createUser();
                this.indicatorModal.setState({isShow: false});
                this._nextScreen()
            }

        })
    };

    _signIn = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
            this._showMessage("Invalid email");
            return;
        }
        this.indicatorModal.setState({isShow: true});
        NativeModules.RNUserKitIdentity.signInWithEmail(this.email, this.password, (error, results) => {
            if (error != null) {
                this.callbackMessage = JSON.parse(error).message;
                this.indicatorModal.setState({isShow: false});
            } else {
                this.props.createUser();
                this.indicatorModal.setState({isShow: false});
                this._nextScreen();
            }
        })
    };

    _nextScreen = () => {
        NativeModules.RNUserKit.getProperty(strings.mekey + '.' + strings.experienceKey, (error, result) => {
            if (error == null && result != null) {
                let experience = _.get(result[0], strings.mekey + '.' + strings.experienceKey);
                if (experience == null) {
                    this.props.navigation.navigate('Onboarding');
                } else {
                    this.props.navigation.navigate("Home");
                }
            } else {
                this.props.navigation.navigate('Onboarding');
            }
        });
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

    _showSignIn = () => {
        Animated.timing(this._signUpShown, {
            toValue: 0,
            duration: 100,
        }).start(() => {
            this.setState({signUp: false});
            Animated.timing(this._signInShown, {
                toValue: 1,
                duration: 100,
            }).start();
        });
    };

    _showSignUp = () => {
        Animated.timing(this._signInShown, {
            toValue: 0,
            duration: 100,
        }).start(() => {
            this.setState({signUp: true});
            Animated.timing(this._signUpShown, {
                toValue: 1,
                duration: 100,
            }).start();
        });
    };

    _signInForm = () => (
        <Animated.View style={[styles.formView, {opacity: this._signInShown}]}>
            <View style={styles.inputView}>
                <TextInput style={styles.inputText}
                           placeholder={'Email'}
                           secureTextEntry={false}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           onChangeText={(text) => this.email = text}/>
                <TextInput style={styles.inputText}
                           placeholder={'Password'}
                           secureTextEntry={true}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           onChangeText={(text) => this.password = text}/>
            </View>
            <View style={styles.interactionView}>
                <TouchableOpacity
                    style={[styles.colorButton]}
                    onPress={() => this._signIn()}>
                    <Image source={require('../../../assets/ic_signin.png')}
                           style={{height: '100%', width: 64, resizeMode: 'contain'}}/>
                    <HBText style={styles.buttonText}>Sign in</HBText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => this._showSignUp()}>
                    <HBText style={styles.forgotPasswordText}>Create new account?</HBText>
                </TouchableOpacity>
            </View>
        </Animated.View>);

    _renderSignUpItem = ({item}) => {
        if (item === "name") {
            return (<TextInput style={styles.inputText}
                               placeholder={'Name'}
                               secureTextEntry={false}
                               underlineColorAndroid='rgba(0,0,0,0)'
                               onChangeText={(text) => this.name = text}/>);
        } else if (item === "email") {
            return (<TextInput style={styles.inputText}
                               placeholder={'Email'}
                               secureTextEntry={false}
                               underlineColorAndroid='rgba(0,0,0,0)'
                               onChangeText={(text) => this.email = text}/>);
        } else if (item === "password") {
            return (<TextInput style={styles.inputText}
                               placeholder={'Password'}
                               secureTextEntry={true}
                               underlineColorAndroid='rgba(0,0,0,0)'
                               onChangeText={(text) => this.password = text}/>);
        } else {
            return (<TextInput style={styles.inputText}
                               placeholder={'Confirm password'}
                               secureTextEntry={true}
                               underlineColorAndroid='rgba(0,0,0,0)'
                               onChangeText={(text) => this.confirmPassword = text}/>)
        }
    };

    _signUpForm = () => (
        <Animated.View style={[styles.formView, {opacity: this._signUpShown}]}>
            <View style={styles.inputView}>
                <FlatList style={{flex: 1}}
                          data={["name", "email", "password", "confirm"]}
                          bounces={false}
                          renderItem={this._renderSignUpItem}/>
            </View>
            <View style={styles.interactionView}>
                <TouchableOpacity
                    style={[styles.colorButton]}
                    onPress={() => this._signUp()}>
                    <Image source={require('../../../assets/ic_signup.png')}
                           style={{height: '100%', width: 64, resizeMode: 'contain'}}/>
                    <HBText style={styles.buttonText}>Sign up</HBText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => this._showSignIn()}>
                    <HBText style={styles.forgotPasswordText}>Already have account?</HBText>
                </TouchableOpacity>
            </View>
        </Animated.View>);

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <IndicatorModal ref={(modal) => {
                    this.indicatorModal = modal
                }} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image style={styles.backImage} source={require('../../../assets/ic_back_button.png')}/>
                </TouchableOpacity>
                <Image style={styles.image} source={require('../../../assets/ic_hasbrain.png')}/>
                <HBText style={styles.text}>hasBrain</HBText>
                {this.state.signUp ? this._signUpForm() : this._signInForm()}

            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.mainWhite,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%'
    },
    inputView: {
        flex: 4,
        width: '100%',
        flexDirection: 'column',
    },
    interactionView: {
        flex: 2,
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: rootViewBottomPadding()
    },
    formView: {
        flexDirection: 'column',
        flex: 4,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    backButton: {
        position: 'absolute',
        padding: 15,
        top: rootViewTopPadding(),
        left: 0
    },
    backImage: {
        resizeMode: 'contain',
        width: 30,
        height: 30,
        tintColor: colors.grayText
    },
    image: {
        flex: 1,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginBottom: 15,
        marginTop: rootViewTopPadding() + 10
    },
    text: {
        color: colors.mainDarkGray,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15
    },
    inputText: {
        width: '85%',
        height: 40,
        paddingHorizontal: 23.5,
        borderColor: 'rgba(152,152,152,0.32)',
        borderWidth: 1,
        borderRadius: (Platform.OS === 'ios') ? 3 : 6,
        marginTop: 15,
        alignSelf: 'center',
        fontFamily: 'CircularStd-Book'
    },
    colorButton: {
        borderRadius: 3,
        width: '85%',
        paddingVertical: 15,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: colors.mainWhite,
        elevation: 3,
        shadowOffset: {width: 2, height: 2},
        shadowColor: colors.mainDarkGray,
        shadowOpacity: 0.5
    },
    forgotPasswordContainer: {
        padding: 10,
        flexDirection: 'row'
    },
    forgotPasswordIntroText: {
        marginTop: 44.5,
        fontSize: 15
    },
    forgotPasswordText: {
        color: '#64abab',
        fontSize: 15
    },
    buttonText: {
        textAlign: 'center',
        color: colors.blackText,
        fontSize: 14,
        width: '100%',
        marginLeft: -64
    }
});
