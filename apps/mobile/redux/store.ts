import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { authApi } from './apis/auth.api';
import authReducer from './slices/auth.slice';

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
    },
    middleware: (def) => def().concat(authApi.middleware)
});

export type RootType = ReturnType<typeof reduxStore.getState>;
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector;

export default reduxStore;