"use client"
import { ReactNode, useEffect, useState } from "react";
import { Provider, useDispatch } from "react-redux";
import reduxStore, { useAppSelector } from "./store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthState, clearCredentials, setCredentials } from "./slices/auth.slice";

type Props = { children: ReactNode };

const AUTH_STORAGE_KEY = "auth";

const AuthHydrator = ({ children }: Props) => {
    const dispatch = useDispatch();
    const [hydrated, setHydrated] = useState(false);
    const { user, accessToken } = useAppSelector((state) => state.auth);

    useEffect(() => {
        (async () => {
            try {
                const raw = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw) as AuthState;
                    if (parsed.user && parsed.accessToken) {
                        dispatch(setCredentials({ user: parsed.user, accessToken: parsed.accessToken }));
                    }
                }
            } catch {
                dispatch(clearCredentials());
            } finally {
                setHydrated(true);
            }
        })();
    }, [dispatch]);

    useEffect(() => {
        if (!hydrated) return;
        if (user && accessToken) {
            AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user, accessToken })).catch(() => { });
        } else {
            AsyncStorage.removeItem(AUTH_STORAGE_KEY).catch(() => { });
        }
    }, [user, accessToken, hydrated]);

    return hydrated ? children : null;
}

const ReduxProvider = ({ children }: Props) => {
    return (
        <Provider store={reduxStore}>
            <AuthHydrator>
                {children}
            </AuthHydrator>
        </Provider>
    )
}

export default ReduxProvider;
