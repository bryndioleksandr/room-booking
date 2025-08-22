import { configureStore } from '@reduxjs/toolkit';
import {
    useDispatch as useDispatchRedux,
    useSelector as useSelectorRedux,
    type TypedUseSelectorHook,
} from 'react-redux';
import rootReducer from './slices';

const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useDispatch = () => useDispatchRedux<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRedux;

export default store;
