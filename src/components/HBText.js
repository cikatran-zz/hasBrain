import React, {PureComponent} from "react";
import { Text } from 'react-native';
import _ from 'lodash'

export default class HBText extends PureComponent {
    render() {
        return (
            <Text {...this.props} style={[{fontFamily: 'CircularStd-Book'}, this.props.style]}>{_.isNull(this.props.children)? "" : this.props.children}</Text>
        )
    }
}