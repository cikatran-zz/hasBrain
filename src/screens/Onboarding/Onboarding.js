import React from 'react'
import {
    Text, View, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, NativeModules
} from 'react-native'
import {colors} from "../../constants/colors";
import OnboardingPage from "./OnboardingPage/OnboardingPage";
import Swiper from 'react-native-swiper'
import {rootViewBottomPadding, rootViewTopPadding} from "../../utils/paddingUtils";
import _ from 'lodash'
import {postUserInterest} from '../../api'
import {strings} from "../../constants/strings";

export default class Onboarding extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            experience: [],
            isNextEnable: false,
            nextText: 'Next'
        };
        this.swiper = null;
        this.experience = [];
        this.intentIds = [];
        this.currentIndex = 0;
    }


    componentDidMount() {
        this.props.getOnboarding();
    }

    _onNextPage = () => {
        if (this.currentIndex === 1) {
            this.setState({nextText: 'Done'})
        }
        if (this.currentIndex !== 2) {
            this.swiper.scrollBy(1);
            this.setState({isNextEnable: false});
            this.currentIndex += 1;
        } else {
            // TODO: - Post to server + store to user kit + navigate to Home
            postUserInterest(this.experience, this.intentIds).then((value)=>{
                NativeModules.RNUserKit.storeProperty(strings.onboardingKey, {[strings.onboardedKey]: true}, (error, result)=>{});
                this.props.navigation.navigate('Home');
            }).catch((err)=>{
                console.log(err);
                this.props.navigation.navigate('Home');
            });
        }
    };

    _onChangePersona = (selectedPersona) => {
        const {onboarding} = this.props;
        let items = _.get(selectedPersona, '0', []);
        let data = [];
        let persona = onboarding.data.personaPagination.items;
        this.experience = [];
        for (let i = 0; i < persona.length; i++) {
            if (_.findIndex(items, (x)=> x === i) !== -1){
                data = data.concat({
                    data: [onboarding.data.levelPagination.items],
                    onChangeExperience: this._onChangePersona.bind(this),
                    multipleSelection: false,
                    title: persona[i].title
                });
                this.experience = this.experience.concat({personaId: persona[i]._id, levelId: null})
            }
        }
        this.setState({experience: data, isNextEnable: data.length !== 0});
    };

    _onChangeExperience = (selectedExperience) => {
        const {onboarding} = this.props;
        let levels = onboarding.data.levelPagination.items;
        Object.keys(selectedExperience).forEach((sectionIndex)=> {
            if (selectedExperience[sectionIndex].length > 0) {
                let section = this.experience[sectionIndex];
                section.levelId = levels[selectedExperience[sectionIndex][0]]._id;
                this.experience[sectionIndex] = section;
            }
        });
        if (_.findIndex(this.experience, x=>x.levelId == null) === -1) {
            this.setState({isNextEnable: true});
        }
    };

    _onChangeIntent = (selectedIntent) => {
        const {onboarding} = this.props;
        let items = _.get(selectedIntent, '0', []);
        let intents = onboarding.data.intentPagination.items;
        this.intentIds = [];
        for (let i = 0; i < intents.length; i++) {
            if (_.findIndex(items, (x)=> x === i) !== -1){
                this.intentIds = this.intentIds.concat(intents[i]._id);
            }
        }
        this.setState({isNextEnable: this.intentIds.length !== 0});
    };

    _renderNextButton = () => {
        if (this.state.isNextEnable) {
            return (<Text style={[styles.nextButtonText,{backgroundColor: colors.blueText}]}>{this.state.nextText}</Text>)
        } else {
            return (<Text style={[styles.nextButtonText,{backgroundColor: colors.grayLine}]}>{this.state.nextText}</Text>)
        }
    };

    render() {
        const {onboarding} = this.props;
        if (onboarding.isFetching || !onboarding.fetched || onboarding.data == null) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <ActivityIndicator size="large"/>
                </View>
            );
        }

        return (
            <View style={styles.rootView}>
                <View style={styles.swiperView}>
                    <Swiper horizontal={true}
                            ref={(swiper) => this.swiper = swiper}
                            showsPagination={false}
                            scrollEnabled={false}
                            loop={false}>
                        <OnboardingPage style={{paddingHorizontal: 20}}
                                        data={
                                            [
                                                {
                                                    data: [onboarding.data.personaPagination.items],
                                                    numColumns: 3,
                                                    multipleSelection: true
                                                }
                                            ]
                                        }
                                        pageTitle="I am a"
                                        subtitle='Select any expertise that applies to you'
                                        icon={require('../../assets/ic_onboarding_briefcase.png')}
                                        onChangedSelected={(selected)=>this._onChangePersona(selected)}/>
                        <OnboardingPage style={{paddingHorizontal: 20}}
                                        data={
                                            this.state.experience
                                        }
                                        pageTitle={'How many years have you been a'}
                                        subtitle={'Rate your expertise level'}
                                        icon={require('../../assets/ic_onboarding_award.png')}
                                        onChangedSelected={(selected)=>this._onChangeExperience(selected)}/>
                        <OnboardingPage style={{paddingHorizontal: 20}}
                                        data={
                                            [
                                                {
                                                    data: [onboarding.data.intentPagination.items],
                                                    numColumns: 3,
                                                    multipleSelection: true,
                                                }
                                            ]
                                        }
                                        pageTitle={'I want to'}
                                        subtitle={'Define your goal'}
                                        icon={require('../../assets/ic_onboarding_flag.png')}
                                        onChangedSelected={(selected)=>this._onChangeIntent(selected)}/>
                    </Swiper>
                </View>
                <TouchableOpacity style={styles.nextButton} onPress={this._onNextPage} disabled={!this.state.isNextEnable}>
                    {this._renderNextButton()}
                </TouchableOpacity>
            </View>

        )
    }

}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainWhite
    },
    swiperView: {
        flexDirection: 'column',
        top: 50,
        bottom: 100,
        left: 0,
        right: 0,
        position: 'absolute'
    },
    nextButton: {
        position: 'absolute',
        right: 20,
        bottom: rootViewBottomPadding() + 20
    },
    nextButtonText: {
        padding: 10,
        fontSize: 15,
        color: colors.mainWhite,
        borderRadius: 5,
        overflow: 'hidden'
    }
});
