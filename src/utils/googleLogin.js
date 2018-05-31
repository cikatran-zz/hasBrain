import _ from 'lodash'
import {GoogleSignin} from 'react-native-google-signin';
import {NativeModules} from 'react-native';

export function googleLogin () {
    return new Promise((resolve, reject) => {
        GoogleSignin.configure({
            iosClientId: "994897015659-riuo55c2catoa6822c7bi713upqvlqdt.apps.googleusercontent.com"
        })
            .then(() => {
                GoogleSignin.signIn()
                    .then((user) => {
                        console.log('Google user', user);
                        NativeModules.RNUserKitIdentity.signInWithGooglePlusAccount(user.accessToken, (err, events) => {
                            if (err) {
                                reject({message: err});
                            }
                            else {
                                let result = JSON.parse(events[0]);
                                console.log('Google login user info', result);
                                let baseInfo = {
                                    gender: '',
                                    lastName: user.familyName,
                                    firstName: user.givenName,
                                    email: user.email ? user.email : ""
                                };
                                NativeModules.RNUserKit.storeProperty("_base_info", baseInfo, (error, result) => {});
                                resolve(result);
                            }
                        })
                    })
                    .catch((err) => {
                        console.log('Google sign in error', err);
                        reject({message: err});
                    })
                    .done();
            })
    })
};