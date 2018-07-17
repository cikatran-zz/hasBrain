import React, {PureComponent} from 'react'
import {
    View, StyleSheet, NativeModules, Platform, SectionList, TextInput
} from 'react-native'
import { colors } from '../../../constants/colors';
import RadarChart from '../../../components/RadarChart'
import PropTypes from 'prop-types';
import _ from 'lodash'
import HBText from "../../../components/HBText";

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
            <View pointerEvents={this.props.editMode ? 'auto' : 'none'}>
                <TextInput ref={component => this._summaryTextInput = component} multiline={true} underlineColorAndroid="transparent" numberOfLines={3} style={styles.descriptionText} defaultValue={description} editable={this.props.editMode}/>
            </View>
        )
    }

    _renderAnalyst = () => {
        const {user} = this.props;
        if (!user.userAnalystData)
            return (
                <View style={{alignItems:'center', width: '100%', height: 300, flexDirection:'row', justifyContent: 'center'}}>
                    <HBText style={{color: colors.grayText, fontSize: 15}}>Something went wrongs.Cannot analyse your profile!</HBText>
                </View>
            );
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
                    <HBText style={{fontSize: 15, color: colors.grayTextExpTitle, marginTop: 5, marginLeft: 3}}>
                        {data.title}
                    </HBText>
                    <HBText style={{fontSize: 10, color: colors.grayTextExpYear, marginVertical: 5, marginLeft: 5}}>
                        {data.level}
                    </HBText>
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
                <HBText style={styles.partHeader}>{section.title}</HBText>
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
                    refreshing={user.userAnalystFetching}
                    onRefresh={() => this.props.getUserAnalyst()}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
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
        fontFamily: 'CircularStd-Book'
    },
    partHeader: {
        fontSize: 20,
        color: colors.blackHeader,
        marginTop: 10,
    },
});
