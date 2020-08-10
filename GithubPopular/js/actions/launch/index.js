import Types from '../types';

export function launchApp() {
    return dispatch => {
        dispatch({
            type: Types.LAUNCH_APP, 
            isLoaded: true,
        });
    }
}