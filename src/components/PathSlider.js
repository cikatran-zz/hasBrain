import React from "react";
import {Image, Text, View, StyleSheet, Animated, TouchableOpacity} from "react-native";
import {colors} from "../constants/colors";
import _ from 'lodash'

export default class PathSlider extends React.PureComponent {

    constructor(props) {
        super(props);
        this.width = 0;
        this.height = 0;
    }

    _onChoose = (index) =>{
        this.props.onChoose(index);
    };

    _renderPoint = () => {
        let points = [];
        for(let i = 0; i < this.props.numberOfPoints; i++) {
            points = points.concat([(<TouchableOpacity activeOpacity={0.9} onPress={()=>this._onChoose(i)} style={{paddingVertical:10}}><Image style={styles.pointImage} source={ i <=this.props.selected ? require('../assets/ic_active_point.png') : require('../assets/ic_inactive_point.png')}/></TouchableOpacity>)]);
        }
        return points;
    };

    render() {
        const {selected, numberOfPoints} = this.props;
        let propress = (selected * 100.0/(numberOfPoints-1)) + '%';
        return (
            <View style={[this.props.style, styles.rootView]} onLayout={(event) => {
                let {x, y, width, height} = event.nativeEvent.layout;
                this.width = width;
                this.height = height
            }}>
                <View style={styles.pathLine}>
                    <View style={[{width: propress}, styles.progressLine]}/>
                </View>
                <View style={styles.pointsView}>
                    {this._renderPoint()}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rootView: {
        justifyContent: 'center',
        flexDirection: 'column',
    },
    pathLine: {
        backgroundColor: colors.grayLine,
        width: '100%',
        height: 5
    },
    progressLine: {
        backgroundColor: colors.blueText,
        height: '100%'
    },
    pointsView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        position: 'absolute'
    },
    pointImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain'
    }
});
