import React from "react";
import {Image, View, StyleSheet, SectionList, FlatList, Dimensions, TouchableOpacity} from "react-native";
import {colors} from "../../../constants/colors";
import _ from 'lodash'
import {
    onboardingItemStyle, onboardingSectionTitleStyle, onboardingSubtitleStyle,
    onboardingTitleStyle
} from "../../../constants/theme";
import OnboardingSectionList from "./OnboardingSectionList";
import OnboardingSectionTags from "./OnboardingSectionTags";
import HBText from "../../../components/HBText";
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
            {section.title != null && <HBText style={[onboardingSectionTitleStyle]}>{section.title}</HBText>}
            {section.subtitle != null &&
            <HBText style={[onboardingSubtitleStyle, {marginBottom: 10}]}>{section.subtitle}</HBText>}
        </View>);

    _onItemSelectedChanged = (sectionIndex, itemIndexes) => {
        const {onChangedSelected} = this.props;
        let result = {};
        result[sectionIndex] = itemIndexes;
        onChangedSelected(result);
    };

    _renderSection = ({item,index, section: {numColumns, multipleSelection, searchable, sectionIndex, selectedData}}) => {
        if (multipleSelection) {
            return (<OnboardingSectionTags data={item}
                                           onSelectedChanged={(selected) => this._onItemSelectedChanged(sectionIndex, selected)}/>)
        } else {
            if (searchable) {
                return (<OnboardingPageIntent data={item} selected={selectedData} onSelectedChanged={(selected) => this._onItemSelectedChanged(sectionIndex, selected)}/>)
            }
            return (<OnboardingSectionList style={this.props.style}
                                           data={item}
                                           numColumns={numColumns}
                                           onSelectedChanged={(selected) => this._onItemSelectedChanged(sectionIndex, selected)}/>);
        }
    };

    _renderContent = (bigData, renderAsSection) => {
        if (bigData == null || bigData === undefined || bigData.length === 0)
            return null;
        if (renderAsSection === undefined) {
            // TAGS AND INTENTS
            const { data, numColumns, multipleSelection, searchable, selectedData } = bigData[0];
            if (multipleSelection) {
                return (<OnboardingSectionTags data={data[0]}
                                               onSelectedChanged={(selected) => this._onItemSelectedChanged(0, selected)}/>)
            }
            else {
                return (<OnboardingPageIntent data={data[0]} selected={selectedData} onSelectedChanged={(selected) => this._onItemSelectedChanged(0, selected)}/>)
            }
        }
        else {
            // EXPERIENCE
            let sections = [];
            bigData.forEach((item, index) => {
                sections = sections.concat({...item, renderItem: this._renderSection, sectionIndex: index});
            });
            return (
                <SectionList keyExtractor={this._keyExtractor}
                             stickySectionHeadersEnabled={false}
                             showsVerticalScrollIndicator={false}
                             bounces={false}
                             renderSectionHeader={this._renderSectionHeader}
                             sections={sections}/>
            );
        }
    }

    render() {
        const {data, renderAsSection} = this.props;
        
        return (
            <View style={[this.props.style, styles.alertWindow]}>
                <View style={styles.headerView}>
                    <View style={styles.iconView}>
                        <Image source={this.props.icon} style={styles.iconImage}/>
                    </View>
                    <View style={styles.textView}>
                        <HBText style={styles.titleText}>{this.props.pageTitle}</HBText>
                        <HBText style={onboardingSubtitleStyle}>{this.props.subtitle}</HBText>
                    </View>
                </View>
                <View style={styles.lineView}/>
                {this._renderContent(data, renderAsSection)}
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