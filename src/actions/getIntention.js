import * as actionTypes from './actionTypes';
import _ from 'lodash'

export function getIntents(segments) {
    return {
        type: actionTypes.FETCHING_INTENT,
        segments: segments
    }
}

export function getIntentsSuccess(data) {
    let selectedIntents = data.viewer.intentMany.map((intent)=>{
        let res = _.cloneDeep(intent);
        res.children = intent.children.filter((x)=>x.recommended);
        return res;
    });

    return {
        type: actionTypes.FETCH_INTENT_SUCCESS,
        data: {all: data.viewer.intentMany, selected: selectedIntents},
    }
}


export function getIntentsFailure(error) {
    return {
        type: actionTypes.FETCH_INTENT_FAILURE,
        errorMessage: error
    }
}