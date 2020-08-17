import {launchApp} from './launch';
import {onloadPopularData, onloadMorePopularData, onflushPopularFavoriteData} from './popular'
import {onloadTrendingData, onloadMoreTrendingData, onflushTrendingFavoriteData} from './trending'
import {onloadFavoriteData} from './favorite'
import {onloadLanguage} from './language'

export default {
    launchApp,
    onloadPopularData,
    onloadMorePopularData,
    onflushPopularFavoriteData,
    onloadTrendingData,
    onloadMoreTrendingData,
    onflushTrendingFavoriteData,
    onloadFavoriteData,
    onloadLanguage,
}