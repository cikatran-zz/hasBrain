import React from 'react'
import {ActivityIndicator, FlatList, SectionList, Text, View, StyleSheet} from 'react-native'
import {colors} from "../../constants/colors";
import VerticalRow from "../../components/VerticalRow";

export default class Explore extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.getArticles(1,20);
    }

    _keyExtractor = (item, index) => index;

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
            renderItem={this._renderVerticalItem} />
    );

    render() {
        const {articles} = this.props;
        if (!articles.fetched || articles.isFetching) {
            return (
                <View style={{flex: 1, justifyContent:'center', alignItems:'center'}}>
                    <ActivityIndicator size="large"/>
                </View>
            );
        }

        return (
            <View style={{flex: 1, flexDirection: 'column'}}>
                <SectionList
                    style={{backgroundColor: colors.mainLightGray, position: 'relative', flex: 1}}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    onEndReachedThreshold={20}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    sections={[
                        {data: [articles.data], renderItem: this._renderVerticalSection}
                    ]}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({

});
