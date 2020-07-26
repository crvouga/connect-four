import { handleActions } from "redux-actions";
import { evolve, prop, __, not } from "ramda";
import actions from "../actions";

export const reducer = handleActions(
  {
    [actions.toggleTheme]: evolve({
      theme: prop(__, { light: "dark", dark: "light" }),
    }),
    [actions.toggleConfetti]: evolve({ isConfetti: not }),
  },
  {
    theme: "dark",
    isConfetti: false,
  }
);
