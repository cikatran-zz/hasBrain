import React from 'react'
import {
    Text, View, FlatList, StyleSheet, TouchableOpacity, Platform
} from 'react-native'
import VerticalNotificationRow from '../../components/VerticalNotificationRow'
import {colors} from "../../constants/colors";
import VerticalRow from "../../components/VerticalRow";
import NoDataView from "../../components/NoDataView";
import {postUnbookmark} from "../../api";
import _ from 'lodash'
import {getImageFromArray} from "../../utils/imageUtils";
import {extractRootDomain} from "../../utils/stringUtils";
import LoadingRow from "../../components/LoadingRow";
import ReaderManager from "../../modules/ReaderManager";

export default class Save extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.state = {
            deleteItems: []
        };
        this.rows = {};
    }

    componentDidMount() {
        //this.props.getSaved()
    }

    _onUnbookmarkItem = (id) => {
        if (this.rows[id]) {
            this.rows[id]._onRemove(()=> {
                this.setState({deleteItems: this.state.deleteItems.concat(id)});
            })
        }
        postUnbookmark(id).then(value => {
            //console.log("DONE BOOKMARK",value);
        }).catch((err)=> {
            //console.log("ERROR BOOK", err);
        });
    };

    _renderListItem = ({item}) => {
        let article = item.article;
        if (article == null) {
            return null;
        }
        return (<VerticalRow title={article.title}
                             ref={(ref)=> this.rows[article._id] = ref}
                             author={extractRootDomain(article.contentId)}
                             time={article.createdAt}
                             readingTime={article.readingTime}
                             image={getImageFromArray(article.originalImages, null, null, article.sourceImage)}
                             onClicked={() => this._openReadingView(article)}
                             onBookmark={()=>this._onUnbookmarkItem(article._id)}
                             bookmarked={true}/>)
    }

    _keyExtractor = (item, index) => index + "";

    _renderEmptyList = (isFetching) => {
        if (isFetching) {
            return null;
        }
        return (<NoDataView text={'No bookmark'}/>);
    }

    _openReadingView = (item) => {
        if (Platform.OS === "ios") {
            ReaderManager.sharedInstance._open(item, true);
        } else {
            this.props.navigation.navigate("Reader", item);
        }
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

    _renderListFooter = (isFetching) => {
        if (isFetching) {
            return (
                <LoadingRow/>
            )
        } else {
            return null;
        }

    };

    render() {
        const {saved} = this.props;
        if (saved.isFetching && this.state.deleteItems.length > 0) {
            this.setState({deleteItems: []})
        }

        let data = [];
        if (saved.data != null) {
            data = saved.data.filter((x)=> (_.indexOf(this.state.deleteItems, x.article._id) < 0))
        }

        if (data.length === 0) {
            data = null;
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
                    ListEmptyComponent={this._renderEmptyList(saved.isFetching)}
                    onEndReachedThreshold={20}
                    onEndReached={this._fetchMore}
                    ItemSeparatorComponent={()=>this._renderVerticalSeparator()}
                    ListFooterComponent={() => this._renderListFooter(saved.isFetching)}
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
