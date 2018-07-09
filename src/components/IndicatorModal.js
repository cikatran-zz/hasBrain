import React from "react";
import {StyleSheet, View, Modal} from "react-native";
import {DotsLoader} from 'react-native-indicator';
import {colors} from "../constants/colors";

export default class IndicatorModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            message: ""
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isShow === false && this.state.isShow === true) {
            this.props.onDismiss();
        }
        return true;
    }

    render() {
        return (
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.state.isShow}
                   presentationStyle="overFullScreen"
                   onDismiss={() => this.props.onDismiss()}
                   onRequestClose={() => {
                   }}>
                <View style={styles.container}>
                    <View style={styles.dots}>
                        <DotsLoader color={colors.mainDarkGray} size={20} betweenSpace={10}/>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.mainLightGray,
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dots: {
        width: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center'
    }
});