import Types from '../../actions/types';
import {FLAG_LANGUAGE} from '../../dao/LanguageDao';

export default function onAction(state = {}, action) {
    switch(action.type) {
        case Types.LANGUAGE_LOAD_SUCCESS:
            if (action.flag === FLAG_LANGUAGE.flag_language) {
                return {
                    ...state,
                    langs: action.languages, 
                }
            } else {
                return {
                    ...state,
                    keys: action.languages, 
                }
            }
        default:
            return state; 
    }
}