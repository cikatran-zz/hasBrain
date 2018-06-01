import PropTypes from 'prop-types';
import {requireNativeComponent, ViewPropTypes} from 'react-native';

let customWebview = {
    name: 'CustomWebview',
    propTypes: {
        url: PropTypes.string,
        continueReading: PropTypes.object,
        ...ViewPropTypes, // include the default view properties
    },
};

module.exports = requireNativeComponent('RNTCustomWebview', customWebview);