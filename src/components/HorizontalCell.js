import React from "react";
import {
    Image,
    View,
    StyleSheet,
    ImageBackground,
    Dimensions, TouchableWithoutFeedback
} from 'react-native'
import {blackTextStyle, graySmallTextStyle, grayTextStyle, titleCardStyle} from "../constants/theme";
import {getPublishDateDescription, getReadingTimeDescription} from "../utils/dateUtils";
import {colors} from "../constants/colors";
import ArticleButton from "./ArticleButton";
import HBText from '../components/HBText'

export default class HorizontalCell extends React.PureComponent {

    _getImage = () => {
        return (this.props.image != null) ? {uri: this.props.image} : require('../assets/ic_placeholder.png');
    };

    render() {
        return (
            <TouchableWithoutFeedback onPress={this.props.onClicked}>
                <View style={[styles.cardView, this.props.style]} >
                    <Image style={styles.image} source={this._getImage()}/>
                    <View style={styles.textView}>
                        <HBText numberOfLines={3} style={styles.titleText}>{(this.props.title == null) ? "" : this.props.title}</HBText>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        flexDirection: 'column',
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
        marginVertical: 10,
    },
    image: {
        position: 'absolute',
        top: 0,
        width: '100%',
        borderRadius: 5,
        left: 0,
        right: 0,
        bottom: 5,
        resizeMode: 'cover',
        backgroundColor: colors.mainWhite
    },
    titleText: {
        height: 60,
        flexWrap: "wrap",
        width: '100%',
        flex: 1,
        color: colors.articleTitle,
        fontSize: 14
    },
    textView: {
        marginTop: 94,
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: colors.mainWhite,
        marginBottom: 5
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    subTextView: {
        flexDirection: 'column'
    },
    articleButtonView: {
        marginRight: 0,
        marginLeft: 'auto'
    },
});
