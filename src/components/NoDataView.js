import React from "react";
import {Image, Text, View, StyleSheet} from "react-native";
import {colors} from "../constants/colors";
import _ from 'lodash'

export default class NoDataView extends React.PureComponent {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={[styles.rootView, this.props.style]}>
                <Text style={styles.message}>{_.get(this.props, 'text', '')}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        backgroundColor: colors.mainLightGray,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    message: {
        color: colors.mainDarkGray,
        fontSize: 20,
    }
});
