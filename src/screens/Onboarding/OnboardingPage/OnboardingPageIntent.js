import React from 'react'
import {
    Text, View, FlatList, StyleSheet, TouchableOpacity, Dimensions
} from 'react-native'
import {colors} from "../../../constants/colors";
import {onboardingItemStyle} from "../../../constants/theme";
import _ from 'lodash'
import {TagSelect} from 'react-native-tag-select';
import Autocomplete from "react-native-autocomplete-input";
import {postCreateIntent} from "../../../api";

export default class OnboardingPageIntent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            query: '',
            selectedIntentions: [],
            isSearching: false,
        }
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
        let newIntentions = selectedIntentions.filter((intent) => intent._id !== id);
        this.setState({selectedIntentions: newIntentions});
        this.props.onSelectedChanged(newIntentions);
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

    render() {

        const {query} = this.state;
        let intents = this._findIntent(query);

        return (
            <View style={styles.rootView}>
                <Autocomplete
                    autoCapitalize="none"
                    autoCorrect={false}
                    containerStyle={styles.autocompleteContainer}
                    inputContainerStyle={styles.inputContainer}
                    data={intents}
                    defaultValue={''}
                    onChangeText={text => this.setState({query: text, isSearching: true})}
                    placeholder="Search for intention"
                    renderItem={({_id, group, displayName}) => (
                        <TouchableOpacity zIndex={1000} style={styles.autocompleteButton}
                                          onPress={() => this._onChooseIntent({
                                              _id: _id,
                                              group: group,
                                              displayName: displayName
                                          })}>
                            <Text style={[styles.autocompleteText, group ? {fontWeight: 'bold'} : {}]}>
                                {_id === "_create_new" ? "New intent \"" + displayName + "\"" : displayName}
                            </Text>
                        </TouchableOpacity>
                    )}
                    renderSeparator={() => (
                        <View style={styles.separatorLine}/>
                    )}
                />
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
    autocompleteView: {
        flex: 1
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: colors.grayLine
    },
    autocompleteText: {
        fontSize: 15,
        color: colors.blackText,
        paddingHorizontal: 10
    },
    autocompleteButton: {
        paddingVertical: 15
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
        color: colors.blueText
    }
});
