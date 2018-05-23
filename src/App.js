import codePush from "react-native-code-push";
import React, {Component} from "react";
import {Provider} from "react-redux";
import configureStore from './configureStore'
import AppNavigator from "./AppNavigator";
import { PersistGate } from 'redux-persist/integration/react';
import {Image, View} from 'react-native'
import {colors} from "./constants/colors";
const { persistor, store } = configureStore();

const hasBrainPic = require('./assets/ic_hasbrain.png')
class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate
                    loading={
                        <View style={{flex: 1, justifyContent:'center', alignItems:'center', backgroundColor: colors.mainLightGray}}>
                            <Image source={hasBrainPic}/>
                        </View>
                    } persistor={persistor}>
                    <AppNavigator />
                </PersistGate>
            </Provider>
        );
    }
}

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };
export default App = codePush(codePushOptions)(App)
