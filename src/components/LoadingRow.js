import React from "react";
import {View, StyleSheet, Text} from "react-native";
import {colors} from "../constants/colors";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default class LoadingRow extends React.PureComponent {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={[styles.rootView, this.props.style]}>
                <View style={{flex: 2, flexDirection: 'column'}}>
                    <ShimmerPlaceHolder
                        autoRun={true}
                        height={20}
                        style={{ width: '70%', marginBottom: 15, backgroundColor: colors.mainDarkGray}}
                    />
                    <ShimmerPlaceHolder
                        autoRun={true}
                        height={20}
                        style={{ width: '90%', marginBottom: 10}}
                    />
                    <ShimmerPlaceHolder
                        autoRun={true}
                        height={20}
                        style={{ width: '50%'}}
                    />
                </View>
                <ShimmerPlaceHolder
                    autoRun={true}
                    style={[styles.placeholderView, {flex: 1, aspectRatio: 1}]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: 15
    },
    placeholderView: {
        backgroundColor: colors.mainDarkGray
    }
});