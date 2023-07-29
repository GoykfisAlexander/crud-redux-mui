import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import personsReducer from "../features/Persons/personsSlice";

export const store = configureStore({
  reducer: {
    persons: personsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
