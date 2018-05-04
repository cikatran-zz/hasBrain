import React from 'react'
import {
    Text, View, FlatList, StyleSheet
} from 'react-native'
import VerticalNotificationRow from '../../components/VerticalNotificationRow'
import {colors} from "../../constants/colors";

export default class Notification extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getNotification()
    }

    _renderListItem = ({ item }) => {
        return (
            <VerticalNotificationRow title={item.title} highlight={item.highlight} time={item.created_at} image={item.photo}/>
        )
    };

    _keyExtractor = (item, index) => index + "";

    render() {
        const { notification } = this.props;
        return (
            <View style={{ backgroundColor: colors.mainLightGray }}>
                <FlatList
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    showsVerticalScrollIndicator={false}
                    data={notification.data}
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
