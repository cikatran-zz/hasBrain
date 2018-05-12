import React from 'react'
import {
    Text, View, FlatList, StyleSheet, TouchableOpacity
} from 'react-native'
import VerticalNotificationRow from '../../components/VerticalNotificationRow'
import {colors} from "../../constants/colors";
import VerticalRow from "../../components/VerticalRow";
import NoDataView from "../../components/NoDataView";
import {postUnbookmark} from "../../api";
import _ from 'lodash'
import {getImageFromArray} from "../../utils/imageUtils";

export default class Save extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.state = {
            deleteItems: []
        }
    }

    componentDidMount() {
        this.props.getSaved()
    }

    _onUnbookmarkItem = (id) => {
        this.setState({deleteItems: this.state.deleteItems.concat(id)});
        postUnbookmark(id).then(value => {
            console.log("DONE BOOKMARK",value);
        }).catch((err)=> {
            console.log("ERROR BOOK", err);
        });
    };

    _renderListItem = ({item}) => {
        let article = item.article;
        if (article == null) {
            return null;
        }
        return (<VerticalRow title={article.title}
                             author={article.author}
                             time={article.sourceCreateAt}
                             readingTime={article.readingTime}
                             image={getImageFromArray(article.originalImages, null, null)}
                             onClicked={() => this._openReadingView(article.url)}
                             onBookmark={()=>this._onUnbookmarkItem(item._id)}
                             bookmarked={true}/>)
    }

    _keyExtractor = (item, index) => index + "";

    _renderEmptyList = () => (<NoDataView text={'No bookmark'}/>);

    _openReadingView = (url) => {
        this.props.navigation.navigate('Reader', {url: url})
    };

    _fetchMore = () => {
        if (this.props.saved.data != null) {
            if (this.props.saved.data.length % 10 === 0) {
                console.log(this.props.saved.data);
                this.currentPage += 1;
                this.props.getSaved(this.currentPage, 10);
            }
        }

    };

    _renderVerticalSeparator = ()=>(
        <View style={styles.horizontalItemSeparator}/>
    );

    render() {
        const {saved} = this.props;
        if (saved.isFetching && this.state.deleteItems.length > 0) {
            this.setState({deleteItems: []})
        }

        let data = saved.data;
        if (data != null) {
            data = data.filter((x)=>(this.state.deleteItems.indexOf(x._id) < 0))
        }

        return (
            <View style={{backgroundColor: colors.mainWhite, flex: 1}}>
                <FlatList
                    refreshing={saved.isFetching}
                    onRefresh={() => this.props.getSaved(1,10)}
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this._renderEmptyList}
                    onEndReachedThreshold={20}
                    onEndReached={this._fetchMore}
                    ItemSeparatorComponent={()=>this._renderVerticalSeparator()}
                    data={data}
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
    },
    horizontalItemSeparator: {
        backgroundColor: colors.grayLine,
        flex: 1,
        marginHorizontal: 20,
        height: 1
    }
});
