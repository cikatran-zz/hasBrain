import React from 'react'
import { WebView } from 'react-native'


export default class Reader extends React.PureComponent {
    render() {
        return (
            <WebView source={{ uri: this.props.navigation.state.params.url }}></WebView>
        )
    }
}
