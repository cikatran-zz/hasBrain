import React from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {blackTextStyle, grayTextStyle, titleCardStyle} from "../constants/theme";
import {getPublishDateDescription} from "../utils/dateUtils";
import {colors} from "../constants/colors";

export default class VerticalNotificationRow extends React.PureComponent {

    _getImage = () => {
        return (this.props.image != null) ? {uri:this.props.image} : require('../assets/ic_hasbrain.png');
    };

    render() {
        return (
            <View style={[styles.cardView, this.props.style]}>
                <View style={styles.horizontalView}>
                    <Text style={[titleCardStyle, {flex: 2, flexWrap: "wrap"}]}>{this.props.title}</Text>
                    <Image source={this._getImage()}
                           style={styles.thumbnailImage}/>
                </View>
                <View style={[styles.horizontalView, {marginTop: 15}]}>
                    <View style={styles.subTextView}>
                        <Text style={blackTextStyle}>{this.props.highlight}</Text>
                        <Text style={grayTextStyle}>{getPublishDateDescription(this.props.time)}</Text>
                    </View>
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
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 10,
        marginHorizontal: 10,
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    thumbnailImage: {
        aspectRatio: 1.2,
        marginRight: 0,
        resizeMode: 'cover',
        borderRadius: 5,
        flex: 1,
        alignSelf: 'flex-end',
        overflow: 'hidden'
    },
    titleText: {
        marginLeft: 0,
        marginRight: 20,
        height: '100%'
    },
    subTextView: {
        flexDirection: 'column'
    },
    savedButton: {
        marginRight: 10,
        marginLeft: 'auto'
    },
    saveImage: {
        width: 20,
        height: 30,
        resizeMode: 'contain'
    }
});
