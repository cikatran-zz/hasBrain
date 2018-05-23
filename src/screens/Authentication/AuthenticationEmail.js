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

export default class Explore extends React.PureComponent {

    constructor(props) {
        super(props);
        this.email = "";
        this.password = "";
        this.indicatorModal = null;
        this.callbackMessage = "";
    }

    componentDidMount() {
    }

    _signUp = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
            this._showMessage("Invalid email");
            return;
        }
        this.indicatorModal.setState({isShow: true});
        NativeModules.RNUserKitIdentity.signUpWithEmail(this.email, this.password, {}, (error, results) => {
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
        postCreateUser(_.get(profile, 'id', ''), _.get(profile, 'name', '')).then((value)=> {
            //console.log(value);
        }).catch((error)=>{
            //console.log(error);
        });
    };

    _nextScreen = () => {
        NativeModules.RNUserKit.getProperty(strings.onboardingKey, (error, result)=> {
            if (error == null && result != null) {
                let onboarding = JSON.parse(result[0]);
                let isOnboarded = _.get(onboarding, strings.onboardedKey, false);
                if (isOnboarded) {
                    this.props.navigation.navigate('Home');
                } else {
                    this.props.navigation.navigate('Onboarding');
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

    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <IndicatorModal ref={(modal)=>{this.indicatorModal = modal}} onDismiss={this.onDismissIndicatorModal.bind(this)}/>
                <Image style={styles.image} source={require('../../assets/ic_hasbrain.png')}/>
                <Text style={styles.text}>hasBrain</Text>
                <TextInput style={styles.inputText}
                           placeholder={'Email'}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           onChangeText={(text)=> this.email = text}/>
                <TextInput style={styles.inputText}
                           placeholder={'Password'}
                           secureTextEntry={true}
                           underlineColorAndroid='rgba(0,0,0,0)'
                           onChangeText={(text)=> this.password = text}/>
                <TouchableOpacity
                    style={[styles.colorButton, {backgroundColor: colors.blueButton, marginTop: 44.5}]}
                    onPress={()=>this._signIn()}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.colorButton, {backgroundColor: colors.redButton, marginTop: 15}]}
                    onPress={()=>this._signUp()}>
                    <Text style={styles.buttonText}>Sign Up</Text>
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
    inputText: {
        width: '85%',
        height: 40,
        paddingHorizontal: 23.5,
        borderColor: 'rgba(152,152,152,0.32)',
        borderWidth: 1,
        borderRadius: (Platform.OS === 'ios') ? 20 : 40,
        marginTop: 15
    },
    colorButton: {
        borderRadius: (Platform.OS === 'ios') ? 18 : 35,
        width: '65%',
        paddingVertical: 9,
        alignSelf: 'center'
    },
    buttonText: {
        textAlign: 'center',
        color: colors.mainWhite,
        fontSize: 17
    }
});
