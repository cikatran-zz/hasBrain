import config from './config';
import axios from 'axios';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error'
import {InMemoryCache} from 'apollo-cache-inmemory';
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
    console.log(page,perPage);
    return client.query({
        query: config.queries.articles,
        //variables: {page: page, perPage: perPage}
    })
};
export const getNotification = () => {
    return fetch('http://hasbrain-api.mstage.io/highlight?profile_id=5ad85caf0a553e680e7e28a6', {
        method: 'GET',
        headers: {
            'x-hasbrain-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVhYjMzNzI1ZTZlOTFlMGNlMDk4OWRlNCIsImlhdCI6MTUxNjIzOTAyMn0.anJXLAhnRxz37NxmiKtzk76KBZCH1RQXV1DuQCy1wMc'
        }
    }).then(data => {
        return data
    })
}
