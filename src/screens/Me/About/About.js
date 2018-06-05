import React, {PureComponent} from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, SectionList, TextInput
} from 'react-native'
import { colors } from '../../../constants/colors';
import RadarChart from '../../../components/RadarChart'
import PropTypes from 'prop-types';
import _ from 'lodash'

type Props = {
    editMode: PropTypes.bool
}


export default class About extends PureComponent<Props> {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }


    _getSummaryValue() {
        return this._summaryTextInput._lastNativeText;
    }

    _renderDescription = () => {
        const {user} = this.props;
        let description = null;
        if (user.userProfileData) {
            description = user.userProfileData.about
        };
        if (_.isEmpty(description)) {
            description = "Enter your summary here"
        }
        return (
            <TextInput ref={component => this._summaryTextInput = component} multiline={true} underlineColorAndroid="transparent" numberOfLines={3} style={styles.descriptionText} defaultValue={description} editable={this.props.editMode}/>
        )
    }

    _renderAnalyst = () => {
        const {user} = this.props;
        if (!user.userAnalystData)
            return (
                <View style={{alignItems:'center', width: '100%', height: 300, flexDirection:'row', justifyContent: 'center'}}>
                    <Text style={{color: colors.grayText, fontSize: 15}}>Something went wrongs.Cannot analyse your profile!</Text>
                </View>
            );
        console.log("ABOUT", user.userAnalystData);
        return (
            <View style={{flexDirection:'column', width:'100%'}}>
                <View style={{alignItems:'center', width: '100%', flexDirection:'row', marginTop:-20, marginBottom: -20}}>
                    <RadarChart
                        size={300}
                        firstValue={{name: user.userAnalystData[0].name, color: '#F56C2E', percentage: user.userAnalystData[0].percentage}}
                        secondValue={{name: user.userAnalystData[1].name, color: '#FAB84A', percentage: user.userAnalystData[1].percentage}}
                        thirdValue={{name: user.userAnalystData[2].name, color: '#50DE72', percentage: user.userAnalystData[2].percentage}}
                        fourthValue={{name: user.userAnalystData[3].name, color: '#41E9F8', percentage: user.userAnalystData[3].percentage}}
                        fifthValue={{name: user.userAnalystData[4].name, color: '#B45D95', percentage: user.userAnalystData[4].percentage}}
                        sixthValue={{name: user.userAnalystData[5].name, color: '#F43651', percentage: user.userAnalystData[5].percentage}}/>
                </View>
            </View>
        )
    }

    _renderExperience = ({item}) => {
        if (item == null || item[0] == null) {
            return null;
        }
        let renderExperience = item.map((data, i) => {
            return (
                <View key={i} style={{flexDirection:'column'}}>
                    <Text style={{fontSize: 15, color: colors.grayTextExpTitle, marginTop: 5, marginLeft: 3}}>
                        {data.title}
                    </Text>
                    <Text style={{fontSize: 10, color: colors.grayTextExpYear, marginVertical: 5, marginLeft: 5}}>
                        {data.level}
                    </Text>
                </View>
            )
        });
        return (
            <View style={{flexDirection: 'column', marginTop: 10}}>
                {renderExperience}
            </View>
        );

    }

    _keyExtractor = (item, index) => index.toString();

    _renderSectionHeader = ({section}) => {
        if (section.showHeader && section.data != null && section.data[0] != null) {
            return (
                <Text style={styles.partHeader}>{section.title}</Text>
            )
        } else {
            return null
        }
    };

    render() {
        const {user} = this.props;
        let experienceArray = [];
        if (user.userProfileData) {
            experienceArray = user.userProfileData.experience
        };

        return (
            <View style={styles.container}>
                <SectionList
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    renderSectionHeader={this._renderSectionHeader}
                    sections={[
                        {
                            data: ['Description'],
                            renderItem: this._renderDescription,
                            showHeader: false
                        },
                        {
                            data: ['Analyst'],
                            renderItem: this._renderAnalyst,
                            showHeader: true,
                            title: "Time Spent"
                        },
                        {
                            data: [experienceArray],
                            renderItem: this._renderExperience,
                            showHeader: true,
                            title: "Experience"
                        },
                    ]}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainWhite,
        alignItems:'center',
        width:'85%'
    },
    descriptionText: {
        fontSize: 13,
        color: colors.blackHeader,
    },
    partHeader: {
        fontSize: 25,
        color: colors.blackHeader,
        marginTop: 10,
    },
});

const tempExperienceData = [{title: 'Android Developer', exp: '5 years'}, {title: 'React Native Developer', exp: '2 years'}];
