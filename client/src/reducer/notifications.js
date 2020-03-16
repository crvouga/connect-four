import { 
    handleActions 
} from 'redux-actions'
import { 
    ENQUEUE_SNACKBAR, 
    CLOSE_SNACKBAR, 
    REMOVE_SNACKBAR 
} from '../actions'
import { 
    append,
    map,
    filter,
} from 'ramda';

export const reducer = handleActions(
    {
        [ENQUEUE_SNACKBAR]: (state, action) =>
            append({key: action.key, ...action.notification}, state),

        [CLOSE_SNACKBAR]: (state, action) =>
            map(notification => (
                (action.dismissAll || notification.key === action.key)
                    ? { ...notification, dismissed: true }
                    : { ...notification }),
                state),

        [REMOVE_SNACKBAR]: (state, action) =>
            filter(notification => notification.key !== action.key,  state),      
    },
    []
)
