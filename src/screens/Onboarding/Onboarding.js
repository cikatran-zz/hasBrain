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
        //this.props.getAllIntentions();
    }

    _onNextPage = () => {
        if (this.currentIndex === 0) {
            let personaIds = this.experience.map((ex)=>ex.personaId);
            this.props.updateRecommendSource(personaIds);
        }
        if (this.currentIndex === 1) {
            this.setState({nextText: 'Done'})
        }
        if (this.currentIndex !== 2) {
            this.swiper.scrollBy(1);
            this.setState({isNextEnable: true});
            this.currentIndex += 1;
        }  else {
            console.log("Post user interest", this.experience, this.intentIds);
            postUserInterest(this.experience, this.intentIds).then((value)=>{
                const {onboarding} = this.props;
                let levels = onboarding.data.levelMany;
                let personas = onboarding.data.personaMany;
                let ukExperience = [];
                this.experience.forEach((item)=> {
                    let level = levels.find(function(element) {
                        return element._id === item.levelId;
                    });
                    let persona = personas.find(function(element) {
                        return element._id === item.personaId;
                    });
                    ukExperience = ukExperience.concat({title: persona.title, level: level.title});
                });
                NativeModules.RNUserKit.storeProperty({[strings.mekey+ "."+strings.experienceKey]: ukExperience}, (error, result)=>{});
                this.props.navigation.navigate('Home');
            }).catch((err)=>{
                console.log("ERR",err);
                this.props.navigation.navigate('Home');
            });
        }
    };

    _onChangePersona = (selectedPersona) => {
        const {onboarding} = this.props;
        let items = _.get(selectedPersona, '0', []);
        let data = [];
        let persona = onboarding.data.personaMany;
        let defaultExp = onboarding.data.levelMany[0]._id;
        this.experience = [];
        for (let i = 0; i < persona.length; i++) {
            if (_.findIndex(items, (x)=> x === i) !== -1){
                data = data.concat({
                    data: [onboarding.data.levelMany],
                    onChangeExperience: this._onChangePersona.bind(this),
                    multipleSelection: false,
                    title: persona[i].title
                });
                this.experience = this.experience.concat({personaId: persona[i]._id, levelId: defaultExp})
            }
        }
        this.setState({experience: data, isNextEnable: data.length !== 0});
    };

    _onChangeExperience = (selectedExperience) => {
        const {onboarding} = this.props;
        let levels = onboarding.data.levelMany;
        Object.keys(selectedExperience).forEach((sectionIndex)=> {
            if (selectedExperience[sectionIndex].length > 0) {
                let section = this.experience[sectionIndex];
                section.levelId = levels[selectedExperience[sectionIndex][0]]._id;
                this.experience[sectionIndex] = section;
            }
        });
        this.props.getIntentions(this.experience)
    };

    _onChangeIntent = (selectedIntents) => {
        this.intentIds = selectedIntents[0].map((x)=>x._id);
        console.log('Update intents', this.intentIds);
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
        const {onboarding, intentions} = this.props;
        if (onboarding.isFetching || !onboarding.fetched || onboarding.data == null) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                    <ActivityIndicator size="large"/>
                </View>
            );
        }

        return (
            <View style={styles.alertWindow}>
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
                                                    data: [onboarding.data.personaMany],
                                                    numColumns: 3,
                                                    multipleSelection: true
                                                }
                                            ]
                                        }
                                        pageTitle="I am a"
                                        subtitle='Tell us who you are/who you want to be (select all that applies)'
                                        icon={require('../../assets/ic_onboarding_briefcase.png')}
                                        onChangedSelected={(selected)=>this._onChangePersona(selected)}/>
                        <OnboardingPage style={{paddingHorizontal: 20}}
                                        data={
                                            this.state.experience
                                        }
                                        pageTitle={'How much experience do you have as a ___?'}
                                        subtitle={'Rate your expertise level'}
                                        icon={require('../../assets/ic_onboarding_award.png')}
                                        onChangedSelected={(selected)=>this._onChangeExperience(selected)}/>
                        <OnboardingPage style={{paddingHorizontal: 20}}
                                        data={
                                            [
                                                {
                                                    data: [intentions.data ? (intentions.data.all ? intentions.data.all : []) : []],
                                                    searchable: true,
                                                    multipleSelection: false,
                                                    selectedData: [intentions.data ? (intentions.data.selected ? intentions.data.selected : []) : []]
                                                }
                                            ]
                                        }
                                        pageTitle={'I want to'}
                                        subtitle={'Define your goal which can be an expertise, a level or a milestone'}
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
    alertWindow: {
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
