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
    Share, NativeModules, Platform, Image,
    TouchableWithoutFeedback
} from 'react-native'
import {colors} from '../../constants/colors'
import VerticalRow from '../../components/VerticalRow'
import HorizontalCell from '../../components/HorizontalCell'
import Carousel from '../../components/CustomCarousel'
import {getImageFromArray} from "../../utils/imageUtils";
import _ from 'lodash'
import {postCreateBookmark, postRemoveBookmark} from "../../api";
import {strings} from "../../constants/strings";
import {formatReadingTimeInMinutes, getIDOfCurrentDate} from "../../utils/dateUtils";
import {extractRootDomain} from "../../utils/stringUtils";
import LoadingRow from "../../components/LoadingRow";
import ReaderManager from "../../modules/ReaderManager";
import * as moment from 'moment';
import {rootViewTopPadding} from "../../utils/paddingUtils";
import ToggleTagComponent from '../../components/ToggleTagComponent'

const horizontalMargin = 5;

const sliderWidth = Dimensions.get('window').width;
const itemViewWidth = Dimensions.get('window').width * 0.8;
const itemWidth = itemViewWidth + horizontalMargin * 2;

export default class Explore extends React.Component {

    static navigationOptions = ({navigation}) => {
        const {params} = navigation.state;
        return {
            title: params ? params.title : '00:00',
        }
    };

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.haveMore = true;
        this.state = {
            bookmarked: [],
        }
        this._debounceReloadAndSave = _.debounce(this._reloadAndSaveTag, 500);
    }

    componentDidMount() {
        this.props.getArticles(10, 0, "", "");
        // this.props.getPlaylist();
        this.props.getSaved();
        this.props.getSourceList();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this._setUpReadingTime();
        });
        this._setUpReadingTime();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _keyExtractor = (item, index) => index + '';

    _openReadingView = (item) => {

        this.props.navigation.navigate("Reader", {...item, bookmarked: _.findIndex(this.state.bookmarked, (o) => (o === item._id)) !== -1});
    };

    _setUpReadingTime = () => {

        NativeModules.RNUserKit.getProperty(strings.dailyReadingTimeKey, (error, result) => {
            if (!error && result != null) {
                // Get current date
                let dailyReadingTime = _.get(result[0], strings.dailyReadingTimeKey);

                let dateID = getIDOfCurrentDate();
                if (dailyReadingTime == null) {
                    return;
                }

                if (dailyReadingTime[dateID] != null) {

                    this.props.navigation.setParams({
                        title: moment.utc(dailyReadingTime[dateID] * 1000).format('HH:mm:ss')
                    });
                }
            } else {
                console.log(error);
            }
        });
    };

    _onShareItem = (item) => {
        let content = {
            message: _.get(item, 'shortDescription', ''),
            title: _.get(item, 'title', ''),
            url: _.get(item, 'contentId', 'http://www.hasbrain.com/')
        };
        Share.share(content, {subject: 'HasBrain - ' + item.title})
    };

    _onBookmarkItem = (id) => {
        if (_.findIndex(this.state.bookmarked, (o) => (o === id)) !== -1) {
            this.setState({bookmarked: _.filter(this.state.bookmarked, (o) => (o !== id))});
            postRemoveBookmark(id, "articletype").then(value => {
                //console.log("SUCCESS BOOK");
            }).catch((err) => {
                //console.log("ERROR BOOK", err);
            });
        } else {
            this.setState({bookmarked: this.state.bookmarked.concat(id)});
            postCreateBookmark(id, "articletype").then(value => {
                //console.log("SUCCESS BOOK");
            }).catch((err) => {
                //console.log("ERROR BOOK", err);
            });
        }
    };

    _renderVerticalItem = ({item}) => (
        <VerticalRow title={item._source.title}
                     author={item._source.author}
                     time={item._source.sourceCreateAt}
                     readingTime={item._source.readingTime}
                     onClicked={() => this._openReadingView(item._source)}
                     onShare={() => this._onShareItem(item._source)}
                     onBookmark={() => this._onBookmarkItem(item._id)}
                     bookmarked={_.findIndex(this.state.bookmarked, (o) => (o === item._id)) !== -1}
                     image={item._source.sourceImage}/>
    );

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

    _renderHorizontalItem = ({item}) => {
        if (item == null) {
            return null
        }
        return (
            <HorizontalCell style={{alignSelf: 'center', width: itemViewWidth}}
                            title={item.title}
                            author={extractRootDomain(item.contentId)}
                            time={item.createdAt}
                            readingTime={item.readingTime}
                            onClicked={() => this._openReadingView(item)}
                            onShare={() => this._onShareItem(item)}
                            onBookmark={() => this._onBookmarkItem(item._id)}
                            bookmarked={_.findIndex(this.state.bookmarked, (o) => (o === item._id)) !== -1}
                            image={getImageFromArray(item.originalImages, null, null, item.sourceImage)}/>)
    };

    _renderHorizontalSection = ({item, section}) => {
        console.log("HORIZONTAL", section.title);
        if (item == null) {
            return null;
        }
        return (
            <View>
                <Text style={styles.sectionTitle}>{section.title.toUpperCase()}</Text>
                <Carousel
                    data={item}
                    keyExtractor={this._keyExtractor}
                    sliderWidth={sliderWidth}
                    itemWidth={itemWidth}
                    layout={'default'}
                    shouldOptimizeUpdates={false}
                    inactiveSlideOpacity={1}
                    inactiveSlideScale={1}
                    layoutCardOffset={10}
                    superPaddingHorizontal={5}
                    renderItem={this._renderHorizontalItem}
                    containerCustomStyle={styles.horizontalCarousel}/>
            </View>)
    };

    _fetchMore = () => {
        if (this.props.articles.data != null) {
            if (this.props.articles.data.length === this.currentPage * 20) {
                this.currentPage += 1;
                this.props.getArticles(this.currentPage, 20);
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

    _renderTagsItem = ({item}) => {
        const {source} = this.props;
        if (item == null)
            return null;
        if (!source.tagMap)
            return null;
        return (
            <ToggleTagComponent id={item} onPressItem={this._onTagItemPress} isOn={source.tagMap.get(item)}/>
        )
    }

    _onTagItemPress = (id) => {
        const {source} = this.props;
        const {tags, chosenSources} = source;
        let isOn = source.tagMap.get(id);
        let tagMap = new Map(source.tagMap);
        let chosenSourceArray = Array.from(Object.keys(chosenSources));

        if (id == 'All') {
            if (!isOn) {
                tagMap.set(id, !isOn);
                let tagKeyArray = Array.from(tagMap.keys());
                this._debounceReloadAndSave(chosenSourceArray, _.drop(tags));
                for (let tagKey of tagKeyArray) {
                    if (tagKey != 'All') {
                        tagMap.set(tagKey, false);
                    }
                }
            }
        } else {
            if (tagMap.get('All')){
                tagMap.set('All', false);
            }
            let newTagsArray = tags.map((item) => {
                if (tagMap.get(item)) {
                    return item;
                }
            });
            newTagsArray = _.compact(newTagsArray);
            this._debounceReloadAndSave(chosenSourceArray, newTagsArray);
            tagMap.set(id, !isOn);
        }
        this.props.updateUserSourceTag(tagMap);
    }

    _reloadAndSaveTag = (sources, tags) => {
        this.props.getArticles(10, 0, sources, tags);
    }

    render() {
        const {articles, playlist, source} = this.props;
        return (
            <View style={styles.rootView}>
                <View style={styles.searchBar}>
                    <Image style={styles.searchIcon} source={require('../../assets/ic_search.png')}/>
                    <Text style={styles.searchText}>For You</Text>
                    <TouchableOpacity style={{marginRight: 0, marginLeft: 'auto', padding: 10}} onPress={()=>this.props.navigation.navigate('MySource')}>
                        <Image style={[styles.searchIcon]} source={require('../../assets/ic_filter.png')}/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={{marginLeft: 25, marginVertical: 10, height: 50}}
                    keyExtractor={this._keyExtractor}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={source.tags}
                    renderItem={this._renderTagsItem}
                />
                <SectionList
                    refreshing={articles.isFetching}
                    onRefresh={() => this.props.getArticles(10, 0, "", "")}
                    style={styles.alertWindow}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    onEndReached={this._fetchMore}
                    ListFooterComponent={() => this._renderListFooter(articles.isFetching)}
                    onEndReachedThreshold={1}
                    sections={[
                        {
                            data: [playlist.data ? playlist.data : null],
                            title: playlist.title == null ? "" : playlist.title,
                            renderItem: this._renderHorizontalSection
                        },
                        {
                            data: [articles.data],
                            renderItem: this._renderVerticalSection
                        }
                    ]}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.mainWhite
    },
    alertWindow: {
        backgroundColor: colors.mainWhite,
        position: 'relative',
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
    },
    searchBar: {
        flexDirection: 'row',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.grayLine,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginTop: rootViewTopPadding() + 10,
        marginBottom: 15,
        marginHorizontal: 25,
        elevation: 2,
        shadowOffset: {width: 1, height: 1},
        shadowColor: colors.mainDarkGray,
        shadowOpacity: 0.5,
        backgroundColor: colors.mainWhite,
        alignItems: 'center'
    },
    searchIcon: {
        width: 20,
        resizeMode: 'contain',
        aspectRatio: 1
    },
    searchText: {
        marginLeft: 15,
        fontSize: 20,
        color: colors.grayTextSearch
    },
});
