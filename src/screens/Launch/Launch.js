import React from 'react'
import {
    View,
    ActivityIndicator
} from 'react-native'
import NavigationService from "../../NavigationService";
import _ from "lodash";

export default class Launch extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.checkSignIn();
        this.props.checkOnboarded();
    }

    componentWillReceiveProps(nextProps) {
        const {authentication} = nextProps;
        if (authentication.checkedSignIn && authentication.checkedOnboarded) {
            if (!authentication.signedIn) {
                NavigationService.reset('Authentication');
            } else {
                this.props.createUser();
                if (authentication.onboarded){
                    NavigationService.reset("Home");
                } else {
                    NavigationService.reset("Onboarding")
                }
            }
        }
    }

    render= ()=>(
        <View style={{justifyContent:'center', alignItems:'center', flex: 1}}>
            <ActivityIndicator size="large"/>
        </View>
    );

}
