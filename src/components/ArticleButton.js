import React from "react";
import {Image, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback} from "react-native";

export default class ArticleButton extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    _render3dots = () => {
        if (this.props.show3Dots) {
            return (<TouchableWithoutFeedback onPress={this.props.onMore}>
                <View style={styles.shareButton}>
                    <Image style={styles.image} source={require('../assets/ic_3dots.png')}/>
                </View>
            </TouchableWithoutFeedback>)
        }
        return null;

    };

    render() {
        return (
            <View style={[this.props.style, styles.buttonView]}>
                <TouchableWithoutFeedback onPress={this.props.onBookmark}>
                    <View style={styles.saveButton}>
                        <Image style={styles.image}
                               source={this.props.bookmarked ? require('../assets/ic_saved.png') : require('../assets/ic_save.png')}/>
                    </View>
                </TouchableWithoutFeedback>
                {this._render3dots()}

            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonView: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    saveButton: {
        marginLeft: 'auto',
        padding: 10
    },
    shareButton: {
        marginRight: 0,
        marginLeft: 'auto',
        padding: 10
    },
    image: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    }
});
