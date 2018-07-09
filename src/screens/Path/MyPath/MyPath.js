import React from 'react'
import {
    FlatList,
    SectionList,
    View,
    StyleSheet,
} from 'react-native'
import {colors} from '../../../constants/colors'
import LoadingRow from "../../../components/LoadingRow";
import PathItem from "../PathItem";
import NoDataView from "../../../components/NoDataView";


export default class MyPath extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.state = {
            deleteItems: []
        };
        this.rows = {};
    }

    componentDidMount() {
        //this.props.getPathCurrent()
    }

    _keyExtractor = (item, index) => index + '';

    _openPathDetail = (item) => {
        this.props.navigation.navigate("UserPath", item);

    };

    _renderVerticalItem = ({item}) => {
        if (item == null) {
            return null;
        }
        return (<PathItem title={item._source.title}
                          shortDescription={item._source.shortDescription}
                          contributors={[item._source.profileId]}
                          onClicked={() => this._openPathDetail(item)}/>)
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
            //ItemSeparatorComponent={() => this._renderVerticalSeparator()}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderVerticalItem}/>
    );

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
        const {pathCurrent} = this.props;
        return (
            <View style={[{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: colors.lightGray
            },this.props.style]}>
                <SectionList
                    refreshing={pathCurrent.isFetching}
                    onRefresh={() => {
                        this.setState({deleteItems: []});
                        this.props.getPathCurrent();
                        this.currentPage = 1;
                    }}
                    style={styles.alertWindow}
                    keyExtractor={this._keyExtractor}
                    stickySectionHeadersEnabled={false}
                    showsVerticalScrollIndicator={false}
                    bounces={true}
                    ListFooterComponent={() => this._renderListFooter(pathCurrent.isFetching)}
                    ListEmptyComponent={this._renderEmptyList(pathCurrent.isFetching)}
                    onEndReachedThreshold={0.5}
                    sections={[
                        {
                            data: [pathCurrent.data],
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
