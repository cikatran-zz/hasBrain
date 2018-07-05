import React from 'react'
import {
    FlatList,
    SectionList,
    View,
    StyleSheet,
} from 'react-native'
import {colors} from '../../../constants/colors'
import _ from 'lodash'
import LoadingRow from "../../../components/LoadingRow";
import PathItem from "../PathItem";
import NoDataView from "../../../components/NoDataView";
import {strings} from "../../../constants/strings";


export default class RecommendPath extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.state = {
            bookmarked: [],
        }
    }

    _keyExtractor = (item, index) => index + '';

    _openPathDetail = (item) => {
        this.props.navigation.navigate("UserPath", item);
    };

    _renderVerticalItem = ({item}) => {

        return (<PathItem title={item.title}
                          shortDescription={item.shortDescription}
                          contributors={[item.profileId]}
                          onClicked={() => this._openPathDetail(item)}/>)
    };

    _renderVerticalSection = ({item}) => (
        <FlatList
            style={{flex: 1}}
            horizontal={false}
            showsVerticalScrollIndicator={false}
            data={item}
            //ItemSeparatorComponent={() => this._renderVerticalSeparator()}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVerticalItem}/>
    );

    _fetchMore = () => {
        const {pathRecommend: {count, page, isFetching}} = this.props;
        if (count > page*10 && !isFetching) {
            this.props.getPathRecommend(page+1, 10)
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
                flexDirection: 'column',
                backgroundColor: colors.lightGray
            },this.props.style]}>
                <SectionList
                    refreshing={pathRecommend.isFetching}
                    onRefresh={() => {
                        this.props.getPathRecommend(1,10);
                    }}
                    style={styles.alertWindow}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    onEndReached={this._fetchMore}
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
        marginTop: 20,
        backgroundColor: colors.lightGray,
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
