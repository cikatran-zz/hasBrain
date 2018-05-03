import React from 'react'
import {
    Text, View, FlatList, StyleSheet
} from 'react-native'
import { getNotification } from '../../api'

export default class Notification extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            notificationData: null
        }
    }

    componentDidMount() {
        getNotification().then((response) => response.json()).then((response) => {
            console.log(response)
        });
        let temp = [{ name: 'abc' }, { name: 'temp 1' }]
        this._updateNotificationData(temp)
    }

    _updateNotificationData = (notification) => {
        this.setState({ notificationData: notification })
    }

    _renderListItem = ({ item }) => {
        return (
            <View style={styles.listItemContainer}>
                <Text>{item.name}</Text>
                <Text>{item.name}</Text>
                <Text>{item.name}</Text>


            </View>
        )
    }

    render() {
        console.log(this.props)
        // const {data} = this.props.navigation.state.params;
        return (
            <View style={{ backgroundColor: '#ECECEC' }}>
                <FlatList
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    data={this.state.notificationData}
                    ItemSeparatorComponent={() => <View
                        style={{
                            width: '100%',
                            height: 1,
                            backgroundColor: '#DADADE'
                        }}/>}
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
        marginTop: 0,
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
