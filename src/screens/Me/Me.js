import React from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableOpacity
} from 'react-native'
import { colors } from '../../constants/colors'
import {NavigationActions} from "react-navigation";

export default class Me extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // this.props.getMe()
    }

    _signOut = () => {
        NativeModules.RNUserKitIdentity.signOut();
        this.props.navigation.navigate('Root')
    };

    render() {
        return (
            <View style={{ backgroundColor: colors.mainLightGray, flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this._signOut()}>
                    <Text style={styles.signOut}>Sign out</Text>
                </TouchableOpacity>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    signOut: {
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: (Platform.OS === 'ios') ? 17 : 30,
        backgroundColor: colors.redButton,
        fontSize: 17,
        color: '#ffffff',
        overflow: 'hidden',
        textAlign: 'center',
        paddingTop: 8,
        paddingBottom: 8
    }
})
