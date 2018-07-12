import React from "react";
import {View, StyleSheet} from "react-native";
import {colors} from "../constants/colors";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder'

export default class LoadingSquareItem extends React.PureComponent {

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={[styles.alertWindow, this.props.style]}>
                <ShimmerPlaceHolder
                    autoRun={true}
                    height={100}
                    style={[styles.placeholderView, {flex: 3, aspectRatio: 1}]}
                />
                <View style={{flex: 1, flexDirection: 'column', width: '100%'}}>
                    <ShimmerPlaceHolder
                        autoRun={true}
                        height={7}
                        width={70}
                        style={{marginBottom: 5}}
                    />
                    <ShimmerPlaceHolder
                        autoRun={true}
                        height={7}
                        width={90}
                        style={{marginBottom: 5}}
                    />
                    <ShimmerPlaceHolder
                        autoRun={true}
                        height={7}
                        width={50}
                    />
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    alertWindow: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        padding: 15
    },
    placeholderView: {
        backgroundColor: colors.mainDarkGray,
        marginBottom: 15
    }
});