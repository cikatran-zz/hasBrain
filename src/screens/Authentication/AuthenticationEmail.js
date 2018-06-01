import React from 'react'
import {
    Text, View, StyleSheet, Image, Platform, TextInput, TouchableOpacity, NativeModules,
    ActivityIndicator, Animated
} from 'react-native'
import {colors} from "../../constants/colors";
import IndicatorModal from "../../components/IndicatorModal";
import Toast from 'react-native-root-toast';
import {postCreateUser} from "../../api";
import _ from 'lodash'
import {strings} from "../../constants/strings";
import {rootViewTopPadding} from "../../utils/paddingUtils";

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

    trim(s){
        return ( s || '' ).replace( /^\s+|\s+$/g, '' );
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
        NativeModules.RNUserKitIdentity.signUpWithEmail(this.email, this.password, {_name: this.name}, (error, results) => {
            console.log();
            if (error != null) {
                this.callbackMessage = JSON.parse(error).message;
                this.indicatorModal.setState({isShow: false});
            } else {
                this._createUser(_.get(JSON.parse(results[0]), 'profiles[0]', {}));
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
                this.indicatorModal.setState({isShow: false});
                this._nextScreen();
            }
        })
    };

    _createUser = (profile) => {
        postCreateUser(_.get(profile, 'id', ''), _.get(profile, '_name', '')).then((value) => {
            //console.log(value);
        }).catch((error) => {
            //console.log(error);
        });
    };

    _nextScreen = () => {
        NativeModules.RNUserKit.getProperty(strings.mekey, (error, result)=> {
            if (error == null && result != null) {
                let me = JSON.parse(result[0]);
                if (me == null || _.get(me, strings.experienceKey) == null) {
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
        }).start(()=>{
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
        }).start(()=>{
            this.setState({signUp: true});
            Animated.timing(this._signUpShown, {
                toValue: 1,
                duration: 100,
            }).start();
        });
    };

    _signInForm = () => (
        <Animated.View style={[styles.formView, {opacity: this._signInShown}]}>
            <TextInput style={styles.inputText}
                       placeholder={'Email'}
                       underlineColorAndroid='rgba(0,0,0,0)'
                       onChangeText={(text) => this.email = text}/>
            <TextInput style={styles.inputText}
                       placeholder={'Password'}
                       secureTextEntry={true}
                       underlineColorAndroid='rgba(0,0,0,0)'
                       onChangeText={(text) => this.password = text}/>
            <TouchableOpacity
                style={[styles.colorButton, {marginTop: 44.5}]}
                onPress={() => this._signIn()}>
                <Image source={require('../../assets/ic_signin.png')} style={{height: '100%', width: 64, resizeMode: 'contain'}}/>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={()=>this._showSignUp()}>
                <Text style={styles.forgotPasswordText}>Create new account?</Text>
            </TouchableOpacity>
        </Animated.View>);

    _signUpForm = () => (
        <Animated.View style={[styles.formView, {opacity: this._signUpShown}]}>
            <TextInput style={styles.inputText}
                       placeholder={'Name'}
                       underlineColorAndroid='rgba(0,0,0,0)'
                       onChangeText={(text) => this.name = text}/>
            <TextInput style={styles.inputText}
                       placeholder={'Email'}
                       underlineColorAndroid='rgba(0,0,0,0)'
                       onChangeText={(text) => this.email = text}/>
            <TextInput style={styles.inputText}
                       placeholder={'Password'}
                       secureTextEntry={true}
                       underlineColorAndroid='rgba(0,0,0,0)'
                       onChangeText={(text) => this.password = text}/>
            <TextInput style={styles.inputText}
                       placeholder={'Confirm password'}
                       secureTextEntry={true}
                       underlineColorAndroid='rgba(0,0,0,0)'
                       onChangeText={(text) => this.confirmPassword = text}/>
            {/*<TouchableOpacity*/}
                {/*style={[styles.colorButton, {backgroundColor: colors.redButton, marginTop: 44.5}]}*/}
                {/*onPress={() => this._signUp()}>*/}
                {/*<Text style={styles.buttonText}>Sign Up</Text>*/}
            {/*</TouchableOpacity>*/}
            <TouchableOpacity
                style={[styles.colorButton, {marginTop: 44.5}]}
                onPress={() => this._signUp()}>
                <Image source={require('../../assets/ic_signup.png')} style={{height: '100%', width: 64, resizeMode: 'contain'}}/>
                <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={()=>this._showSignIn()}>
                <Text style={styles.forgotPasswordText}>Already have account?</Text>
            </TouchableOpacity>
        </Animated.View>);

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <IndicatorModal ref={(modal) => {
                    this.indicatorModal = modal
                }} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image style={styles.backImage} source={require('../../assets/ic_back_button.png')}/>
                </TouchableOpacity>
                <Image style={styles.image} source={require('../../assets/ic_hasbrain.png')}/>
                <Text style={styles.text}>hasBrain</Text>
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
    formView: {
        flexDirection: 'column',
        width: '100%',
        alignItems: 'center',
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
        width: '50%',
        aspectRatio: 1,
        resizeMode: 'contain',
        marginBottom: 15,
        marginTop: rootViewTopPadding() + 50
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
        marginTop: 15
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
        height: 100,
        flexDirection: 'row'
    },
    forgotPasswordIntroText: {
        marginTop: 44.5,
        fontSize: 15
    },
    forgotPasswordText: {
        marginTop: 44.5,
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
