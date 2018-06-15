import config from './config';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error'
import {InMemoryCache} from 'apollo-cache-inmemory';
import {NativeModules} from "react-native";
import {strings} from "../constants/strings";
import _ from 'lodash';

const {RNCustomWebview, RNUserKit} = NativeModules;
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
            console.log("Auth", authToken);
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

export const getUserHighLight = (page, perPage) => {
    return gqlQuery({
        query: config.queries.userHighlight,
        variables: {page: page, perPage: perPage}
    })
}

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

export const postCreateIntent = (name) => {
    return gqlPost({
        mutation: config.mutation.createIntent,
        variables: {name: name}
    });
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

export const postArticleCreateIfNotExist = (article) => {
    return gqlPost({
        mutation: config.mutation.articleCreateIfNotExist,
        variables: {record: article}
    })
};

export const postHighlightText = (articleId, text) => {
    return gqlPost({
        mutation: config.mutation.highlightText,
        variables: { articleId: articleId, highlightedText: text}
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

export const getUserProfile = () => {
    return new Promise((resolve, reject) => {
        RNUserKit.getProperty(strings.mekey, (error, result) => {
            if (error) {
                reject(error);
            } else {
                let userProfile = _.get(result[0], strings.mekey, null);
                resolve(userProfile);
            }
        });
    });
};

export const getUserName = () => {
    return new Promise((resolve, reject) => {
        RNUserKit.getProperty(strings.name, (error, result) => {
            if (error) {
                reject(error);
            } else {
                let userName = _.get(result[0], strings.name, null);
                resolve(userName);
            }
        });
    });
};

//Currently just simple for updating role and summary only. TODO: update user object
export const updateUserProfile = (role, summary) => {
    let jsonString = `{ "${strings.mekey}.role": "${role}", "${strings.mekey}.about": "${summary}" }`;
    return new Promise((resolve, reject) => {
        RNUserKit.storeProperties(jsonString, (error) => {
            if (error) {
                reject(error);
            } else {
                resolve("Update Successfully");
            }
        });
    });
};


export const getUserAnalyst = () => {
    return new Promise((resolve, reject) => {
       RNUserKit.getProperty(strings.readingTagsKey, (error, result) => {
           if (error) {
               reject(error);
           } else {
               let userAnalyst = _.get(result[0], strings.readingTagsKey, null);
               resolve(userAnalyst);
           }
        });
    });
}

export const getOnboardingInfo = () => {
    return gqlQuery({
        query: config.queries.onboardingInfo
    })
};

export const getSaved = (page, perPage, kind) => {
    return gqlQuery({
        query: config.queries.bookmark,
        variables: {page: page, perPage: perPage, kind: kind}
    });
};

export const getIntents = (segments) => {
    return gqlQuery({
        query: config.queries.intents,
        variables: {segments: segments}
    });
};

export const getUrlInfo = (url) => {
    return fetch('https://w4gpgbc6mb.execute-api.ap-southeast-1.amazonaws.com/production/v1/metadata/extract?url='+url, {
        method: 'GET',
    }).then(response => {
        return response.json()
    }).then((responseJson) => {
        return responseJson;
    })
};

export const getLastReadingPosition = (contentId) => {
    return new Promise((resolve, reject) => {
        RNUserKit.getProperty(strings.readingPositionKey+"."+contentId, (error, result) => {
            if (error == null && result != null) {
                let lastReadingPosition = _.get(result[0], strings.readingPositionKey+"."+contentId, {x:0, y:0}) ;
                resolve(lastReadingPosition == null ? {x: 0, y: 0} : lastReadingPosition)
            } else {
                reject(error);
            }
        });
    });
};


export const getUserPath = (id) => {
    return gqlQuery({
        query: config.queries.userPath,
        variables: {id: id}
    })
};

export const getPathRecommend = (page, perPage) => {
    return gqlQuery({
        query: config.queries.pathRecommend,
        variables: {page: page, perPage: perPage}
    })
};

export const postCreateBookmark = (contentId, kind) => {
    return gqlPost({
        mutation: config.mutation.createBookmark,
        variables: {contentId: contentId, kind: kind}
    });
};

export const postRemoveBookmark = (contentId, kind) => {
    return gqlPost({
        mutation: config.mutation.removeBookmark,
        variables: {contentId: contentId, kind: kind}
    });
};

export const getRecommendSource = (ids) => {
    return gqlQuery({
        query: config.queries.sourceRecommend,
        variables: {ids: ids}
    })
};

export const updateRecommendSoureToProfile = (ids) => {
    return new Promise((resolve, reject) => {
        getRecommendSource(ids).then(value => {
            let articleFilter = {[strings.articleFilter]: value.data.viewer.sourceRecommend};
            RNUserKit.storeProperty(articleFilter,(err, results)=>{
                if (err == null && results != null) {
                    resolve(articleFilter);
                } else {
                    reject(err);
                }
            })
        }).catch(err=>{
            reject(err);
        });
    });
};

export const getSourceList = () => {
    return gqlQuery({
        query: config.queries.sourceList
    }).then((response) => {
        return new Promise((resolve, reject) => {
            RNUserKit.getProperty(strings.articleFilter, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    let sourceList = response.data.viewer.sourcePagination;
                    let chosenSources = _.get(result[0], strings.articleFilter, null);
                    let responseResult = {
                        sourceList: sourceList,
                        chosenSources: chosenSources
                    }
                    resolve(responseResult);
                }
            })
        })
    })
}

export const updateSourceList = (sources) => {
    return new Promise((resolve, reject) => {
        RNUserKit.storeProperty({[strings.articleFilter]: sources}, (error, result) => {
            if (error){
                reject(error);
            } else {
                resolve("Successfully Update sources");
            }
        })
    })
}

export const getExploreArticles = (limit, skip, sources, tags) => {

    if (_.isEmpty(sources) || _.isEmpty(tags)) {
        return new Promise((resolve, reject) => {
            RNUserKit.getProperty(strings.articleFilter, (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    let chosenSources = _.get(result[0], strings.articleFilter, null);
                    let newSources = _.keys(chosenSources);
                    let newTags = _.uniq(_.flatten(_.values(chosenSources)));
                    resolve(getExploreFunc(limit, skip, newSources, newTags));
                }
            })
        })
    } else {
        return getExploreFunc(limit, skip, sources, tags);
    }

}

const  getExploreFunc = (limit, skip, sources, tags) => {
    let destSources = sources.map((source)=> ({value: source}));
    let destTags = tags.map((tag)=>({value: tag}));
    return gqlQuery({
        query: config.queries.exploreArticles,
        variables: {skip: skip, limit: limit, sources: destSources, tags: destTags}
    })
}

