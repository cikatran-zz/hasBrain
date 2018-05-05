import React from 'react'
import {
    ActivityIndicator,
    FlatList,
    SectionList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Dimensions
} from 'react-native'
import { colors } from '../../constants/colors'
import VerticalRow from '../../components/VerticalRow'
import HorizontalCell from '../../components/HorizontalCell'
import Carousel from '../../components/CustomCarousel'

const horizontalMargin = 5;

const sliderWidth = Dimensions.get('window').width;
const itemViewWidth = Dimensions.get('window').width * 0.8;
const itemWidth = itemViewWidth + horizontalMargin * 2;

export default class Explore extends React.PureComponent {

    constructor(props) {
        super(props);
        this.currentPage = 1
    }

    componentDidMount() {
        this.props.getArticles(1, 20);
        this.props.getPlaylist()
    }

    _keyExtractor = (item, index) => index + ''

    _renderVerticalItem = ({ item }) => (
        <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('Reader', {url: item.url})
        }}>
            <VerticalRow title={item.title} author={item.author} time={item.sourceCreateAt}
            />
        </TouchableOpacity>
    );

    _renderVerticalSection = ({ item }) => (
        <FlatList
            style={{ flex: 1 }}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVerticalItem}/>
    )

    _renderHorizontalItem = ({ item }) => {
        if (item == null) {
            return null
        }
        return (<HorizontalCell style={{alignSelf: 'center', width: itemViewWidth}} title={item.title} author={item.author} time={item.sourceCreateAt} url={item.url} navigation={this.props.navigation}/>)
    };

    _renderHorizontalFooter = () => (
        <View style={{
            width: 10,
            height: 10,
            backgroundColor: 'transparent'
        }}/>
    )

    _renderHorizontalSection = ({ item }) => (
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
            ListFooterComponent={this._renderHorizontalFooter}
            renderItem={this._renderHorizontalItem}/> : null
    );

    _fetchMore = () => {
        this.currentPage += 1
        this.props.getArticles(this.currentPage, 20)
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
        const { articles, playlist } = this.props
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
                    style={{
                        backgroundColor: colors.mainLightGray,
                        position: 'relative',
                        flex: 1
                    }}
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

const styles = StyleSheet.create({})
