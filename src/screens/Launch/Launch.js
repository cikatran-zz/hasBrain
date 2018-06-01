import React from 'react'
import {
    View, NativeModules,
    ActivityIndicator
} from 'react-native'
import {strings} from "../../constants/strings";
import _ from 'lodash'

export default class Launch extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        NativeModules.RNUserKitIdentity.checkSignIn((error, results) => {
            let result = JSON.parse(results[0]);
            if (result.is_sign_in) {
                NativeModules.RNUserKit.getProperty(strings.mekey+'.'+strings.experienceKey, (error, result)=> {
                    console.log("LAUNCH", error, result);
                    if (error == null && result != null) {
                        let experience = _.get(result[0], strings.mekey+'.'+strings.experienceKey);
                        if (experience == null) {
                            this.props.navigation.navigate('Onboarding');
                        } else {
                            this.props.navigation.navigate("Home");
                        }
                    } else {
                        this.props.navigation.navigate('Onboarding');
                    }
                });
            } else {
                this.props.navigation.navigate('Authentication');
            }
        });
    }

    render() {
        return (
            <View style={{justifyContent:'center', alignItems:'center', flex: 1}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

}
