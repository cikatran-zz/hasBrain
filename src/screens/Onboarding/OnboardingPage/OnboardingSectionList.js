import React from 'react'
import {
    Text, View, FlatList, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native'
import {colors} from "../../../constants/colors";
import {onboardingItemStyle} from "../../../constants/theme";
import _ from 'lodash'
import OnboardingSectionListItem from "./OnboardingSectionListItem";

export default class OnboardingSectionList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: -1
        };
    }

    _onChangeSelected = (index) => {
        if (this.state.selected !== index) {
            // Not selected
            this.setState({selected: index});
            this.props.onSelectedChanged([index]);
        }
    };

    _itemStyle = (numColumns) => {
        let width = 75;

        if (numColumns != null) {
            let contentWidth = Dimensions.get("window").width - _.get(this.props.style, 'paddingHorizontal', 0) * 2;
            let spaceSize = numColumns * 20;
            width = (contentWidth - spaceSize) / numColumns;
        }
        return {
            width: width,
            margin: 10,
            aspectRatio: 1,
            borderRadius: width / 2,
            borderWidth: 1,
            overflow: 'hidden'
        }
    };

    _renderItem = (item, index, numColumns) => {
        return(<OnboardingSectionListItem selected={this.state.selected === index}
                                   style={this._itemStyle(numColumns)}
                                   title={item.title}
                                   onChangedSelected={() => this._onChangeSelected(index)}/>)};


    render() {
        const {numColumns, data} = this.props;
        if (numColumns == null) {
            // Horizontal list
            return (<FlatList data={data}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              keyExtractor={this._keyExtractor}
                              extraData={this.state}
                              renderItem={({item, index}) => this._renderItem(item, index, numColumns)}/>)
        } else {
            // Vertical list
            return (<FlatList data={data}
                              numColumns={numColumns}
                              horizontal={false}
                              showsVerticalScrollIndicator={false}
                              keyExtractor={this._keyExtractor}
                              extraData={this.state}
                              renderItem={({item, index}) => this._renderItem(item, index, numColumns)}/>)
        }
    }

}

const styles = StyleSheet.create({
    item: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemText: {
        ...onboardingItemStyle,
        color: colors.blackText
    },
    itemHighlightedText: {
        ...onboardingItemStyle,
        color: colors.mainWhite
    }
});
