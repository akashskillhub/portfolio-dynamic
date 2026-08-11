import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../apis/auth.api';

export interface AuthUser {
    id: number;
    email: string;
    mobile: string;
}

export interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
}

function readLocalJson<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        localStorage.removeItem(key);
        return null;
    }
}

const initialState: AuthState = {
    user: readLocalJson<AuthUser>("user"),
    accessToken: typeof window === "undefined" ? null : localStorage.getItem("access_token"),
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
    extraReducers: builder => builder
        .addMatcher(authApi.endpoints.verifyOtp.matchFulfilled, (state, { payload }) => {
            if (payload.result) {
                const { id, email, mobile, access_token } = payload.result
                state.user = { id, email, mobile }
                state.accessToken = access_token

                localStorage.setItem("user", JSON.stringify({ id, email, mobile, }))
                localStorage.setItem("access_token", access_token)
            }
        })
});

export const { setCredentials, setAccessToken, clearCredentials } = authSlice.actions;
export default authSlice.reducer;