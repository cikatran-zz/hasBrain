import React from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet, ImageBackground} from "react-native";
import {blackTextStyle, grayTextStyle, titleCardStyle} from "../constants/theme";
import {getPublishDateDescription} from "../utils/dateUtils";
import {colors} from "../constants/colors";

export default class HorizontalCell extends React.PureComponent {
    render() {
        return (
            <View style={[styles.cardView, this.props.style]} >
                <Image style={styles.image} source={require('../assets/ic_hasbrain.png')}/>
                <View style={styles.textView}>
                    <Text numberOfLines={2} style={[titleCardStyle, {height: 60, flexWrap: "wrap", width: '100%', flex: 1}]}>{this.props.title}</Text>
                    <Text style={[blackTextStyle, {marginBottom: 5}]}>{this.props.author}</Text>
                    <Text style={grayTextStyle}>{getPublishDateDescription(this.props.time)}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        shadowOffset: {width: 2, height: 2},
        shadowColor: colors.mainDarkGray,
        shadowOpacity: 0.5,
        flexDirection: 'column',
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
        flex: 1,
        width: 250,
        marginRight: 10,
        marginVertical: 10
    },
    image: {
        position: 'absolute',
        top: 0,
        width: '100%',
        borderRadius: 5,
        left: 0,
        right: 0,
        resizeMode: 'contain'
    },
    textView: {
        marginTop: 50,
        width: '100%',
        flexDirection: 'column',
        padding: 15,
        backgroundColor: colors.mainWhite,
        marginBottom: 5
    }
});
