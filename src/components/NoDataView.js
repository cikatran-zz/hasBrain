import React from "react";
import {Image, View, StyleSheet} from "react-native";
import {colors} from "../constants/colors";
import _ from 'lodash'
import HBText from './HBText'

export default class NoDataView extends React.PureComponent {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={[styles.alertWindow, this.props.style]}>
                <HBText style={styles.message}>{_.get(this.props, 'text', '')}</HBText>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    alertWindow: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    message: {
        color: colors.mainDarkGray,
        fontSize: 20,
    }
});
