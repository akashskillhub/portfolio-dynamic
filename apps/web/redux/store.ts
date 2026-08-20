import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { authApi } from './apis/auth.api';
import { adminApi } from './apis/admin.api';
import { publicApi } from './apis/public.api';
import authReducer from './slices/auth.slice';

const reduxStore = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [publicApi.reducerPath]: publicApi.reducer,
        auth: authReducer,
    },
    middleware: (def) => def().concat(authApi.middleware, adminApi.middleware, publicApi.middleware)
});

export type RootType = ReturnType<typeof reduxStore.getState>;
export const useAppSelector: TypedUseSelectorHook<RootType> = useSelector;

export default reduxStore;