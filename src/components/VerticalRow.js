import React from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet, Animated} from "react-native";
import {blackTextStyle, graySmallTextStyle, grayTextStyle, titleCardStyle} from "../constants/theme";
import {getPublishDateDescription, getReadingTimeDescription} from "../utils/dateUtils";
import {colors} from "../constants/colors";
import ArticleButton from "./ArticleButton";

const ANIMATION_DURATION = 250;
const ROW_HEIGHT = 70;

export default class VerticalRow extends React.PureComponent {

    constructor(props) {
        super(props);
        this._animated = new Animated.Value(0);
        this.state = {
            shortDesciptionNoLines: 0
        }
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

    componentDidMount() {
        Animated.timing(this._animated, {
            toValue: 1,
            duration: 0,
        }).start();
    }

    _onRemove = (doneRemove) => {
        Animated.timing(this._animated, {
            toValue: 0,
            duration: ANIMATION_DURATION,
        }).start(()=>{
            doneRemove();
            Animated.timing(this._animated, {
                toValue: 1,
                duration: 0,
            }).start();
        });
    };

    _calculateTitleNumberOfLines = ({nativeEvent: {layout: {height}}}) => {
        if (height > 55) {
            this.setState({shortDesciptionNoLines: 0})
        } else if (height >30) {
            this.setState({shortDesciptionNoLines: 1})
        } else {
            this.setState({shortDesciptionNoLines: 2})
        }
    };

    render() {

        const rowStyles = [
            styles.cardView,
            this.props.style,
            { opacity: this._animated },
            {
                transform: [
                    { scale: this._animated },
                    {
                        rotate: this._animated.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['35deg', '0deg'],
                            extrapolate: 'clamp',
                        })
                    }
                ],
            },
        ];

        let action = "";
        if (this.props.sourceActionName && this.props.sourceActionCount) {
            action += this.props.sourceActionCount + " " + this.props.sourceActionName;
        }

        if (this.props.sourceCommentCount) {
            if (action !== "") {
                action += "  \u2022  ";
            }
            action += this.props.sourceCommentCount + ((this.props.sourceCommentCount < 2)  ? " comment" : " comments");
        }

        if (action !== "") {
            action += "  \u2022  ";
        }

        action += getPublishDateDescription(this.props.time);

        return (
            <TouchableOpacity onPress={this.props.onClicked}>
                <Animated.View style={[rowStyles, this.props.style]}>
                    <Text style={styles.categoryText}>{this.props.category ? this.props.category.toUpperCase() : ""}</Text>
                    <View style={styles.horizontalView}>
                        <View style={styles.titleTextView}>
                            <Text onLayout={this._calculateTitleNumberOfLines} numberOfLines={3} style={titleCardStyle}>{(this.props.title == null) ? "" : this.props.title}</Text>
                            {this.state.shortDesciptionNoLines > 0 && <Text numberOfLines={this.state.shortDesciptionNoLines} style={[grayTextStyle, {marginTop: 15}]}>{(this.props.shortDescription == null) ? "" : this.props.shortDescription}</Text>}

                        </View>
                        {this._renderImage()}
                    </View>
                    <View style={[styles.horizontalView, {marginTop: 15}]}>
                        <View style={styles.subTextView}>
                            <View style={styles.sourceView}>
                                <Image style={styles.sourceImage} source={{uri: this.props.sourceImage ? this.props.sourceImage : ""}}/>
                                <Text
                                    style={[graySmallTextStyle]}>{(this.props.sourceName == null) ? "" : this.props.sourceName}</Text>
                            </View>

                            <Text style={grayTextStyle}>{action}</Text>
                        </View>
                        <ArticleButton style={styles.articleButtonView}
                                       onMore={this.props.onMore}
                                       onBookmark={this.props.onBookmark}
                                       bookmarked={this.props.bookmarked}/>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    categoryText: {
        fontFamily: 'CircularStd-Book',
        color: colors.articleCategory,
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 13,
        marginTop: 13
    },
    cardView: {
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingVertical: 15,
        marginBottom: 10,
        marginHorizontal: 10,
        backgroundColor: colors.lightGray,
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
        alignSelf: 'center'
    },
    titleTextView: {
        flex: 3,
        marginRight: 10,
        flexDirection: 'column',
        maxHeight: 100
    },
    subTextView: {
        flexDirection: 'column',
    },
    sourceView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    sourceImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover',
        marginRight: 10,
        borderRadius: 10
    },
    articleButtonView: {
        marginRight: 0,
        marginLeft: 'auto'
    },
});
