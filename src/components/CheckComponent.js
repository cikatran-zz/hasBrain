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
            checkImage = require('../assets/ic_selected_tick.png');
        } else {
            checkImage = require('../assets/ic_tick_unselected.png');
        }
        return (
            <TouchableWithoutFeedback style={{width: 70, height: 50, padding: 10, backgroundColor: 'red03052013wp5s3b#' +
                ''}} onPress={this._onPress}>
                <View>
                    <Image source={checkImage} />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}