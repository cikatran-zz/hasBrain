import React from 'react'
import {
    ActivityIndicator,
    FlatList,
    SectionList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Share, NativeModules, Platform, Image,
    Alert
} from 'react-native'
import {colors} from '../../constants/colors'
import _ from 'lodash'
import {strings} from "../../constants/strings";
import {rootViewTopPadding} from "../../utils/paddingUtils";
import {navigationTitleStyle} from "../../constants/theme";
import CheckComponent from '../../components/CheckComponent'

export default class MySource extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedState: (new Map(): Map<string, boolean>)
        }
    }

    componentDidMount() {
        this.props.getSourceList();
    }

    componentWillUnmount() {
    }

    _onPressItem = (id) => {
        const {source} = this.props;
        const {chosenSources} = source;

        this.setState((state) => {
            let checkedState = state.checkedState;
            if (_.isEmpty(checkedState)) {
                let keys = _.keys(chosenSources);
                for (let key of keys) {
                    checkedState.set(key, true);
                }
            }
            let checkedSourcesValues = Array.from(checkedState.values());
            checkedSourcesValues = _.filter(checkedSourcesValues, (item) => {
                return item == true;
            })
            if (checkedSourcesValues.length < 2) {
                if (checkedState.get(id)) {
                    Alert.alert('Error', 'You must have at least 1 source', [
                        {text: 'OK'},
                    ])
                } else {
                    let checked = !checkedState.get(id);
                    checkedState.set(id, checked);

                }
            } else {
                let checked = !checkedState.get(id);
                checkedState.set(id, checked);
            }
            return {checkedState}
        });
    }

    _keyExtractor = (item, index) => index.toString();
    _renderListItem = ({item}) => {
        const {checkedState} = this.state;
        const {source} = this.props;
        const {chosenSources} = source;
        let checkedItem = false;
        if (_.isEmpty(checkedState)) {
            checkedItem = _.get(chosenSources, item.sourceId, undefined);
        } else {
            checkedItem = checkedState.get(item.sourceId);
        }

        return (
            <View style={styles.listRow}>
                <Image resizeMode='contain' sytle={styles.iconImage} source={{uri: item.sourceImage, width: 30, height: 30}}/>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginLeft: 20, alignItems: 'center', width: '80%', height: 30}}>
                    <Text style={styles.sourceText}>{item.title}</Text>
                    <CheckComponent id={item.sourceId} checkedItem={checkedItem} onPressItem={this._onPressItem}/>
                </View>
            </View>
        )
    }

    _onBackPress = () => {
        const {checkedState} = this.state;
        const {source} = this.props;
        let newSources = source.data.items.map((item) => {
            if (checkedState.get(item.sourceId)) {
                return {[item.sourceId]: item.categories};
            }
        });
        newSources = _.compact(newSources);
        let newSourcesMap = {};

        let newSourcesArray = [];
        let newTagsArray = [];
        for (let item of newSources) {
            newSourcesMap[Object.keys(item)[0]] = Object.values(item)[0];
            newSourcesArray = _.concat(newSourcesArray, Object.keys(item));
            newTagsArray = _.uniq(_.flatten(_.concat(newTagsArray, Object.values(item))));
        }
        this.props.updateSourceList(newSourcesMap);
        this.props.getArticles(10, 0, newSourcesArray, newTagsArray)
        this.props.navigation.goBack();
    }

    render() {
        const {source} = this.props;
        if (!source.data)
            return null;
        return (
            <View style={styles.rootView}>
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.backButton} onPress={() => this._onBackPress()}>
                        <Image style={styles.backIcon} source={require('../../assets/ic_back_button.png')}/>
                    </TouchableOpacity>
                    <Text style={navigationTitleStyle}>My source</Text>
                </View>
                <View>
                </View>
                <FlatList
                    style={{marginHorizontal:20}}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    data={source.data.items}
                    renderItem={this._renderListItem}
                    showsVerticalScrollIndicator={false}/>
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
    headerView: {
        flexDirection: 'row',
        marginTop: rootViewTopPadding() + 10,
        marginHorizontal: 20,
        alignItems: 'center'
    },
    backIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    backButton: {
        padding: 10,
        marginRight: 20
    },
    searchText: {
        marginLeft: 15,
        fontSize: 20,
        color: colors.grayTextSearch
    },
    listRow: {
        flexDirection: 'row',
        width:'100%',
        alignItems:'center',
        marginVertical: 10
    },
    iconImage: {
        height: 30,
        width: 30,
        borderRadius: 3,
        borderWidth: 1,
        overflow: 'hidden'
    },
    sourceText: {
        color: colors.grayTextExpTitle,
        fontSize: 18
    }
});
