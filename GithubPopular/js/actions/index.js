import {launchApp} from './launch';
import {onloadPopularData, onloadMorePopularData, onflushPopularFavoriteData} from './popular'
import {onloadTrendingData, onloadMoreTrendingData, onflushTrendingFavoriteData} from './trending'
import {onloadFavoriteData} from './favorite'
import {onloadLanguage} from './language'
import {onThemeChange, OnThemeInit, onShowCustomThemeView} from './theme'

export default {
    launchApp,
    onThemeChange,
    OnThemeInit,
    onShowCustomThemeView,
    onloadPopularData,
    onloadMorePopularData,
    onflushPopularFavoriteData,
    onloadTrendingData,
    onloadMoreTrendingData,
    onflushTrendingFavoriteData,
    onloadFavoriteData,
    onloadLanguage,
}