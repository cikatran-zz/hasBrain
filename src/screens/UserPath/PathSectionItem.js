import React from "react";
import {Image, TouchableWithoutFeedback, View, StyleSheet, Animated, FlatList} from "react-native";
import {colors} from "../../constants/colors";
import HBText from '../../components/HBText'
import NavigationService from '../../NavigationService'

const maxHeight = 230;
export default class PathSectionItem extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            minHeight: 0,
            maxHeight: 0,
        }
        this._animated = new Animated.Value(props.index == 0 ? maxHeight : 0 );
    }



    _renderSeriesItem = ({item}) => {
        return (
            <TouchableWithoutFeedback onPress={() => this._openReadingView(item)}>
                <View style={styles.seriesContainer}>
                    <View style={{height: 120, width: 260}}>
                        <View style={styles.placeHolder}>
                            <HBText style={styles.textPlaceHolder}>hasBrain</HBText>
                        </View>
                        <Image style={styles.seriesItemImage} source={{uri: item.sourceImage ? item.sourceImage : "", height: 120, width: 260}}/>
                    </View>
                    <HBText numberOfLines={2} ellipsizeMode="tail" style={styles.seriesItemText}>{item.title ? item.title : ""}</HBText>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _keyExtractor = (item, index) => index.toString();

    _openReadingView = (item) => {
        NavigationService.navigate("Reader", {...item, bookmarked: false});

    };

    _renderEmptyList = () => {
        return <HBText style={{color: colors.pathVerticalLine, fontSize: 12}}>There are no series</HBText>

    };

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _toggle(expanded) {
        let initialValue = expanded ? maxHeight : 0;
        let finalValue = expanded ? 0 : maxHeight;
        this._animated.setValue(initialValue);
        if (expanded) {
            Animated.timing(
                this._animated,
                {
                    toValue: finalValue,
                }
            ).start();
        } else {
            Animated.spring(
                this._animated,
                {
                    toValue: finalValue,
                    fiction: 1
                }
            ).start();
        }

    }

    render() {

        return (
            <Animated.View style={[styles.sectionContainer, {height: this._animated}]}>
                <View style={styles.verticalLine}/>
                <FlatList
                    style={{marginVertical: 15}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={this.props.data}
                    ListEmptyComponent={() => this._renderEmptyList()}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderSeriesItem}/>
            </Animated.View>
        )
    }
}

const styles = StyleSheet.create({
    sectionContainer: {
        flexDirection: 'row',
        height: 260,
    },
    verticalLine: {
        backgroundColor: colors.pathVerticalLine,
        marginLeft: 34.5,
        marginRight: 18,
        width: 1,
        height:'100%',
    },
    seriesContainer: {
        flexDirection: 'column',
        width: 260,
        height: 190,
        marginRight: 10,
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
        shadowColor: colors.grayText,
        shadowOffset: {width:5, height: 5},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        marginBottom: 20,
        elevation: 1,
        overflow: 'hidden'
    },
    placeHolder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120,
        zIndex: -1,
        borderWidth: 0.5,
        borderColor: colors.grayText,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textPlaceHolder: {
        color: colors.grayText
    },
    seriesItemImage: {
        width: 260,
        height: 120
    },
    seriesItemText: {
        color: colors.darkBlue,
        fontSize: 16,
        marginVertical: 20,
        marginHorizontal: 10,
    },
});
