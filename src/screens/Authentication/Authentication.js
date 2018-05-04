import React from 'react'
import {Text, View, StyleSheet, Image, Platform, TextInput, TouchableOpacity, NativeModules} from 'react-native'
import {colors} from "../../constants/colors";
import {NavigationActions} from "react-navigation";
import IndicatorModal from "../../components/IndicatorModal";
import Toast from 'react-native-root-toast';

export default class Explore extends React.PureComponent {

    constructor(props) {
        super(props);
        this.email = "";
        this.password = "";
        this.indicatorModal = null;
    }

    componentDidMount() {
        NativeModules.RNUserKitIdentity.checkSignIn((error, results) => {
            let result = JSON.parse(results[0]);
            if (result.is_sign_in) {
                this._goToHomeScreen();
            }
        });
    }

    _goToHomeScreen = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: 'Home'
                })
            ]
        });
        this.props.navigation.dispatch(resetAction);
    };

    _signUp = () => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
            this._showMessage("Invalid email");
            return;
        }
        this.indicatorModal.setState({isShow: true});
        NativeModules.RNUserKitIdentity.signUpWithEmail(this.email, this.password, {}, (error, results) => {
            if (error != null) {
                this.callbackMessage = JSON.parse(error).message;
                this.indicatorModal.setState({isShow: false});
            } else {
                this.indicatorModal.setState({isShow: false});
                this._goToHomeScreen();
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
                this._goToHomeScreen();
            }
        })
    };

    _showMessage = (message) => {
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
