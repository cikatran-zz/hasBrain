import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Image, View, StyleSheet} from 'react-native';

type Props = {
    url: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired
}

export default class CircleImage extends PureComponent<Props> {

    render() {
        const {source, size} = this.props;
        let borderRadius = size/2;
        return (
            <View style={{width: size, height: size, borderRadius: borderRadius, overflow: 'hidden'}}>
                <Image style={{width: size, height: size}} source={source}/>
            </View>
        )

    }
}
