import React from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import {blackTextStyle, graySmallTextStyle, grayTextStyle, titleCardStyle} from "../constants/theme";
import {getPublishDateDescription, getReadingTimeDescription} from "../utils/dateUtils";
import {colors} from "../constants/colors";
import ArticleButton from "./ArticleButton";

export default class VerticalRow extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    _getImage = () => {
        return (this.props.image != null) ? {uri: this.props.image} : require('../assets/ic_hasbrain.png');
    };

    _renderImage = () => {
        const {image} = this.props;
        if (image === '' || image == null) {
            return null;
        }
        return (<Image source={{uri: image}}
                       style={styles.thumbnailImage}/>)
    };

    render() {
        return (
            <TouchableOpacity onPress={this.props.onClicked}>
                <View style={[styles.cardView, this.props.style]}>
                    <View style={styles.horizontalView}>
                        <Text numberOfLines={2} style={[titleCardStyle, {
                            flex: 2,
                            marginRight: 10,
                            maxHeight: 100,
                            flexWrap: "wrap"
                        }]}>{(this.props.title == null) ? "" : this.props.title}</Text>
                        {this._renderImage()}
                    </View>
                    <View style={[styles.horizontalView, {marginTop: 15}]}>
                        <View style={styles.subTextView}>
                            <Text
                                style={[graySmallTextStyle, {marginBottom: 5}]}>{(this.props.author == null) ? "" : this.props.author}</Text>
                            <Text style={grayTextStyle}>{getPublishDateDescription(this.props.time) + '   *   ' + getReadingTimeDescription(this.props.readingTime)}</Text>
                        </View>
                        <ArticleButton style={styles.articleButtonView}
                                       onShare={this.props.onShare}
                                       onBookmark={this.props.onBookmark}
                                       bookmarked={this.props.bookmarked}/>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
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
        alignSelf: 'flex-end'
    },
    titleText: {
        marginLeft: 0,
        marginRight: 20,
        height: '100%'
    },
    subTextView: {
        flexDirection: 'column'
    },
    articleButtonView: {
        marginRight: 0,
        marginLeft: 'auto'
    },
});
