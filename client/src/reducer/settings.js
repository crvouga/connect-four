import actions from "../actions";
import { createReducer } from "@reduxjs/toolkit";
export const reducer = createReducer(
  {
    theme: "dark",
    isConfetti: false,
  },
  {
    [actions.toggleTheme]: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    [actions.toggleConfetti]: (state) => {
      state.isConfetti = !state.isConfetti;
    },
  }
);
