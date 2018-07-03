import React from 'react'
import {
    Text, View, FlatList, StyleSheet, TouchableOpacity, Platform
} from 'react-native'
import {colors} from "../../constants/colors";
import NoDataView from "../../components/NoDataView";
import _ from 'lodash'
import {getImageFromArray} from "../../utils/imageUtils";
import {extractRootDomain} from "../../utils/stringUtils";
import LoadingRow from "../../components/LoadingRow";
import {strings} from "../../constants/strings";
import {rootViewTopPadding} from "../../utils/paddingUtils";
import SavedItem from "../../components/SavedItem";

export default class Save extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        // this.state = {
        //     deleteItems: []
        // };
        this.rows = {};
    }

    componentDidMount() {
        //this.props.getSaved()
    }

    _onUnbookmarkItem = (id) => {
        // if (this.rows[id]) {
        //     this.rows[id]._onRemove(() => {
        //         this.setState({deleteItems: this.state.deleteItems.concat(id)});
        //     })
        // }
        //this.setState({deleteItems: this.state.deleteItems.concat(id)});
        const {bookmarkedIds} = this.props;
        let bookmarkedArticles = _.get(bookmarkedIds, 'data.articles', []);
        if (_.findIndex(bookmarkedArticles, (o) => (o === id)) !== -1) {
            this.props.removeBookmark(id, strings.bookmarkType.article, strings.trackingType.article);
        } else {
            this.props.createBookmark(id, strings.bookmarkType.article, strings.trackingType.article);
        }
    };

    _renderListItem = ({item}) => {
        const {bookmarkedIds} = this.props;
        let {article: content} = item;
        if (content == null) {
            return null;
        }
        return (<SavedItem title={content.title}
                           shortDescription={content.shortDescription}
                           category={content.category}
                           sourceCommentCount={content.sourceCommentCount}
                           sourceActionName={content.sourceActionName}
                           sourceActionCount={content.sourceActionCount}
                           ref={(ref) => this.rows[content._id] = ref}
                           sourceName={extractRootDomain(content.contentId)}
                           time={content.readingTime}
                           image={content.sourceImage}
                           onClicked={() => this._openReadingView(content)}
                           onBookmark={() => this._onUnbookmarkItem(content._id)}
                           bookmarked={_.findIndex(_.get(bookmarkedIds.data, 'articles',[]), (x)=>(x === content._id)) !== -1}/>)
    };

    _keyExtractor = (item, index) => index + "";

    _renderEmptyList = (isFetching) => {
        if (isFetching) {
            return null;
        }
        return (<NoDataView text={'No bookmark'}/>);
    };

    _openReadingView = (item) => {
        // if (Platform.OS === "ios") {
        //     ReaderManager.sharedInstance._open(item, true);
        // } else {
        this.props.navigation.navigate("Reader", {...item, bookmarked: true});
        //}
    };

    _fetchMore = () => {
        if (this.props.saved.data != null) {
            if (this.props.saved.data.length === this.currentPage * 10) {
                this.currentPage += 1;
                this.props.getSaved(this.currentPage, 10);
                this.setState({deleteItems: []});
            }
        }

    };

    _renderVerticalSeparator = () => (
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

        let data = saved.data;
        // if (saved.data != null) {
        //     try {
        //         data = saved.data.filter((x) => (x.content != null && _.indexOf(this.state.deleteItems, x.content._id) < 0))
        //     } catch (error) {
        //         console.log("Error", error);
        //     }
        //
        // }

        // if (data.length === 0) {
        //     data = null;
        // }

        return (
            <View style={{backgroundColor: colors.lightGray, flex: 1}}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Saved</Text>
                </View>
                <FlatList
                    refreshing={saved.isFetching}
                    onRefresh={() => {
                        this.setState({deleteItems: []});
                        this.props.getSaved(1, 10);
                        this.currentPage = 1;
                    }}
                    style={styles.listContainer}
                    keyExtractor={this._keyExtractor}
                    horizontal={false}
                    renderItem={this._renderListItem}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this._renderEmptyList(saved.isFetching)}
                    onEndReachedThreshold={0.5}
                    onEndReached={this._fetchMore}
                    ItemSeparatorComponent={() => this._renderVerticalSeparator()}
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
    header: {
        marginTop: rootViewTopPadding(),
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        paddingBottom: 0
    },
    headerText: {
        fontFamily: 'CircularStd-Black',
        fontSize: 30,
        color: colors.articleTitle
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
