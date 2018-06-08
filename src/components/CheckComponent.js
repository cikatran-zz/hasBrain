import React, {PureComponent} from 'react';
import {View, Image, TouchableWithoutFeedback} from 'react-native';
import {Proptypes} from 'prop-types';

type Props = {
    checkedItem: PropTypes.bool,
    onPressItem: PropTypes.func
}

export default class CheckComponent extends PureComponent<Props> {

    constructor(props) {
        super(props)
    }

    _onPress = () => {
        const {id} = this.props;
        this.props.onPressItem(id);
    };

    render() {
        const {checkedItem} = this.props;
        let checkImage = null;
        if (checkedItem) {
            checkImage = require('../assets/ic_remove.png');
        } else {
            checkImage = require('../assets/ic_plus.png');
        }
        return (
            <TouchableWithoutFeedback onPress={this._onPress}>
                <View>
                    <Image source={checkImage} />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}