import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk'
import {NativeModules} from 'react-native'
import _ from 'lodash'

export function facebookLogin() {
    return new Promise((resolve, reject)=> {
        LoginManager.logInWithReadPermissions(['public_profile', 'email']).then(
            function(result) {
                console.log("Facebook Login",result);
                if (result.isCancelled) {
                    reject({message: "Cancelled"});
                } else {
                    AccessToken.getCurrentAccessToken().then(value => {
                        NativeModules.RNUserKitIdentity.signInWithFacebookAccount(value.accessToken, (error, events)=> {
                            if (error) {
                                reject(error);
                            } else {
                                let result = JSON.parse(events[0]);
                                resolve(result);
                            }
                        });
                    }).catch((error)=>{
                        reject(error);
                    });
                }
            },
            function(error) {
                reject(error);
            }
        );
    });
}