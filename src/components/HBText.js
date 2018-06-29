import React, {PureComponent} from "react";
import { Text } from 'react-native';

export default class HBText extends PureComponent {
    render() {
        return (
            <Text {...this.props} style={[{fontFamily: 'CircularStd-Book'}, this.props.style]}>{this.props.children}</Text>
        )
    }
}