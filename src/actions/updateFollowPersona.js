import * as actionTypes from './actionTypes';
import {NativeModules} from "react-native";
const {RNUserKit} = NativeModules;

export function updateFollowPersona(ids) {
    return {
        type: actionTypes.UPDATING_FOLLOW_PERSONA,
        ids: ids
    }
}

export function updateFollowPersonaSuccess(data) {
    return {
        type: actionTypes.UPDATE_FOLLOW_PERSONA_SUCCESS,
        data: data
    }
}


export function updateFollowPersonaFailure(error) {
    return {
        type: actionTypes.UPDATE_FOLLOW_PERSONA_FAILURE,
        errorMessage: error
    }
}