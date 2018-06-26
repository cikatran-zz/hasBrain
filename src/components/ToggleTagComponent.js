import React, {PureComponent} from 'react';
import {View, Text, TouchableWithoutFeedback, StyleSheet} from 'react-native';
import {Proptypes} from 'prop-types';
import {colors} from '../constants/colors'

type Props = {
    isOn: PropTypes.bool,
    onPressItem: PropTypes.func
}

export default class ToggleTagComponent extends PureComponent<Props> {

    constructor(props) {
        super(props)
    }

    _onPress = () => {
        const {id} = this.props;
        this.props.onPressItem(id);
    };

    render() {
        const {isOn} = this.props;
        return (
            <TouchableWithoutFeedback onPress={this._onPress}>
                <View style={[styles.container, isOn ? {borderColor: colors.blueText} : {backgroundColor: colors.lightGray, borderColor: colors.lightGray}]}>
                    <Text style={[styles.text, isOn ? {color: colors.blueText} : {color: colors.tagGrayText}]}>{this.props.id}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 33,
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 0.5
    },
    text: {
        fontSize: 13,
        marginHorizontal: 10,
        fontFamily: 'CircularStd-Book'
    }
});