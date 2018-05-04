import React from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableOpacity
} from 'react-native'
import { colors } from '../../constants/colors'

export default class Me extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        // this.props.getMe()
    }

    _signOut = () => {
        const { navigation } = this.props
        NativeModules.RNUserKitIdentity.signOut()
        navigation.goBack()
    }

    render() {
        const { me } = this.props
        return (
            <View style={{ backgroundColor: colors.mainLightGray }}>
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
        marginLeft: 70,
        marginRight: 70,
        marginBottom: 84,
        borderRadius: (Platform.OS === 'ios') ? 17 : 30,
        backgroundColor: '#000000',
        fontSize: 17,
        color: '#ffffff',
        overflow: 'hidden',
        textAlign: 'center',
        paddingTop: 8,
        paddingBottom: 8
    }
})
