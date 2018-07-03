import React from "react";
import {Image, TouchableOpacity, View, StyleSheet, Animated} from "react-native";
import {colors} from "../../constants/colors";
import HBText from "../../components/HBText";

const ANIMATION_DURATION = 250;

export default class PathItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this._animated = new Animated.Value(0);
    }

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

    render() {
        const {data} = this.props;

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

        return (
            <TouchableOpacity onPress={this.props.onClicked}>
                <Animated.View style={rowStyles}>
                    <HBText style={styles.pathTitleText}>{(data.title ? data.title : "").toUpperCase()}</HBText>
                    <View style={[styles.horizontalView, {marginTop: 15}]}>
                        <HBText style={styles.descriptionText}>{data.shortDescription ? data.shortDescription : ""}</HBText>
                        {/*<TouchableOpacity style={{padding: 10, flex: 1}} onPress={this.props.onBookmark}>*/}
                            {/*<Image style={styles.image} source={ this.props.bookmarked ? require('../../assets/ic_saved.png') : require('../../assets/ic_save.png')}/>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </Animated.View>
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
    pathTitleText: {
        color: colors.darkBlue,
        fontSize: 20
    },
    image: {
        width: 15,
        height: 25,
        resizeMode: 'contain'
    },
    descriptionText: {
        color: colors.blackText,
        fontSize: 12,
        flexWrap: 'wrap',
        flex: 4
    }
});
