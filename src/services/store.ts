import { configureStore } from '@reduxjs/toolkit';
import { combineSlices } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { burgerConstructorSlice } from './slices/burgerConstructor';
import { userSlice } from './slices/user';
import { feedsSlice } from './slices/feed';
import { ingredientsSlice } from './slices/ingredient';
import { orderDetailsSlice, ordersListSlice } from './slices/order';

export const rootReducer = combineSlices(
  burgerConstructorSlice,
  feedsSlice,
  ingredientsSlice,
  ordersListSlice,
  orderDetailsSlice,
  userSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
