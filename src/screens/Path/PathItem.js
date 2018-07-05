import React from "react";
import {Image, TouchableOpacity, View, StyleSheet, Animated, TouchableWithoutFeedback} from "react-native";
import {colors} from "../../constants/colors";
import HBText from "../../components/HBText";
import _ from 'lodash';

export default class PathItem extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    _renderContributors = () => {
        const {contributors} = this.props;
        if (_.isEmpty(contributors)) {
            return null;
        }

        return contributors.map((x)=> <Image style={styles.contributorAvatar} source={{uri: 'https://s3-ap-southeast-1.amazonaws.com/userkit-identity-pro/avatars/' + x + 'medium.jpg?'}}/>)
    };

    render() {
        const {title, shortDescription, onClicked, style} = this.props;

        return (
            <TouchableWithoutFeedback onPress={onClicked}>
                <View style={[styles.cardView, style]}>
                    <HBText style={styles.pathTitleText}>{title ? title : ""}</HBText>
                    <View style={styles.horizontalView}>
                        {this._renderContributors()}
                    </View>
                    <HBText numberOfLines={2} style={styles.descriptionText}>{shortDescription ? shortDescription : ""}</HBText>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    cardView: {
        flexDirection: 'column',
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginBottom: 20,
        marginHorizontal: 25,
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
    },
    contributorAvatar: {
        width: 30,
        height: 30,
        marginRight: 5,
        borderRadius: 15
    },
    horizontalView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 9
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
        fontSize: 16
    },
    image: {
        width: 15,
        height: 25,
        resizeMode: 'contain'
    },
    descriptionText: {
        color: colors.articleCategory,
        fontSize: 12,
        flexWrap: 'wrap',
        flex: 4
    }
});
