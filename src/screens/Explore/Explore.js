import React from 'react'
import {
    FlatList,
    SectionList,
    TouchableWithoutFeedback,
    View,
    StyleSheet,
    Dimensions,
    Share, NativeModules, Platform, Image,
    Animated,
    StatusBar, Alert
} from 'react-native'
import {colors} from '../../constants/colors'
import VerticalRow from '../../components/VerticalRow'
import HorizontalCell from '../../components/HorizontalCell'
import Carousel from '../../components/CustomCarousel'
import {getImageFromArray} from "../../utils/imageUtils";
import _ from 'lodash'
import {strings} from "../../constants/strings";
import {formatReadingTimeInMinutes, getIDOfCurrentDate} from "../../utils/dateUtils";
import {extractRootDomain} from "../../utils/stringUtils";
import LoadingRow from "../../components/LoadingRow";
import * as moment from 'moment';
import {rootViewTopPadding} from "../../utils/paddingUtils";
import HBText from '../../components/HBText'
import {DotsLoader} from 'react-native-indicator';
import ActionSheet from "react-native-actionsheet";
import ToggleTagComponent from "../../components/ToggleTagComponent";

const horizontalMargin = 5;

const sliderWidth = Dimensions.get('window').width;
const itemViewWidth = Dimensions.get('window').width * 0.8;
const itemWidth = itemViewWidth + horizontalMargin * 2;

const {RNUserKit} = NativeModules;

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
            _animated: new Animated.Value(1)
        };
        this.offset = 0;
        this._currentPositionVal = 1;
        this._scrollView = null;
        this.rank = null;
        this._debounceReloadAndSave = _.debounce(this._reloadAndSaveTag, 500);
    }

    componentDidMount() {
        this.props.getSaved();
        this.props.getSourceList();
        this.props.getFeed(1, 10, null, null);
        this.props.getBookmarkedIds();
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            this._setUpReadingTime();
            StatusBar.setBarStyle('dark-content');
            (Platform.OS !== 'ios') && StatusBar.setBackgroundColor('transparent');
        });
        this._setUpReadingTime();
    }

    componentWillUnmount() {
        this._navListener.remove();
    }

    _keyExtractor = (item, index) => index + '';

    _openReadingView = (item) => {
        const {bookmarkedIds} = this.props;
        let bookmarkedArticles = _.get(bookmarkedIds, 'data.articles', []);

        this.props.navigation.navigate("Reader", {
            ...item,
            bookmarked: _.findIndex(bookmarkedArticles, (o) => (o === item._id)) !== -1
        });
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

    _onMoreButtonClicked = (item) => {
        this.ActionSheet.show();
        this.currentInteractionItem = item;
    };

    _onActionSheetButtonClicked = (index) => {
        if (index === 0) {
            this._onShareItem();
        } else {
            this._onDislikeItem();
        }
    };

    _onShareItem = () => {
        let content = {
            message: _.get(this.currentInteractionItem, 'shortDescription', ''),
            title: _.get(this.currentInteractionItem, 'title', ''),
            url: _.get(this.currentInteractionItem, 'contentId', 'http://www.hasbrain.com/')
        };
        Share.share(content, {subject: 'HasBrain - ' + _.get(this.currentInteractionItem, 'title', '')})
    };

    _onDislikeItem = () => {
        let props = {
            [strings.contentEvent.contentId]: _.get(this.currentInteractionItem, '_id', ''),
            [strings.contentEvent.mediaType]: strings.trackingType.article
        };
        RNUserKit.track(strings.contentDislike.event, props);
    };

    _onBookmarkItem = (id) => {
        const {bookmarkedIds} = this.props;
        let bookmarkedArticles = _.get(bookmarkedIds, 'data.articles', []);
        if (_.findIndex(bookmarkedArticles, (o) => (o === id)) !== -1) {
            this.props.removeBookmark(id, strings.bookmarkType.article, strings.trackingType.article);
        } else {
            this.props.createBookmark(id, strings.bookmarkType.article, strings.trackingType.article);
        }
    };

    _renderVerticalItem = ({item, index}) => {
        const {bookmarkedIds, source} = this.props;
        let bookmarkedArticles = _.get(bookmarkedIds, 'data.articles', []);

        let category = item.topicId;
        if (source.tagMap.get('ALL')) {
            category = item.reason;
        }

        if (item.actionType === "highlight") {
            console.log("Highlight",category);
        }

        return (
            <VerticalRow style={{marginTop: (index === 0) ? -20 : 0}}
                         title={_.get(item, 'contentData.title', '')}
                         shortDescription={_.get(item, 'contentData.shortDescription', '')}
                         sourceName={_.get(item, 'sourceData.title', '')}
                         sourceCommentCount={_.get(item, 'contentData.sourceCommentCount')}
                         sourceActionName={_.get(item, 'contentData.sourceActionName')}
                         sourceActionCount={_.get(item, 'contentData.sourceActionCount')}
                         sourceImage={_.get(item, 'sourceData.sourceImage', '')}
                         category={category}
                         highlightData={item.highlightData}
                         time={_.get(item, 'contentData.sourceCreatedAt', '')}
                         readingTime={_.get(item, 'contentData.readingTime', '')}
                         onClicked={() => this._openReadingView({...item.contentData})}
                         onMore={() => this._onMoreButtonClicked(item.contentData)}
                         onBookmark={() => this._onBookmarkItem(_.get(item, 'contentData._id', ''))}
                         bookmarked={_.findIndex(bookmarkedArticles, (o) => (o === _.get(item, 'contentData._id'))) !== -1}
                         image={_.get(item, 'contentData.sourceImage', '')}/>
        );
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
            renderItem={this._renderVerticalItem}
            removeClippedSubviews/>
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
                            onShare={() => this._onMoreButtonClicked(item)}
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
                <HBText style={styles.sectionTitle}>{section.title.toUpperCase()}</HBText>
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
        const {feed} = this.props;
        const {data, count, isFetching, rank} = feed;
        if (data != null && count > 10 && !isFetching) {
            this.props.getFeed(1, 10, rank, null)
        }
    };

    _renderListFooter = (isFetching) => {
        if (isFetching) {
            return (
                <LoadingRow/>
            )
        } else {
            return <View style={{height: 200}}/>;
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
    };

    _onTagItemPress = (id) => {
        if (id === "_filter") {
            this.props.navigation.navigate('MySource')
            return;
        }
        const {source} = this.props;
        const {tags} = source;
        let isOn = source.tagMap.get(id);
        let tagMap = new Map(source.tagMap);

        if (id === 'ALL') {
            if (!isOn) {
                tagMap.set(id, !isOn);
                let tagKeyArray = Array.from(tagMap.keys());
                this._debounceReloadAndSave(null);
                for (let tagKey of tagKeyArray) {
                    if (tagKey !== 'ALL') {
                        tagMap.set(tagKey, false);
                    }
                }
            }
        } else {

            let newTagsArray = tags.map((item) => {
                if (tagMap.get(item)) {
                    return item;
                }
            });
            newTagsArray = _.compact(newTagsArray);
            if (isOn && newTagsArray.length < 2) {
                Alert.alert('Oops!', 'You must select at least 1 tag', [
                    {text: 'Got it!'},
                ])
            } else {
                tagMap.set(id, !isOn);
                if (!isOn) {
                    newTagsArray.push(id);
                } else {
                    _.remove(newTagsArray, (x) => x === id);
                }
                this._debounceReloadAndSave(newTagsArray);
            }
            if (tagMap.get('ALL')) {
                tagMap.set('ALL', false);
            }
        }
        this.props.updateUserSourceTag(tagMap);

    };

    _reloadAndSaveTag = (topics) => {
        this.props.getFeed(1, 10, null, topics)
        RNUserKit.storeProperty({[strings.chosenTopicsKey]: topics}, (e,r)=> {})
    };

    _onScroll = (event) => {
        const {feed} = this.props;
        let currentOffset = event.nativeEvent.contentOffset.y;
        const dif = currentOffset - (this.offset || 0);
        let endOffset = event.nativeEvent.layoutMeasurement.height + currentOffset;

        // Check data is not null
        if (feed.data == null || feed.data.length === 0) {
            this._currentPositionVal = 0;
            Animated.spring(this.state._animated, {
                toValue: 0,
                friction: 7,
                tension: 40,
            }).start();
            return
        }
        if (Math.abs(dif) < 0) {
        } else if ((dif < 0 || currentOffset <= 0) && (endOffset < event.nativeEvent.contentSize.height)) {
            // Show
            this._currentPositionVal = Math.max(this._currentPositionVal - Math.abs(dif) / 67, 0);
            Animated.spring(this.state._animated, {
                toValue: this._currentPositionVal * 67,
                friction: 7,
                tension: 40,
                //useNativeDriver: true,
            }).start();
        } else {

            // Hide
            this._currentPositionVal = Math.min(Math.abs(dif) / 67 + this._currentPositionVal, 1);
            Animated.spring(this.state._animated, {
                toValue: this._currentPositionVal * 67,
                friction: 7,
                tension: 40,
                //useNativeDriver: true,
            }).start();
        }
        this.offset = currentOffset;
    };

    _onScrollEnd = (event) => {
        if (this._currentPositionVal < 0.5) {
            // Show
            this._currentPositionVal = 0;
            Animated.spring(this.state._animated, {
                toValue: 0,
                friction: 7,
                tension: 40,
            }).start();
        } else {
            // Hide
            this._currentPositionVal = 1;
            Animated.spring(this.state._animated, {
                toValue: 67,
                friction: 7,
                tension: 40,
            }).start();
        }
    };

    _animatedStyle = () => ([
        styles.topView,
        {
            opacity: this.state._animated.interpolate({
                inputRange: [0, 50, 67],
                outputRange: [1, 0.9, 0],
                extrapolate: 'clamp',
            }),
            transform: [{
                translateY: this.state._animated.interpolate({
                    inputRange: [0, 67],
                    outputRange: [0, -67],
                    extrapolate: 'clamp',
                }),
            }],
        }
    ]);

    _renderLoading = (fetching) => (
        <View style={[styles.loadingView, {opacity: fetching ? 1 : 0}]}>
            <DotsLoader color={colors.mainDarkGray} size={10} betweenSpace={10}/>
        </View>);

    render() {
        const {feed, saved, source} = this.props;
        return (
            <View style={styles.rootView}>
                <StatusBar
                    translucent={true}
                    backgroundColor='#00000000'
                    barStyle='dark-content'/>
                <ActionSheet
                    ref={o => this.ActionSheet = o}
                    options={['Share via ...', 'Show fewer articles like this', 'Cancel']}
                    cancelButtonIndex={2}
                    onPress={this._onActionSheetButtonClicked}
                />
                <View style={styles.headerBackgroundView}/>
                <View style={styles.contentView}>
                    <SectionList
                        ref={(ref) => this._scrollView = ref}
                        contentContainerStyle={{marginTop: 67, marginBottom: 0}}
                        refreshing={false}
                        onRefresh={() => this.props.getFeed(1, 10, null, null)}
                        onScrollEndDrag={this._onScrollEnd}
                        onScroll={this._onScroll}
                        scrollEventThrottle={16}
                        keyExtractor={this._keyExtractor}
                        stickySectionHeadersEnabled={false}
                        showsVerticalScrollIndicator={false}
                        bounces={true}
                        onEndReached={this._fetchMore}
                        ListHeaderComponent={this._renderLoading(feed.isFetching)}
                        ListFooterComponent={() => this._renderListFooter(feed.isFetching)}
                        onEndReachedThreshold={0.5}
                        sections={[
                            {
                                data: [feed.data],
                                renderItem: this._renderVerticalSection
                            }
                        ]}
                    />
                    <Animated.View style={this._animatedStyle()}>
                        {/*<TouchableWithoutFeedback onPress={() => this.props.navigation.navigate('MySource')}>*/}
                            {/*<View style={styles.searchBar}>*/}
                                {/*<Image style={styles.searchIcon} source={require('../../assets/ic_search.png')}/>*/}
                                {/*<HBText style={styles.searchText}>For you</HBText>*/}

                            {/*</View>*/}
                        {/*</TouchableWithoutFeedback>*/}
                        <FlatList
                            style={{marginLeft: 25, marginBottom: 0, marginTop: 10, height: 50}}
                            keyExtractor={this._keyExtractor}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={['_filter'].concat(source.tags)}
                            renderItem={this._renderTagsItem}
                        />
                    </Animated.View>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    loadingView: {
        alignSelf: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        width: 60,
        height: 20,
    },
    headerBackgroundView: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: rootViewTopPadding(),
        backgroundColor: colors.mainWhite
    },
    rootView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.lightGray,

    },
    contentView: {
        flex: 1,
        flexDirection: 'column',
        marginTop: rootViewTopPadding(),
        overflow: 'hidden'
    },
    topView: {
        flexDirection: 'column',
        position: 'absolute',
        backgroundColor: colors.mainWhite,
        height: 67,
        left: 0,
        right: 0
    },
    sectionView: {
        width: '100%',
        flexDirection: 'column'
    },
    alertWindow: {
        backgroundColor: colors.mainWhite,
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
        borderRadius: 3,
        borderWidth: 1,
        borderColor: colors.whiteGray,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginTop: 5,
        marginBottom: 15,
        marginHorizontal: 25,
        backgroundColor: colors.lightGray,
        height: 49,
        alignItems: 'center'
    },
    searchIcon: {
        width: 20,
        resizeMode: 'contain',
        aspectRatio: 1,
        tintColor: '#A6B2C4'
    },
    searchText: {
        marginLeft: 15,
        fontSize: 14,
        color: colors.grayTextSearch,
        opacity: 0.5
    },
});
