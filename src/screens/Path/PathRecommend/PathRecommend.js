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
import LoadingRow from "../../../components/LoadingRow";
import PathItem from "../PathItem";
import NoDataView from "../../../components/NoDataView";
import {strings} from "../../../constants/strings";


export default class PathRecommend extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.state = {
            bookmarked: [],
        }
    }

    componentDidMount() {
        this.props.getPathRecommend(1,20)
    }

    _keyExtractor = (item, index) => index + '';

    _openPathDetail = (item) => {
        console.log()
        this.props.navigation.navigate("UserPath", item);
    };

    _onBookmarkItem = (id) => {
        if (_.findIndex(this.state.bookmarked, (o) => (o === id)) !== -1) {
            this.setState({bookmarked: _.filter(this.state.bookmarked, (o) => (o !== id))});
            this.props.removeBookmark(id, strings.bookmarkType.path, strings.trackingType.path);
        } else {
            this.setState({bookmarked: this.state.bookmarked.concat(id)});
            this.props.createBookmark(id, strings.bookmarkType.path, strings.trackingType.path);
        }
    };

    _renderVerticalItem = ({item}) => {

        return (<PathItem data={item}
                          onBookmark={() => this._onBookmarkItem(item._id)}
                          onClicked={() => this._openPathDetail(item)}
                          bookmarked={_.findIndex(this.state.bookmarked, (o) => (o === item._id)) !== -1}/>)
    };

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
        if (this.props.pathRecommend.data != null) {
            if (this.props.pathRecommend.data.length === this.currentPage * 20) {
                this.currentPage += 1;
                this.props.getPathRecommend(this.currentPage, 20);
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
        return (<NoDataView text={'No recommend path'}/>);
    };

    render() {
        const {pathRecommend} = this.props;
        return (
            <View style={[{
                flex: 1,
                flexDirection: 'column'
            },this.props.style]}>
                <SectionList
                    refreshing={pathRecommend.isFetching}
                    onRefresh={() => {
                        this.props.getPathRecommend(1,10);
                        this.currentPage = 1;
                    }}
                    style={styles.alertWindow}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    ListFooterComponent={() => this._renderListFooter(pathRecommend.isFetching)}
                    ListEmptyComponent={this._renderEmptyList(pathRecommend.isFetching)}
                    onEndReachedThreshold={0.5}
                    sections={[
                        {
                            data: [pathRecommend.data],
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
