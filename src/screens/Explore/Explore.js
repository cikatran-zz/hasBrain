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
import {colors} from '../../constants/colors'
import VerticalRow from '../../components/VerticalRow'
import HorizontalCell from '../../components/HorizontalCell'
import Carousel from '../../components/CustomCarousel'
import {getImageFromArray} from "../../utils/imageUtils";
import _ from 'lodash'
import {postBookmark, postUnbookmark} from "../../api";
import {strings} from "../../constants/strings";
import {formatReadingTimeInMinutes, getIDOfCurrentDate} from "../../utils/dateUtils";
import {extractRootDomain} from "../../utils/stringUtils";
import LoadingRow from "../../components/LoadingRow";
import ReaderManager from "../../modules/ReaderManager";
import * as moment from 'moment';



const horizontalMargin = 5;

const sliderWidth = Dimensions.get('window').width;
const itemViewWidth = Dimensions.get('window').width * 0.8;
const itemWidth = itemViewWidth + horizontalMargin * 2;

export default class Explore extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
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
    }

    componentDidMount() {
        this.props.getArticles(1, 20);
        this.props.getPlaylist();
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
        ReaderManager.sharedInstance._open(item, _.findIndex(this.state.bookmarked, (o)=>(o === item._id)) !== -1, ()=> {
            this._setUpReadingTime();
        });
    };

    _setUpReadingTime = () => {

        NativeModules.RNUserKit.getProperty(strings.dailyReadingTimeKey, (error, result) => {
            if (!error && result != null) {
                // Get current date
                let dailyReadingTime = _.get(result[0], strings.dailyReadingTimeKey);

                let dateID = getIDOfCurrentDate();

                if (dailyReadingTime[dateID] != null) {

                    this.props.navigation.setParams({
                        title: moment.utc(dailyReadingTime[dateID]*1000).format('HH:mm:ss')
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
        if (_.findIndex(this.state.bookmarked, (o)=>(o === id)) !== -1) {
            this.setState({bookmarked: _.filter(this.state.bookmarked, (o)=>(o !== id))});
            postUnbookmark(id).then(value => {
                //console.log("SUCCESS BOOK");
            }).catch((err)=> {
                //console.log("ERROR BOOK", err);
            });
        } else {
            this.setState({bookmarked: this.state.bookmarked.concat(id)});
            postBookmark(id).then(value => {
                //console.log("SUCCESS BOOK");
            }).catch((err)=> {
                //console.log("ERROR BOOK", err);
            });
        }
    };

    _renderVerticalItem = ({item}) => (
        <VerticalRow title={item.title}
                     author={extractRootDomain(item.contentId)}
                     time={item.createdAt}
                     readingTime={item.readingTime}
                     onClicked={() => this._openReadingView(item)}
                     onShare={()=>this._onShareItem(item)}
                     onBookmark={()=>this._onBookmarkItem(item._id)}
                     bookmarked={_.findIndex(this.state.bookmarked, (o)=>(o === item._id)) !== -1}
                     image={getImageFromArray(item.originalImages, null, null, item.sourceImage)}/>
    );

    _renderVerticalSeparator = ()=>(
        <View style={styles.horizontalItemSeparator}/>
    );

    _renderVerticalSection = ({item}) => (
        <FlatList
            style={{flex: 1}}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={item}
            ItemSeparatorComponent={()=>this._renderVerticalSeparator()}
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
                            onShare={()=>this._onShareItem(item)}
                            onBookmark={()=>this._onBookmarkItem(item._id)}
                            bookmarked={_.findIndex(this.state.bookmarked, (o)=>(o === item._id)) !== -1}
                            image={getImageFromArray(item.originalImages, null, null, item.sourceImage)}/>)
    };

    _renderHorizontalSection = ({item}) => (
        item ? <Carousel
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
            containerCustomStyle={styles.horizontalCarousel}/> : null
    );

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

    render() {
        const {articles, playlist} = this.props
        // if (articles.error === true || playlist.error === true) {
        //     return null
        // }

        return (
            <View style={{
                flex: 1,
                flexDirection: 'column'
            }}>
                <SectionList
                    refreshing={articles.isFetching}
                    onRefresh={() => this.props.getArticles(1, 20)}
                    style={styles.rootView}
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
    }
});
