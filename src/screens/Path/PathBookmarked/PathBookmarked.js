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
    Share, NativeModules, Platform
} from 'react-native'
import {colors} from '../../../constants/colors'
import _ from 'lodash'
import {postRemoveBookmark} from "../../../api";
import LoadingRow from "../../../components/LoadingRow";
import PathItem from "../PathItem";
import NoDataView from "../../../components/NoDataView";
import {strings} from "../../../constants/strings";


export default class PathBookmarked extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.state = {
            deleteItems: []
        };
        this.rows = {};
    }

    componentDidMount() {
        this.props.getPathBookmarked(1,20)
    }

    _keyExtractor = (item, index) => index + '';

    _openPathDetail = (item) => {
        this.props.navigation.navigate("UserPath", item);

    };

    _onUnbookmarkItem = (id) => {
        if (this.rows[id]) {
            this.rows[id]._onRemove(()=> {
                this.setState({deleteItems: this.state.deleteItems.concat(id)});
            })
        }
        this.props.removeBookmark(id, strings.bookmarkType.path, strings.trackingType.path);
    };

    _renderVerticalItem = ({item}) => {
        let {content} = item;
        if (content == null) {
            return null;
        }
        return (<PathItem data={content}
                          ref={(ref)=> this.rows[content._id] = ref}
                          onBookmark={()=>this._onUnbookmarkItem(content._id)}
                          onClicked={() => this._openPathDetail(content)}
                          bookmarked={true}/>)
    }

    _renderVerticalSeparator = () => (
        <View style={styles.horizontalItemSeparator}/>
    );

    _renderVerticalSection = ({item}) => (
        <FlatList
            style={{flex: 1}}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={item}
            ItemSeparatorComponent={() => this._renderVerticalSeparator()}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVerticalItem}/>
    );

    _fetchMore = () => {
        if (this.props.pathBookmarked.data != null) {
            if (this.props.pathBookmarked.data.length === this.currentPage * 10) {
                this.currentPage += 1;
                this.props.getPathBookmarked(this.currentPage, 10);
                this.setState({deleteItems: []});
            }
        }

    };

    _renderListFooter = (isFetching) => {
        if (isFetching) {
            return (
                <LoadingRow/>
            )
        } else {
            return null;
        }

    };

    _renderEmptyList = (isFetching) => {
        if (isFetching) {
            return null;
        }
        return (<NoDataView text={'No bookmark path'}/>);
    };

    render() {
        const {pathBookmarked} = this.props;

        let data = [];
        if (pathBookmarked.data != null) {
            data = pathBookmarked.data.filter((x)=> (x.content != null && _.indexOf(this.state.deleteItems, x.content._id) < 0));
        }

        if (data.length === 0) {
            data = null;
        }
        return (
            <View style={[{
                flex: 1,
                flexDirection: 'column'
            },this.props.style]}>
                <SectionList
                    refreshing={pathBookmarked.isFetching}
                    onRefresh={() => {
                        this.setState({deleteItems: []});
                        this.props.getPathBookmarked(1,10);
                        this.currentPage = 1;
                    }}
                    style={styles.alertWindow}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    ListFooterComponent={() => this._renderListFooter(pathBookmarked.isFetching)}
                    ListEmptyComponent={this._renderEmptyList(pathBookmarked.isFetching)}
                    onEndReachedThreshold={0.5}
                    sections={[
                        {
                            data: [data],
                            renderItem: this._renderVerticalSection
                        }
                    ]}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    alertWindow: {
        backgroundColor: colors.mainWhite,
        position: 'relative',
        flex: 1
    },
    horizontalCarousel: {
        backgroundColor: colors.carouselBackground,
    },
    horizontalItemSeparator: {
        backgroundColor: colors.grayLine,
        flex: 1,
        marginHorizontal: 20,
        height: 1
    },
    sectionTitle: {
        backgroundColor: colors.carouselBackground,
        textAlign: 'center',
        color: colors.blackText,
        fontSize: 20,
        paddingVertical: 10,
    }
});
