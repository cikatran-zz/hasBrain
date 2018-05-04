import config from './config';
import axios from 'axios';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error'
import {InMemoryCache} from 'apollo-cache-inmemory';
import {NativeModules} from "react-native";
const instance = axios.create({
    serverURL: `${config.serverURL}`
});

const httpLinkContentkit = new HttpLink({
    uri: config.serverURL,
    headers: {
        Authorization: config.authenKeyContentKit}
});

const httpLinkHasbrain = new HttpLink({
    uri: config.serverURL,
    headers: {
        Authorization: config.authenKeyHasbrain}
});

const errorHandler = onError(({networkError}) => {
    switch (networkError.statusCode) {
        case 404:
            return {error: {message: 'Cannot connect to server'}};
        default:
            return {error: {message: 'Unknown error'}};
    }
});

const client = new ApolloClient({
    link: errorHandler.concat(httpLinkContentkit),
    cache: new InMemoryCache()
});

const get = (endpoints) => {
    return instance.get(`${endpoints}`)
        .then((response) => {
            switch (response.status) {
                case 403:
                    return {error: {message: 'Invalid token'}, kickOut: true};
                case 404:
                    return {error: {message: 'Cannot connect to server'}};
                default:
                    return response;
            }
        })
        .catch((err) => {
            throw err;
        });
};

export const getArticles = (page, perPage) => {
    return client.query({
        query: config.queries.articles,
        variables: {page: page, perPage: perPage}
    })
};

export const getPlaylist = () => {
    return client.query({
        query: config.queries.playlist,
    })
};

_getProfileId = ()=> {
    return new Promise((resolve, reject)=> {
        NativeModules.RNUserKitIdentity.getProfileInfo((error, result)=> {
            let profileId = result[0].id;
            console.log(result);
            resolve(profileId);
        })
    });
};

export const getNotification = () => {

    return new Promise((resolve, reject)=>{
        _getProfileId().then(value => {
            fetch(config.hasBrainURL+config.endPoints.highlight+value, {
                method: 'GET',
                headers: config.hasBrainHeader
            }).then(data => {
                resolve(data.json())
            }).catch((err)=> {
                reject(err);
            })
        });
    });

};

export const getSaved = () => {
    return new Promise((resolve, reject)=> {
        _getProfileId().then(value => {
            fetch(config.hasBrainURL + config.endPoints.bookmark + value, {
                method: 'GET',
                headers: config.hasBrainHeader
            }).then(data => {
                resolve(data.json())
            }).catch((err) => {
                reject(err);
            })
        });
    });
};


