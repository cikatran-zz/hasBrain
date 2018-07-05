import React from 'react'
import {
    ActivityIndicator,
    FlatList,
    SectionList,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions,
    Share, NativeModules, Platform, Image,
    Alert, TouchableWithoutFeedback
} from 'react-native'
import {colors} from '../../../constants/colors'
import _ from 'lodash'
import {strings} from "../../../constants/strings";
import {rootViewTopPadding} from "../../../utils/paddingUtils";
import {navigationTitleStyle} from "../../../constants/theme";
import CheckComponent from '../../../components/CheckComponent';
import HBText from '../../../components/HBText'

export default class Sources extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checkedState: (new Map(): Map<string, boolean>)
        }
        this._debounceReloadAndSave = _.debounce(this.updateFollow, 2000);
    }

    componentDidMount() {
        //this.props.getSourceList();
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    _onPressItem = (id) => {
        const {source} = this.props;
        const {chosenSources} = source;
        this._debounceReloadAndSave();
        this.setState((state) => {
            let checkedState = state.checkedState;
            if (checkedState.size < 1) {
                let sources = (source.data ? source.data : []).map(item => {
                    return item.sourceId
                });
                for (let key of sources) {
                    checkedState.set(key, chosenSources.includes(key));
                }
            }
            let checkedSourcesValues = Array.from(checkedState.values());
            // checkedSourcesValues = _.filter(checkedSourcesValues, (item) => {
            //     return item == true;
            // })
            // if (checkedSourcesValues.length < 2) {
            //     if (checkedState.get(id)) {
            //         Alert.alert('Oops!', 'You must have at least 1 source', [
            //             {text: 'Got it!'},
            //         ])
            //     } else {
            //         let checked = !checkedState.get(id);
            //         checkedState.set(id, checked);
            //
            //     }
            // } else {
            let checked = !checkedState.get(id);
            checkedState.set(id, checked);
            // }
            return {checkedState}
        });
    }

    _keyExtractor = (item, index) => index.toString();
    _renderListItem = ({item}) => {
        const {checkedState} = this.state;
        const {source} = this.props;
        const {chosenSources} = source;
        let checkedItem = false;
        if (checkedState.size < 1) {
            checkedItem = chosenSources.includes(item.sourceId);

        } else {
            checkedItem = checkedState.get(item.sourceId);
        }

        return (
            <TouchableWithoutFeedback onPress={()=>this._onPressItem(item.sourceId)}>
                <View style={styles.listRow}>
                    <Image resizeMode='contain' sytle={styles.iconImage} source={{uri: item.sourceImage, width: 60, height: 60}}/>
                    <HBText style={styles.sourceText}>{item.title}</HBText>
                    <CheckComponent id={item.sourceId} checkedItem={checkedItem} onPressItem={(id)=>{}}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    updateFollow() {
        const {checkedState} = this.state;
        const {source} = this.props;
        let newSources = (source.data ? source.data : []).map((item) => {
            if (checkedState.get(item.sourceId)) {
                return item.sourceId;
            }
        });
        newSources = _.compact(newSources);
        //if (!_.isEmpty(newSources))
        if (checkedState.size !== 0)
            this.props.updateSourceList(newSources);
    }

    _renderListFooter = () => {
        return <View style={{height: 150}}/>;

    };

    render() {
        const {source} = this.props;
        if (!source.data)
            return null;
        return (

            <FlatList
                refreshing={source.isFetching}
                onRefresh={() => this.props.getSourceList()}
                style={{marginHorizontal:10}}
                extraData={this.state}
                keyExtractor={this._keyExtractor}
                horizontal={false}
                data={source.data}
                renderItem={this._renderListItem}
                ListFooterComponent={() => this._renderListFooter()}
                showsVerticalScrollIndicator={false}/>
        )
    }

}

const styles = StyleSheet.create({
    headerView: {
        flexDirection: 'row',
        marginTop: rootViewTopPadding() + 10,
        alignItems: 'center',
        backgroundColor: colors.mainWhite,
        paddingBottom: 10
    },
    backIcon: {
        width: 16,
        height: 12,
        resizeMode: 'contain'
    },
    backButton: {
        padding: 10,
        marginRight: 5
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
    },
    searchBar: {
        flexDirection: 'row',
        borderRadius: 3,
        borderWidth: 1,
        borderColor: colors.whiteGray,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        backgroundColor: colors.lightGray,
        height: 49,
        alignItems: 'center'
    },
    searchIcon: {
        width: 20,
        resizeMode: 'contain',
        aspectRatio: 1,
        tintColor: '#A6B2C4'
    },
    searchText: {
        marginLeft: 15,
        fontSize: 14,
        color: colors.grayTextSearch,
        fontFamily: 'CircularStd-Book',
        opacity: 0.5
    },
});
