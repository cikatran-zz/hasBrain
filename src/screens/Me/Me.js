import React from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, TouchableOpacity, Image
} from 'react-native'
import { colors } from '../../constants/colors'
import {NavigationActions} from "react-navigation";
import CircleImage from '../../components/CircleImage'

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
            <View style={styles.container}>
                <View style={styles.profileContainer}>
                    <CircleImage
                        size={75}
                        url="https://ia.media-imdb.com/images/M/MV5BZTRiNTA4MjItNmQzMi00OWJiLWEwOTktNmRlNTAzYzZhN2UyL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMjIyNzU0OA@@._V1_.jpg"/>

                    <View style={styles.profileTextContainer}>
                        <Text numberOfLines={1} style={styles.profileName}>Jang Na Ra</Text>
                        <Text numberOfLines={2} style={styles.profileTitle}>Software Engineer Paypal</Text>
                    </View>

                    <View style={styles.profileActionButtonContainer}>
                        <Image source={require('../../assets/btn_edit.png')}/>
                        <Image style={{marginTop: 15}}source={require('../../assets/ic_settings_gear.png')}/>
                    </View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainWhite,
        alignItems:'center',
        paddingTop: 50
    },
    profileContainer: {
        flexDirection: 'row',
        width: '85%',
        height: '85%',
        justifyContent: 'space-between'
    },
    profileTextContainer: {
        flexDirection: 'column',
        width: '60%',
        height: 75,
        alignItems:'stretch'
    },
    profileName: {
        fontSize: 25,
        color: colors.blackText,
        fontWeight: 'bold'
    },
    profileTitle: {
        color: colors.blackHeader,
        fontSize: 18
    },
    profileActionButtonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        height: 75
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
