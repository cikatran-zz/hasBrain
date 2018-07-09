import React, {PureComponent} from 'react';
import {View, TouchableWithoutFeedback, StyleSheet, Image} from 'react-native';
import {Proptypes} from 'prop-types';
import {colors} from '../constants/colors'
import HBText from './HBText'

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
        if (this.props.id === "_filter") {
            return (<TouchableWithoutFeedback onPress={this._onPress}>
                <View style={[styles.container, {backgroundColor: colors.lightGray, borderColor: colors.lightGray}]}>
                    <Image source={require('../assets/ic_explore_filter.png')} style={{resizeMode: 'contain', width: 15, height: 15, marginHorizontal: 15}}/>
                </View>
            </TouchableWithoutFeedback>)
        }
        return (
            <TouchableWithoutFeedback onPress={this._onPress}>
                <View style={[styles.container, isOn ? {borderColor: colors.blueText} : {backgroundColor: colors.lightGray, borderColor: colors.lightGray}]}>
                    <HBText style={[styles.text, isOn ? {color: colors.blueText} : {color: colors.tagGrayText}]}>{this.props.id}</HBText>
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
        borderWidth: 1
    },
    text: {
        fontSize: 13,
        marginHorizontal: 10,
        fontFamily: 'CircularStd-Book'
    }
});