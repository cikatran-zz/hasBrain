import * as actionTypes from './actionTypes'

export function trackEvent(name, properties) {
    return {
        type: actionTypes.TRACK_USERKIT_EVENT,
        name: name,
        properties: properties
    }
}