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
    Share
} from 'react-native'
import {colors} from '../../constants/colors'
import VerticalRow from '../../components/VerticalRow'
import HorizontalCell from '../../components/HorizontalCell'
import Carousel from '../../components/CustomCarousel'
import {getImageFromArray} from "../../utils/imageUtils";
import _ from 'lodash'
import {postBookmark, postUnbookmark} from "../../api";

const horizontalMargin = 5;

const sliderWidth = Dimensions.get('window').width;
const itemViewWidth = Dimensions.get('window').width * 0.8;
const itemWidth = itemViewWidth + horizontalMargin * 2;

export default class Explore extends React.PureComponent {

    constructor(props) {
        super(props);
        this.currentPage = 1
        this.state = {
            bookmarked: []
        }
    }

    componentDidMount() {
        this.props.getArticles(1, 20);
        this.props.getPlaylist()
    }

    _keyExtractor = (item, index) => index + '';

    _openReadingView = (url) => {
        this.props.navigation.navigate('Reader', {url: url})
    };

    _onShareItem = (item) => {
        let content = {
            message: _.get(item, 'shortDescription', ''),
            title: _.get(item, 'title', ''),
            url: _.get(item, 'url', 'http://www.hasbrain.com/')
        };
        console.log(content);
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
                     author={item.author}
                     time={item.sourceCreateAt}
                     readingTime={item.readingTime}
                     onClicked={() => this._openReadingView(item.url)}
                     onShare={()=>this._onShareItem(item)}
                     onBookmark={()=>this._onBookmarkItem(item._id)}
                     bookmarked={_.findIndex(this.state.bookmarked, (o)=>(o === item._id)) !== -1}
                     image={getImageFromArray(item.originalImages, null, null)}/>
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
                            author={item.author}
                            time={item.sourceCreateAt}
                            url={item.url}
                            onClicked={() => this._openReadingView(item.url)}
                            image={getImageFromArray(item.originalImages, null, null)}/>)
    };

    _renderHorizontalSection = ({item}) => (
        item ? <Carousel
            data={item}
            keyExtractor={this._keyExtractor}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            layout={'default'}
            inactiveSlideOpacity={1}
            inactiveSlideScale={1}
            layoutCardOffset={10}
            paddingHorizontal={5}
            renderItem={this._renderHorizontalItem}
            containerCustomStyle={styles.horizontalCarousel}/> : null
    );

    _fetchMore = () => {
        if (this.props.articles.data != null) {
            if (this.props.articles.data.length % 20 === 0) {
                this.currentPage += 1;
                this.props.getArticles(this.currentPage, 20);
            }
        }
    };

    _renderListFooter = (isFetching) => {
        return (
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 200
            }}>
                <ActivityIndicator size="large"/>
            </View>
        )
    }

    render() {
        const {articles, playlist} = this.props
        if (articles.error === true || playlist.error === true) {
            return null
        }
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
