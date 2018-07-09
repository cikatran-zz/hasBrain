import * as actionTypes from './actionTypes';
import {resetAuthToken} from "../api";
import {NativeModules} from "react-native";
const {RNUserKitIdentity} = NativeModules;

export function signOut() {
    RNUserKitIdentity.signOut();
    resetAuthToken();
    return {
        type: actionTypes.SIGN_OUT
    }
}