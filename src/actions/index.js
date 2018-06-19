import * as getSaved from './getSaved'
import * as getArticles from './getArticles'
import * as getPlaylist from './getPlaylist'
import * as getOnboarding from './getOnboarding'
import * as getLastReadingPosition from './getLastReadingPosition'
import * as getIntention from './getIntention'
import * as getPathRecommend from './getPathRecommend'
import * as getPathBookmarked from './getPathBookmarked'
import * as updateRecommendSource from './updateRecommendSource'
import * as getAllIntention from './getAllIntention'
import * as getUserPath from './getUserPath'
import * as createBookmark from './createBookmark'
import * as removeBookmark from './removeBookmark'
import * as getWatchingHistory from './getWatchingHistory'
import * as getCategory from './getCategory'

export default actions = {
    getSaved,
    getArticles,
    getPlaylist,
    getOnboarding,
    getLastReadingPosition,
    getIntention,
    getAllIntention,
    getPathRecommend,
    getPathBookmarked,
    updateRecommendSource,
    getUserPath,
    createBookmark,
    removeBookmark,
    getWatchingHistory,
    getCategory
}
