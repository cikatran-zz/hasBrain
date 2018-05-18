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

const getAuthToken = () => {
    return new Promise((resolve, reject)=> {
        NativeModules.RNUserKitIdentity.getProfileInfo((error, result)=> {
            let authToken = result[0].authToken;
            resolve(authToken);
        })
    });
};

const getApolloClient = () => {
     return new Promise((resolve, reject)=> {
         getAuthToken().then((authToken)=> {
             const httpLinkContentkit = new HttpLink({
                 uri: config.serverURL,
                 headers: {
                     authorization: config.authenKeyContentKit,
                     usertoken: authToken,
                 }
             });
             resolve(new ApolloClient({
                 link: errorHandler.concat(httpLinkContentkit),
                 cache: new InMemoryCache()
             }))
         })
     });

};

const postApolloClient = (body) => {
    return new Promise((resolve, reject)=> {
        getAuthToken().then((authToken)=> {
            const httpLinkContentkit = new HttpLink({
                uri: config.serverURL,
                headers: {
                    authorization: config.authenKeyContentKit,
                    usertoken: authToken
                },
                method: 'POST',
                body: JSON.stringify(body)
            });
            resolve(new ApolloClient({
                link: httpLinkContentkit,
                cache: new InMemoryCache()
            }))
        })
    });

};

const gqlPost = (query) => {
    return new Promise((resolve, reject)=> {
        postApolloClient().then((client)=> {
            client.mutate(query).then((result)=>{
                resolve(result)
            }).catch((err)=> {
                reject(err)
            })
        })
    });
};


const httpLinkHasbrain = new HttpLink({
    uri: config.serverURL,
    headers: {
        Authorization: config.authenKeyHasbrain
    }
});

const errorHandler = onError(({networkError}) => {
    if (networkError == null) {
        return {error: {message: 'Unknown error'}};
    }
    switch (networkError.statusCode) {
        case 404:
            return {error: {message: 'Cannot connect to server'}};
        default:
            return {error: {message: 'Unknown error'}};
    }
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

const gqlQuery = (query) => {
    return new Promise((resolve, reject)=> {
        getApolloClient().then((client)=> {
            client.query(query).then((result)=>{
                resolve(result)
            }).catch((err)=> {
                reject(err)
            })
        })
    });
};

export const getArticles = (page, perPage) => {
    return gqlQuery({
        query: config.queries.articles,
        variables: {page: page, perPage: perPage}
    })
};

export const getPlaylist = () => {
    return gqlQuery({
        query: config.queries.playlist,
    })
};

export const postBookmark = (id) => {
    return gqlPost({
        mutation: config.mutation.bookmark,
        variables: {id: id}
    })
};

export const postUnbookmark = (id) => {
    return gqlPost({
        mutation: config.mutation.unbookmark,
        variables: {id: id}
    })
};

export const postCreateUser = (profileId, name) => {
    return gqlPost({
        mutation: config.mutation.createUser,
        variables: {profileId: profileId, name: name}
    })
};

export const postUserInterest = (segments, intents) => {
    return gqlPost({
        mutation: config.mutation.userInterest,
        variables: {segments: segments, intentIds: intents}
    })
};

_getProfileId = ()=> {
    return new Promise((resolve, reject)=> {
        NativeModules.RNUserKitIdentity.getProfileInfo((error, result)=> {
            let profileId = result[0].id;
            resolve(profileId);
        })
    });
};

export const getOnboardingInfo = () => {
    return gqlQuery({
        query: config.queries.onboardingInfo
    })
};

export const getSaved = (page, perPage) => {
    return gqlQuery({
        query: config.queries.bookmark,
        variables: {page: page, perPage: perPage}
    });
};


