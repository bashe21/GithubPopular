import Types from '../types';
import LanguageDao from '../../dao/LanguageDao';

export function onloadLanguage(flagKey) {
    return async dispatch => {
        try {
            let languages = await new LanguageDao(flagKey).fetch();
            dispatch({type: Types.LANGUAGE_LOAD_SUCCESS, languages: languages, flag: flagKey});
        } catch (e) {
            console.log(e);
        }
    }
}