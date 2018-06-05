import PropTypes from 'prop-types';
import {requireNativeComponent, ViewPropTypes} from 'react-native';

let customWebview = {
    name: 'CustomWebview',
    propTypes: {
        source: PropTypes.string,
        initPosition: PropTypes.object,
        ...ViewPropTypes, // include the default view properties
    },
};

module.exports = requireNativeComponent('RNCustomWebview', customWebview);