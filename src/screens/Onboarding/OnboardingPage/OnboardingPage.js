import React from "react";
import {Image, Text, View, StyleSheet, SectionList, FlatList, Dimensions, TouchableOpacity} from "react-native";
import {colors} from "../../../constants/colors";
import _ from 'lodash'
import {
    onboardingItemStyle, onboardingSectionTitleStyle, onboardingSubtitleStyle,
    onboardingTitleStyle
} from "../../../constants/theme";
import OnboardingSectionList from "./OnboardingSectionList";
import OnboardingSectionTags from "./OnboardingSectionTags";
import PathSlider from "../../../components/PathSlider";
import OnboardingPageIntent from "./OnboardingPageIntent";

export default class OnboardingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selected: {},
            itemStyle: {},
            itemTextStyle: {}
        };
    }

    _keyExtractor = (item, index) => index + '';

    _renderSectionHeader = ({section}) =>
        (<View style={styles.header}>
            {section.title != null && <Text style={[onboardingSectionTitleStyle]}>{section.title}</Text>}
            {section.subtitle != null &&
            <Text style={[onboardingSubtitleStyle, {marginBottom: 10}]}>{section.subtitle}</Text>}
        </View>);

    _onItemSelectedChanged = (sectionIndex, itemIndexes) => {
        const {onChangedSelected} = this.props;
        let result = {};
        result[sectionIndex] = itemIndexes;
        onChangedSelected(result);
    };

    _renderSection = ({item,index, section: {numColumns, multipleSelection, searchable, sectionIndex}}) => {
        if (multipleSelection) {
            return (<OnboardingSectionTags data={item}
                                           onSelectedChanged={(selected) => this._onItemSelectedChanged(sectionIndex, selected)}/>)
        } else {
            if (searchable) {
                return (<OnboardingPageIntent data={item} onSelectedChanged={(selected) => this._onItemSelectedChanged(sectionIndex, selected)}/>)
            }
            return (<OnboardingSectionList style={this.props.style}
                                           data={item}
                                           numColumns={numColumns}
                                           onSelectedChanged={(selected) => this._onItemSelectedChanged(sectionIndex, selected)}/>);
        }
    };

    render() {
        const {data} = this.props;
        let sections = [];
        data.forEach((item, index) => {
            sections = sections.concat({...item, renderItem: this._renderSection, sectionIndex: index});
        });
        return (
            <View style={[this.props.style, styles.alertWindow]}>
                <View style={styles.headerView}>
                    <View style={styles.iconView}>
                        <Image source={this.props.icon} style={styles.iconImage}/>
                    </View>
                    <View style={styles.textView}>
                        <Text style={styles.titleText}>{this.props.pageTitle}</Text>
                        <Text style={onboardingSubtitleStyle}>{this.props.subtitle}</Text>
                    </View>
                </View>
                <View style={styles.lineView}/>
                <SectionList keyExtractor={this._keyExtractor}
                             stickySectionHeadersEnabled={false}
                             showsVerticalScrollIndicator={false}
                             bounces={false}
                             renderSectionHeader={this._renderSectionHeader}
                             sections={sections}/>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    alertWindow: {
        backgroundColor: 'transparent',
        flex: 1,
        flexDirection: 'column'
    },
    headerView: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    lineView: {
        height: 2,
        backgroundColor: colors.grayLine,
        width: '100%',
        marginBottom: 25
    },
    iconView: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconImage: {
        resizeMode: 'contain',
        aspectRatio: 1
    },
    textView: {
        flex: 4,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    titleText: {
        ...onboardingTitleStyle,
        marginBottom: 5
    },
    header: {
        flexDirection: 'column',
        marginBottom: 15,
        marginTop: 28
    },
});