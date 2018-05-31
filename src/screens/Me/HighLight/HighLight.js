import React, {PureComponent} from 'react'
import {
    Text, View, StyleSheet, NativeModules, Platform, FlatList, ActivityIndicator
} from 'react-native'
import { colors } from '../../../constants/colors';

export default class HighLight extends PureComponent {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getHighlight(1, 10);
    }



    _keyExtractor = (item, index) => index.toString();

    _renderListItem = ({item}) => {
        return (
            <View style={{flexDirection:'column'}}>
                <Text style={{fontSize: 18, color: colors.blackHeader, marginTop: 10}}><Text style={{fontSize: 20, color: colors.blackHeader, fontWeight:'bold'}}> &ldquo; </Text>{item.highLight}<Text style={{fontSize: 20, color: colors.blackHeader, fontWeight:'bold'}}> &rdquo; </Text></Text>
                <Text style={{fontSize: 13, color: colors.blackText, marginVertical: 5}}>{item.title}</Text>
            </View>
        )
    }

    __renderListFooter = () => {
        const {highLight} = this.props;
        if (highLight.isFetching) {
            return (
                <View
                    style={{height: 30, width: '100%' ,justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size={"small"} color={colors.darkBlue}/>
                </View>
            )
        } else {
            return null;
        }
    };

    _fetchMore = () => {
        const {highLight} = this.props;
        let currentPage = highLight.page;
        currentPage++
        this.props.getHighlight(currentPage, 10);

    };

    render() {
        const {highLight} = this.props;
        return (
            <View style={styles.container}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    renderItem={this._renderListItem}
                    ListFooterComponent={this.__renderListFooter}
                    onEndReached={this._fetchMore}
                    data={highLight.data}
                    keyExtractor={this._keyExtractor}/>
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

const tempData = [
    {title: 'Why so Many Developers Quit Before Ever Getting a Job. Please - don’t.', highLight: 'The rest is Googling the right words. In this case, “css add shadow” and “javascript callback form submit”.'},
    {title: 'Why so Many Developers Quit Before Ever Getting a Job. Please - don’t.', highLight: 'The rest is Googling the right words. In this case, “css add shadow” and “javascript callback form submit”.'},
    {title: 'Why so Many Developers Quit Before Ever Getting a Job. Please - don’t.', highLight: 'The rest is Googling the right words. In this case, “css add shadow” and “javascript callback form submit”.'},
    {title: 'Why so Many Developers Quit Before Ever Getting a Job. Please - don’t.', highLight: 'The rest is Googling the right words. In this case, “css add shadow” and “javascript callback form submit”.'},
    {title: 'Why so Many Developers Quit Before Ever Getting a Job. Please - don’t.', highLight: 'The rest is Googling the right words. In this case, “css add shadow” and “javascript callback form submit”.'}
];
