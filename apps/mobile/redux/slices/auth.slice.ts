import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthUser {
    id: number;
    email: string;
    mobile: string;
    name?: string;
}

export interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
        },
        setAccessToken: (state, action: PayloadAction<string>) => {
            state.accessToken = action.payload;
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
        },
    },
});

export const { setCredentials, setAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
