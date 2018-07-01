import React from "react";
import {Image, Text, TouchableOpacity, View, StyleSheet, Animated} from "react-native";
import {
    blackTextStyle, graySmallTextStyle, grayTextStyle, hightlightTextStyle, peopleNameCardStyle,
    titleCardStyle
} from "../constants/theme";
import {getPublishDateDescription, getReadingTimeDescription} from "../utils/dateUtils";
import {colors} from "../constants/colors";
import ArticleButton from "./ArticleButton";
import HBText from '../components/HBText'

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

    _renderHighlight = () => {
        if (this.props.highlightData == null) {return null};
        const {highlightData: {highlights, userData: {profileId="", name=""}}} = this.props;
        if (highlights == null || highlights.length === 0) {
            return null;
        }
        return (<View style={styles.hightlightRoot}>
            <View style={[styles.hightlightHorizontalView, {alignItems: 'center'}]}>
                <Image source={{uri: 'https://s3-ap-southeast-1.amazonaws.com/userkit-identity-pro/avatars/'+profileId+'medium.jpg?'}} style={styles.sourceImage}/>
                <HBText style={peopleNameCardStyle}>{name}</HBText>
            </View>
            <View style={styles.hightlightHorizontalView}>
                <View style={styles.lineView}/>
                <HBText style={hightlightTextStyle}>{highlights[0].highlight}</HBText>
            </View>
        </View>
    )};

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
                    <HBText style={styles.categoryText}>{this.props.category ? this.props.category.toUpperCase() : ""}</HBText>
                    {this._renderHighlight()}
                    <View style={styles.horizontalView}>
                        <View style={styles.titleTextView}>
                            <HBText onLayout={this._calculateTitleNumberOfLines} numberOfLines={3} style={titleCardStyle}>{(this.props.title == null) ? "" : this.props.title}</HBText>
                            {this.state.shortDesciptionNoLines > 0 && <HBText numberOfLines={this.state.shortDesciptionNoLines} style={[grayTextStyle, {marginTop: 15}]}>{(this.props.shortDescription == null) ? "" : this.props.shortDescription}</HBText>}

                        </View>
                        {this._renderImage()}
                    </View>
                    <View style={[styles.horizontalView, {marginTop: 15}]}>
                        <View style={styles.subTextView}>
                            <View style={styles.sourceView}>
                                {
                                    this.props.sourceImage && <Image style={styles.sourceImage} source={{uri: this.props.sourceImage}}/>
                                }
                                <HBText
                                    style={[graySmallTextStyle]}>{(this.props.sourceName == null) ? "" : this.props.sourceName}</HBText>
                            </View>

                            <HBText style={grayTextStyle}>{action}</HBText>
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
    hightlightRoot: {
        flexDirection: 'column',
    },
    hightlightHorizontalView: {
        flexDirection: 'row',
        marginBottom: 20
    },
    lineView: {
        width: 1,
        backgroundColor: colors.articleCategory,
        height: '100%',
        marginRight: 10
    }
});
