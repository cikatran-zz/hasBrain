import React from 'react'
import {
    Text, View, FlatList, StyleSheet, TouchableOpacity, Dimensions, Modal, Image, TouchableWithoutFeedback, TextInput
} from 'react-native'
import {colors} from "../../../constants/colors";
import {onboardingItemStyle} from "../../../constants/theme";
import _ from 'lodash'
import {TagSelect} from 'react-native-tag-select';
import Autocomplete from "react-native-autocomplete-input";
import {rootViewTopPadding} from "../../../utils/paddingUtils";
import {postCreateIntent} from "../../../api";

export default class OnboardingPageIntent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            selectedIntentions: [],
            isSearching: false,
            showSearchModal: false
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
        return this.state.selectedIntentions.map((item, index) => <TouchableOpacity
            onPress={() => this._onClickedTag(item._id)}><View style={styles.tagView}><Text
            style={styles.tagText}>{item.displayName}</Text></View></TouchableOpacity>)
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
        if (item._id !== "_create_new" && intents.find((x) => x.displayName === item.displayName) == null) {
            intents = intents.concat([item]);
        }
        this.setState({selectedIntentions: intents, query: ''});
        if (item._id === "_create_new") {
            postCreateIntent(item.displayName).then((value) => {
                intents = intents.concat([{
                    _id: value.data.user.intentCreate.recordId,
                    group: false,
                    displayName: item.displayName
                }]);
                this.setState({selectedIntentions: intents, query: ''});
                console.log("Create INTENT success ", value);
                this.props.onSelectedChanged(intents);
            }).catch((e) => {
                console.log("Create INTENT failed ", item.displayName)
            })
        } else {
            this.props.onSelectedChanged(intents);
        }

    };

    componentWillReceiveProps(nextProps) {
        let {selected} = this.props;
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
        if (_.isEqual(intents, this.state.selectedIntentions) === false && this.chosen === false) {
            console.log("Update with new intents", intents, this.state.selectedIntentions);
            this.setState({selectedIntentions: intents});
            this.props.onSelectedChanged(intents);
        }
    }
    showSearchModal(visible) {
        this.setState({showSearchModal: visible});
    }

    _keyExtractor = (item, index) => index.toString();

    _onSearchItemPress = (_id, group, displayName) => {
        this.showSearchModal(false);
        this._onChooseIntent({
            _id: _id,
            group: group,
            displayName: displayName
        })
    }

    _renderSearchItem = ({item}) => {
        const {_id, group, displayName} = item;
        return (
        <TouchableOpacity style={styles.autocompleteButton}
                          onPress={() => this._onSearchItemPress(_id, group, displayName)}>
            <Text style={[styles.autocompleteText, group ? {fontWeight: 'bold'} : {}]}>
                {_id === "_create_new" ? "New intent \"" + displayName + "\"" : displayName}
            </Text>
        </TouchableOpacity>
        )
    }

    render() {

        const {query} = this.state;
        let intents = this._findIntent(query);
        return (
            <View style={styles.rootView}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.showSearchModal}>
                    <View style={styles.searchModalContainer}>
                        <View style={styles.searchModalBar}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.showSearchModal(!this.state.showSearchModal);
                                }}>
                                <Image style={styles.backIcon} source={require('../../../assets/ic_back_button.png')}/>
                            </TouchableOpacity>
                            <TextInput
                                underlineColorAndroid="transparent"
                                style={{marginLeft: 5, borderBottomColor: colors.grayLine, borderBottomWidth: 0.5, width: '80%', paddingVertical: -5}}
                                placeholder="Search for intention"
                                autoFocus={true}
                                onChangeText={text => this.setState({query: text, isSearching: true})}
                            />
                        </View>
                        <FlatList
                            keyExtractor={this._keyExtractor}
                            style={{flex: 1}}
                            horizontal={false}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => (
                                <View style={styles.separatorLine}/>
                            )}
                            data={intents}
                            renderItem={this._renderSearchItem}
                        />
                    </View>
                </Modal>
                <TouchableWithoutFeedback style={{width: '100%'}} onPress={() => {
                    this.showSearchModal(!this.state.showSearchModal);
                }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.searchText}>Search for intention</Text>
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.tagsView}>
                    {this._renderTags()}
                </View>
            </View>
        );
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
        marginTop: 10,
        marginRight: 10
    },
    tagText: {
        fontSize: 15,
        color: colors.blueText,

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
        paddingTop: rootViewTopPadding(),
        flex: 1
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
});
