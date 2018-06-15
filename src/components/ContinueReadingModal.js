import React from "react";
import {
    StyleSheet,
    View,
    Modal,
    Animated,
    Image,
    Dimensions,
    Easing,
    TouchableOpacity,
    Text,
    Platform
} from "react-native";
import {colors} from "../constants/colors";

export default class ContinueReadingModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            message: "You have read this article before, do you want to continue reading at last position?"
        };
    }

    render() {
        return (
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.state.isShow}
                   presentationStyle="overFullScreen"
                   onRequestClose={() => {
                       this.setState({isShow: false});
                   }}>
                <View style={styles.rootView}>
                    <View style={styles.backgroundView}/>
                    <View style={styles.alertWindow}>
                        <Text style={styles.message}>
                            {this.state.message}
                        </Text>
                        <View style={styles.buttons}>
                            <TouchableOpacity style={styles.button} onPress={this.props.onYes}>
                                <Text style={{color: colors.blueText}}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={this.props.onNo}>
                                <Text style={{color: colors.redButton}}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundView: {
        position: 'absolute',
        backgroundColor: '#000000',
        opacity: 0.3,
        width: '100%',
        height: '100%',
        top: 0,
        left: 0
    },
    alertWindow: {
        width: '70%',
        flexDirection: 'column',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.grayLine,
        backgroundColor: colors.mainWhite
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop:10,
        marginBottom: 20
    },
    button: {
        paddingHorizontal: 40
    },
    message: {
        color: colors.blackText,
        marginHorizontal: 40,
        marginTop: 20,
        textAlign: 'center',
        fontSize: 15
    }
});