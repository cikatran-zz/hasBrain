import React from 'react'
import {ActivityIndicator, FlatList, SectionList, Text, View, StyleSheet} from 'react-native'
import {colors} from "../../constants/colors";
import VerticalRow from "../../components/VerticalRow";
import HorizontalCell from "../../components/HorizontalCell";

export default class Explore extends React.PureComponent {

    constructor(props) {
        super(props);
        this.currentPage = 1;
    }

    componentDidMount() {
        this.props.getArticles(1,20);
        this.props.getPlaylist();
    }

    _keyExtractor = (item, index) => index + "";

    _renderVerticalItem = ({item}) => (
        <VerticalRow title={item.title} author={item.author} time={item.sourceCreateAt}/>
    );

    _renderVerticalSection = ({item}) => (

        <FlatList
            style={{flex: 1}}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={item}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVerticalItem}/>
    );

    _renderHorizontalItem = ({item}) => (
        <HorizontalCell title={item.title} author={item.author} time={item.sourceCreateAt}/>
    );

    _renderHorizontalFooter = () => (
        <View style={{
            width: 10,
            height: 10,
            backgroundColor: 'transparent'
        }}/>
    );

    _renderHorizontalSection = ({item}) => (
        <FlatList
            style={{paddingHorizontal: 10}}
            horizontal={true}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={item}
            keyExtractor={this._keyExtractor}
            ListFooterComponent={this._renderHorizontalFooter}
            renderItem={this._renderHorizontalItem} />
    );

    _fetchMore = () => {
        this.currentPage += 1;
        this.props.getArticles(this.currentPage,20);
    };

    _renderListFooter = (isFetching) => {
        return (
            <View style={{justifyContent:'center', alignItems:'center', height: 200}}>
                <ActivityIndicator size="large"/>
            </View>
        );
    };

    render() {
        const {articles, playlist} = this.props;
        if (articles.error === true || playlist.error === true) {
            return null;
        }
        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <SectionList
                    refreshing={articles.isFetching}
                    onRefresh={() => this.props.getArticles(1,20)}
                    style={{backgroundColor: colors.mainLightGray, position: 'relative', flex: 1}}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    onEndReached={this._fetchMore}
                    ListFooterComponent={()=>this._renderListFooter(articles.isFetching)}
                    onEndReachedThreshold={1}
                    sections={[
                        {data: [playlist.data], renderItem: this._renderHorizontalSection},
                        {data: [articles.data], renderItem: this._renderVerticalSection}
                    ]}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({

});
