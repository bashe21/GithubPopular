import Types from '../types';
import ThemeDao from '../../dao/ThemeDao';

export function onThemeChange(theme) {
    return ({
        type: Types.THEME_CHANGE,
        theme: theme,
    });
}

export function OnThemeInit() {
    return dispatch => {
        new ThemeDao().getTheme().then(data => {
            dispatch(onThemeChange(data));
        });
    }
}

export function onShowCustomThemeView(show) {
    return {
        type: Types.SHOW_THEME_View,
        customThemeViewVisible: show,
    }
}