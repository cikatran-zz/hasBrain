import React from 'react'
import {
    View, FlatList, StyleSheet, TouchableOpacity, Dimensions, Modal, Image, TouchableWithoutFeedback, TextInput, ScrollView, Text
} from 'react-native'
import {colors} from "../../../constants/colors";
import {onboardingItemStyle} from "../../../constants/theme";
import _ from 'lodash'
import {TagSelect} from 'react-native-tag-select';
import Autocomplete from "react-native-autocomplete-input";
import {rootViewTopPadding} from "../../../utils/paddingUtils";
import {postCreateIntent} from "../../../api";
import HBText from "../../../components/HBText";
import CheckComponent from "../../../components/CheckComponent";

export default class OnboardingPageIntent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            selectedIntentions: [],
            isSearching: false,
            showIntentionModal: false,
            modalItem: null
        }
        this.chosen = false
    }

    _getFilterData = () => {
        const {data} = this.props;

        let intents = [];
        data.forEach((intent) => {
            if (intent.intentType === "non_type") {
                intent.children.forEach((childIntent) => {
                    intents = intents.concat({_id: childIntent._id, group: false, displayName: childIntent.displayName})
                });
            } else {
                intent.children.forEach((childIntent) => {
                    intents = intents.concat({
                        _id: childIntent._id,
                        group: true,
                        displayName: intent.intentType + " " + childIntent.displayName
                    })
                });
            }
        });
        return intents;
    };

    _findIntent = (query) => {
        if (query === '') {
            return [];
        }

        const {data} = this.props;
        const regex = new RegExp(`${query.trim()}`, 'i');
        let results = this._getFilterData().filter(intent => intent.displayName.search(regex) >= 0);
        if (results.length === 0 && query.trim() !== '') {
            results = [{_id: "_create_new", group: false, displayName: query}]
        }
        return results;
    };

    _renderTags = () => {
        return this.state.selectedIntentions.map((item, index) =>
            <TouchableOpacity
                onPress={() => this._onClickedTag(item._id)}>
                <View style={styles.tagView}>
                    <Image source={require('../../../assets/ic_cancel.png')} />
                    <HBText
                        style={styles.tagText}>{item.displayName}
                    </HBText>
                </View>
            </TouchableOpacity>
        )
    };

    _onClickedTag = (id) => {
        let {selectedIntentions} = this.state;
        console.log("Selected intents",selectedIntentions);
        let newIntentions = selectedIntentions.filter((intent) => intent._id !== id);
        console.log("New intents", newIntentions);
        this.setState({selectedIntentions: newIntentions});
        this.props.onSelectedChanged(newIntentions);
        this.chosen = true
    };

    _onChooseIntent = (item) => {
        let intents = _.cloneDeep(this.state.selectedIntentions);
        let parsedItem = {
            _id: item._id,
            group: item.group,
            displayName: item.intentType + " " + item.displayName
        }
        if (intents.filter(x => x._id === parsedItem._id).length === 0)
            intents = intents.concat([parsedItem]);
        else {
            // Remove 
            intents = intents.filter(x => x._id !== parsedItem._id);
        }
        this.setState({
            selectedIntentions: intents
        })
        this.props.onSelectedChanged(intents);
    };

    componentWillReceiveProps(nextProps) {
        let {selected} = nextProps;
        const {selectedIntentions} = this.state;
        //====Temporary fix same intent type disappeared=====
        if (!_.isEmpty(selectedIntentions) && _.isEqual(selected, this.props.selected))
            return;
        //====================================================
        if (selected == null) {
            return;
        }
        let intents = [];
        selected[0].forEach((intent) => {
            if (intent.intentType === "non_type") {
                intent.children.forEach((childIntent) => {
                    intents = intents.concat({_id: childIntent._id, group: false, displayName: childIntent.displayName})
                });
            } else {
                intent.children.forEach((childIntent) => {
                    intents = intents.concat({
                        _id: childIntent._id,
                        group: true,
                        displayName: intent.intentType + " " + childIntent.displayName
                    })
                });
            }
        });
        console.log("Update with new intents -1", selected, this.state.selectedIntentions);
        if (!_.isEqual(intents, this.state.selectedIntentions)) {
            console.log("Update with new intents", intents, this.state.selectedIntentions);
            this.setState({selectedIntentions: intents});
            this.props.onSelectedChanged(intents);
        }
    }
    showIntentionModal(visible, item) {
        if (item === undefined)
            this.setState({showIntentionModal: visible});
        else {
            this.setState({
                showIntentionModal: visible,
                modalItem: item
            })
        }
    }

    _keyExtractor = (item, index) => index.toString();

    _onIntentionItemPress = (_id, group, displayName, intentType) => {
        this._onChooseIntent({
            _id: _id,
            group: group,
            displayName: displayName,
            intentType: intentType
        })
    }

    // _renderSearchItem = ({item}) => {
    //     const {_id, group, displayName} = item;
    //     return (
    //         <TouchableOpacity style={styles.autocompleteButton}
    //                           onPress={() => this._onSearchItemPress(_id, group, displayName)}>
    //             <HBText style={[styles.autocompleteText, group ? {fontWeight: 'bold'} : {}]}>
    //                 {_id === "_create_new" ? "New intent \"" + displayName + "\"" : displayName}
    //             </HBText>
    //         </TouchableOpacity>
    //     )
    // }

    _renderIntentionItem = ({item}) => {
        const { intentType } = item;

        if (intentType === 'non_type') 
            return this._renderNonTypeIntention(item);
        else 
            return this._renderTypeIntention(item);

    }

    _renderNonTypeIntention = (item) => {
        const { displayName } = item;
        
        return (
            <TouchableWithoutFeedback 
                onPress={() => this._onChooseIntent(item)}>
                <View style={[styles.dropdownContainer, this._getItemBorder(this._isIntentSelected(item))]}>
                    <Text style={[styles.intentText, this._getItemTextColor(this._isIntentSelected(item))]}>{displayName}</Text>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderTypeIntention = (item) => {
        const { intentType } = item;
        const { selectedIntentions } = this.state;
        
        let selectedBelongToIntentions = selectedIntentions.length > 0 ? selectedIntentions.filter((x, index)  => x.displayName.includes(item.intentType)) : [];
        console.log('_renderTypeIntention', selectedIntentions, selectedBelongToIntentions);
        
        let titleText = intentType;
        selectedBelongToIntentions.filter(x => {
            console.log(x, intentType);
            if (titleText === intentType)
                titleText = titleText + ' ' + x.displayName.replace(intentType + ' ', '');
            else titleText = titleText + ',' + x.displayName.replace(intentType + ' ', '');
        })

        let arrowImage = selectedBelongToIntentions.length > 0 ? require('../../../assets/ic_arrow_down_blue.png') : require('../../../assets/ic_arrow_down_black.png')

        return (
            <TouchableWithoutFeedback onPress={() => this.showIntentionModal(item.children.length !== 0, item)}>
            <View style={[styles.dropdownContainer, this._getItemBorder(selectedBelongToIntentions.length > 0)]}>
                <Text 
                    style={[styles.intentText, this._getItemTextColor(selectedBelongToIntentions.length > 0)]}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}>
                    {titleText}
                </Text>
                {/* <TouchableOpacity onPress={() => this.showIntentionModal(item.children.length !== 0, item)}> */}
                    <Image 
                        source={arrowImage}
                        style={styles.arrowDownBlack}/>
                {/* </TouchableOpacity> */}
            </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderIntentionModalItem = ({item}) => {
        if (item == null || item === undefined) 
            return null;
        return (
            <TouchableWithoutFeedback onPress={() => this._onIntentionItemPress(item._id, item.intentType !== 'non_type', item.displayName, item.intentType)}>
                <View style={styles.listRow}>
                    <Image resizeMode='contain' sytle={styles.iconImage} source={{uri: this._getJobImage(item.displayName), width: 60, height: 60}}/>
                    <HBText style={styles.sourceText}>{item.displayName}</HBText>
                    <CheckComponent checkedItem={this._isIntentSelected(item)}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    _renderIntentionModal = (item) => {
        if (item == null || item === undefined)
            return null;
        return (
            <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showIntentionModal}>
                    <View style={styles.searchModalContainer}>
                        <View style={{width: '100%', height: 95, backgroundColor: colors.mainWhite, justifyContent: 'center'}}>
                            <Text style={styles.modalTitle}>{item.intentType}...</Text>
                            <TouchableOpacity style={styles.modalBackButton} 
                                onPress={() => this.showIntentionModal(false)}>
                                <Image style={{width: 15, height: 9}} source={require('../../../assets/ic_arrow_down.png')}/>
                            </TouchableOpacity>
                        </View>
                        <FlatList 
                            keyExtractor={this._keyExtractor}
                            style={styles.modalList}
                            listKey={item.intentType}
                            showsVerticalScrollIndicator={false}
                            horizontal={false}
                            data={item.children}
                            extraData={this.state.selectedIntentions}
                            renderItem={this._renderIntentionModalItem}/>
                    </View>
            </Modal>
        )
    }

    _isIntentSelected = (item) => {
        const { selectedIntentions } = this.state;

        if (selectedIntentions.length > 0 && (selectedIntentions.filter(x => x._id === item._id).length > 0))
            return true
        else return false
    }

    _getItemTextColor = (isSelected) => {
        if (isSelected) {
            return {
                color: colors.blueText
            }
        }
        else return {
            color: colors.blackOnboarding
        }
    }

    _getItemBorder = (isSelected) => {
        if (isSelected)
            return {
                borderColor: colors.blueText,
            }
        else {
            return {
                borderColor: colors.intentBorder,
            }
        }
    }

    render() {
        const {data} = this.props;
        const { modalItem, selectedIntentions } = this.state;

        let nonTypeIntentions = []
        data
            .filter(x => x.intentType === 'non_type')
            .map(x => {
                x.children.map(x => {
                    nonTypeIntentions = nonTypeIntentions.concat(x);
                })
            })
        let sortedIntentions = data.filter(x => x.intentType !== 'non_type' && x.intentType !== undefined).concat(nonTypeIntentions);

        return (
            <View style={styles.rootView}>
                {this._renderIntentionModal(modalItem)}
                <FlatList
                    style={styles.intentionList}
                    horizontal={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this._keyExtractor}
                    data={sortedIntentions}
                    extraData={selectedIntentions}
                    renderItem={this._renderIntentionItem}/>
            </View>
        );
    }

    _getJobImage = (displayName) => {
        switch(displayName) {
            case 'Android development':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FAndroid%20Developer.png?alt=media&token=aba2f5f3-0cef-4f8d-96d2-fcccd7531448';
            case 'Back-end development':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FBackEnd%20Engineer.png?alt=media&token=f8bc34dd-4749-4e1d-a2db-5985f8272d4a';
            case 'Data engineering':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FData%20Engineer.png?alt=media&token=024f5f08-35b6-42b0-b40c-ebc69f46993b';
            case 'Data science':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FData%20Scientist.png?alt=media&token=cdc1b2f3-9d05-429c-ae29-05065504eac6';
            case 'Design skills':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FDesigner.png?alt=media&token=705dd003-4915-4b07-8e55-409265a8d68b';
            case 'iOS development':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FiOS%20Developer.png?alt=media&token=2ff76d36-1bff-4729-a730-085671a27621';
            case 'Machine Learning engineering':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FMachine%20Learning.png?alt=media&token=4418cf55-7dc4-448b-a1b8-faf43644bad3';
            case 'Product management':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FProduct%20Manager.png?alt=media&token=139c6e3e-3c0d-42e5-b61b-c490d75e1069';
            case 'React Native development':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FReact%20Native%20Developer.png?alt=media&token=587f548f-5a0f-4ead-a9e6-1f3c1e21617e';
            case 'Web development':
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FWeb%20Developer.png?alt=media&token=ebd5decc-0f42-4fa8-b270-e1ce7d34362d';
            default: 
                return 'https://firebasestorage.googleapis.com/v0/b/appkit-3a1ef.appspot.com/o/HasBrain%2FSources%20Images%2Fjobs%2FExploring.png?alt=media&token=f10c886b-701c-44a3-a112-bc35aa5b7ee0';
        }
    }

}

const styles = StyleSheet.create({
    rootView: {
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        height: Dimensions.get('window').height/2
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.grayLine,
        justifyContent: 'center',
        width: '100%',
        height: 30,
    },

    separatorLine: {
        width: '90%',
        alignSelf: 'center',
        backgroundColor: colors.grayLine,
        height: 1
    },
    tagsView: {
        flexDirection: 'row',
        width: '100%',
        flexWrap: 'wrap',
        marginTop: 50
    },
    tagView: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 8,
        borderColor: colors.blueText,
        marginRight: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    tagText: {
        fontSize: 15,
        color: colors.blueText,
        marginLeft: 5

    },
    backIcon: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    searchText: {
        marginLeft: 5,
        fontSize: 15,
        color: colors.grayTextSearch
    },
    searchModalContainer: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: colors.lightGray
    },
    searchModalBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        width: '100%'
    },
    autocompleteText: {
        fontSize: 15,
        color: colors.blackText,
        paddingHorizontal: 10
    },
    autocompleteButton: {
        paddingVertical: 15
    },
    dropdownContainer: {
        width: '100%',
        height: 43,
        marginBottom: 16,
        borderRadius: 3,
        borderWidth: 1.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    intentText: {
        fontWeight: '400',
        marginLeft: 14,
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'left',
        flex: 7
    },
    arrowDownBlack: {
        marginRight: 10,
        flex: 1,
        resizeMode: 'contain'
    },
    modalTitle: {
        color: colors.darkBlue,
        fontSize: 18,
        lineHeight: 21,
        marginTop: 53,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'CircularStd-Book',
    },
    modalItemContainer: {
        height: 20,
        width: '100%',
        marginBottom: 27,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalItemText: {
        color: colors.intentionModalItemColor,
        fontSize: 16,
        lineHeight: 19,
        textAlign: 'left',
        fontWeight: '400'
    },
    modalList: {
        marginTop: 20,
        marginHorizontal: 10,
        flex: 1
    },
    intentionList : {
        top: 10,
        width: '100%'
    },
    modalBackButton: {
        position: 'absolute',
        top: 55,
        left: 10,
        width: 25,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listRow: {
        flexDirection: 'row',
        width:'100%',
        alignItems:'center',
        marginVertical: 10,
        backgroundColor: colors.mainWhite,
        borderRadius: 5,
        marginHorizontal: 10,
        height: 60,
        overflow: 'hidden'
    },
    iconImage: {
        height: 60,
        width: 60,
        overflow: 'hidden'
    },
    sourceText: {
        color: colors.darkBlue,
        fontFamily: 'CircularStd-Book',
        fontSize: 16,
        marginLeft: 20,
        width: '60%'
    }
});
