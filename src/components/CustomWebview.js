import PropTypes from 'prop-types';
import {requireNativeComponent, ViewPropTypes} from 'react-native';

let customWebview = {
    name: 'CustomWebview',
    propTypes: {
        source: PropTypes.string,
        topInset: PropTypes.number,
        initPosition: PropTypes.object,
        highlights: PropTypes.array,
        onHighlight: PropTypes.func,
        onUrlChanged: PropTypes.func,
        onLoadingChanged: PropTypes.func,
        onNavigationChanged: PropTypes.func,
        onScrollEnd: PropTypes.func,
        onScroll: PropTypes.func,
        onScrollEndDragging: PropTypes.func,
        ...ViewPropTypes, // include the default view properties
    },
};

module.exports = requireNativeComponent('RNCustomWebview', customWebview);