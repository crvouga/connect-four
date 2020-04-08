import { combineActions, handleActions } from "redux-actions";
import actions, { CLOSE_SNACKBAR, REMOVE_SNACKBAR } from "../actions";
import { append, map, filter } from "ramda";

export const reducer = handleActions(
  {
    [combineActions(
      actions.success,
      actions.info,
      actions.error,
      actions.warning
    )]: (state, action) =>
      append(action.payload, state),

    [CLOSE_SNACKBAR]: (state, action) =>
      map(
        notification =>
          action.dismissAll || notification.key === action.key
            ? { ...notification, dismissed: true }
            : { ...notification },
        state
      ),

    [REMOVE_SNACKBAR]: (state, action) =>
      filter(notification => notification.key !== action.key, state)
  },
  []
);
