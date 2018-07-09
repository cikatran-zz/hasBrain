import React from "react";
import {Image, View, StyleSheet, Animated, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import {colors} from "../constants/colors";
import _ from 'lodash'
import HBText from "./HBText";

export default class TabItem extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const {selected, title, onClicked, style} = this.props;
        return (
            <TouchableWithoutFeedback onPress={onClicked}>
                <View style={[styles.rootView, style]}>
                    <View style={{paddingHorizontal: 10}}>
                        <HBText numberOfLines={1}
                                style={[styles.titleText, {color: selected ? colors.blueText : colors.tagGrayText}]}>{title}</HBText>
                    </View>
                    {selected && <View style={styles.lineView}/>}
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    rootView: {
        justifyContent: 'space-between',
        flexDirection: 'column',
    },
    titleText: {
        fontSize: 14,
        width: '100%',
        textAlign: 'center'
    },
    lineView: {
        height: 2,
        width: '100%',
        backgroundColor: colors.blueText,
        alignSelf: 'flex-end'
    }
});
