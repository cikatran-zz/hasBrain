import React from 'react'
import {
    StyleSheet
} from 'react-native'
import {colors} from "../../../constants/colors";
import {onboardingItemStyle} from "../../../constants/theme";
import _ from 'lodash'
import {TagSelect} from 'react-native-tag-select';


export default class OnboardingSectionTags extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: []
        };
        this.tag = null
    }

    _onChangeSelected = () => {
        console.log(this.tag.itemsSelected);
        this.props.onSelectedChanged(this.tag.itemsSelected.map(x=>x.id-1));
    };


    render() {
        const {data} = this.props;
        let tagData = [];
        data.forEach((item, index) => {
            tagData = tagData.concat({id: index+1, label: item.title})
        });

        return (<TagSelect data={tagData}
                           ref={(ref)=> this.tag = ref}
                           itemStyle={styles.item}
                           itemLabelStyle={styles.label}
                           itemStyleSelected={styles.itemSelected}
                           onItemPress={this._onChangeSelected}
                           itemLabelStyleSelected={styles.labelSelected}
        />)
    }

}

const styles = StyleSheet.create({
    item: {
        borderColor: colors.grayOnboarding,
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderRadius: 20
    },
    label: {
        ...onboardingItemStyle,
        color: colors.blackOnboarding
    },
    itemSelected: {
        borderColor: colors.blueText,
        borderWidth: 1,
        backgroundColor: 'transparent',
        borderRadius: 20
    },
    labelSelected: {
        ...onboardingItemStyle,
        color: colors.blueText
    }
});
