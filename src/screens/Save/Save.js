import React from 'react'
import {
    Text, View, FlatList, StyleSheet, TouchableOpacity
} from 'react-native'
import VerticalNotificationRow from '../../components/VerticalNotificationRow'
import {colors} from "../../constants/colors";
import VerticalRow from "../../components/VerticalRow";

export default class Save extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getSaved()
    }

    _renderListItem = ({item}) => {
        return (
            <TouchableOpacity onPress={() => {
                this.props.navigation.navigate('Reader', {url: item.url})
            }}>
                <VerticalRow title={item.title} author={item.author} time={item.created_at} image={item.photo}
                />
            </TouchableOpacity>
        )
    };

    _keyExtractor = (item, index) => index + "";

    _renderEmptyList = () => {
        return (
            <View style={{
                flex: 1,
                backgroundColor: colors.mainLightGray,
                justifyContent: 'center',
                alignItems: 'center'
            }}/>
        )
    };

    render() {
        const {saved} = this.props;
        return (
            <View style={{backgroundColor: colors.mainLightGray, flex: 1}}>
                <FlatList
                    refreshing={saved.isFetching}
                    onRefresh={() => this.props.getSaved()}
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this._renderEmptyList}
                    data={saved.data}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#ffffff'
    },
    listContainer: {
        marginTop: 10,
        marginLeft: 0,
        marginBottom: 0
    },
    listItemContainer: {
        paddingLeft: 20,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff'
    }
})
