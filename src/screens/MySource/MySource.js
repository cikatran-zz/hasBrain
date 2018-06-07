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
    Share, NativeModules, Platform, Image
} from 'react-native'
import {colors} from '../../constants/colors'
import {getImageFromArray} from "../../utils/imageUtils";
import _ from 'lodash'
import {strings} from "../../constants/strings";
import * as moment from 'moment';
import {rootViewTopPadding} from "../../utils/paddingUtils";
import {navigationTitleStyle} from "../../constants/theme";

export default class MySource extends React.Component {

    constructor(props) {
        super(props);
        this.currentPage = 1;
        this.haveMore = true;
        this.state = {
            bookmarked: [],
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    _keyExtractor = (item, index) => index + '';

    render() {
        return (
            <View style={styles.rootView}>
                <View style={styles.headerView}>
                    <TouchableOpacity style={styles.backButton} onPress={()=>this.props.navigation.goBack()}>
                        <Image style={styles.backIcon} source={require('../../assets/ic_back_button.png')}/>
                    </TouchableOpacity>
                    <Text style={navigationTitleStyle}>My source</Text>
                </View>
                <View>
                    
                </View>
                {/*<SectionList*/}
                    {/*refreshing={}*/}
                    {/*onRefresh={}*/}
                    {/*style={styles.alertWindow}*/}
                    {/*keyExtractor={this._keyExtractor}*/}
                    {/*stickySectionHeadersEnabled={false}*/}
                    {/*showsVerticalScrollIndicator={false}*/}
                    {/*bounces={true}*/}
                    {/*onEndReached={this._fetchMore}*/}
                    {/*ListFooterComponent={() => this._renderListFooter(articles.isFetching)}*/}
                    {/*onEndReachedThreshold={1}*/}
                    {/*sections={}*/}
                {/*/>*/}
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
    headerView: {
        flexDirection: 'row',
        marginTop: rootViewTopPadding() + 10,
        marginHorizontal: 20,
        alignItems: 'center'
    },
    backIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    backButton: {
        padding: 10,
        marginRight: 20
    },
    searchText: {
        marginLeft: 15,
        fontSize: 20,
        color: colors.grayTextSearch
    }
});
