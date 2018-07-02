import * as actionTypes from './actionTypes';
import {NativeModules} from "react-native";
const {RNUserKit} = NativeModules;

export function createUser() {
    return {
        type: actionTypes.CREATING_USER
    }
}

export function createUserSuccess() {
    return {
        type: actionTypes.CREATE_USER_SUCCESS
    }
}


export function createUserFailure(error) {
    return {
        type: actionTypes.CREATE_USER_FAILURE,
        errorMessage: error
    }
}