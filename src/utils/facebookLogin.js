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
                        NativeModules.RNUserKitIdentity.signInWithFacebookAccount(value.accessToken, (error, result)=> {
                            if (error) {
                                reject(error);
                            } else {

                                const infoRequest = new GraphRequest(
                                    '/me',
                                    {parameters: {fields: {string:'last_name,age_range,gender,first_name,email'}}},
                                    (error, result)=> {
                                        if (error) {
                                            console.log('Error fetching data: ',error);
                                        } else {
                                            let baseInfo = {
                                                gender: (result.gender === "female") ? "Female" : "Male",
                                                lastName: result.last_name,
                                                firstName: result.first_name,
                                                age: _.get(result, 'age_range.min',0).toString(),
                                                email: result.email ? result.email : ""
                                            };
                                            NativeModules.RNUserKit.storeProperty("_base_info", baseInfo, (error, result) => {});
                                        }
                                    },
                                );
                                new GraphRequestManager().addRequest(infoRequest).start();
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