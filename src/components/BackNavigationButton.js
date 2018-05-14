import React from "react";
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import {colors} from "../constants/colors";

export default class BackNavigationButton extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.goBack}
                              style={styles.backButton}>
                <Image source={require('../assets/ic_back_button.png')} style={styles.backImage}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 0,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    backImage: {
        resizeMode: 'contain',
        width: 25,
        height: 25,
        tintColor: colors.blackHeader
    }
});
