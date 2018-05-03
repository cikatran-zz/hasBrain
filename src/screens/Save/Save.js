import React from 'react'
import {
    Text, View, FlatList, StyleSheet
} from 'react-native'
import VerticalNotificationRow from '../../components/VerticalNotificationRow'

export default class Save extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getSaved()
    }

    _renderListItem = ({ item }) => {
        return (
            <VerticalNotificationRow title={item.title} highlight={item.description}
                                     time={item.created_at} image={item.photo}/>
        )
    }

    render() {
        const { saved } = this.props
        return (
            <View style={{ backgroundColor: '#ECECEC' }}>
                <FlatList
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    data={saved.data}
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
