import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LOGIN_REQUEST, LOGIN_RESPONSE, LOGOUT_REQUEST, LOGOUT_RESPONSE, REGISTER_REQUEST, REGISTER_RESPONSE, VERIFY_OTP_REQUEST, VERIFY_OTP_RESPONSE } from '@repo/types';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.EXPO_PUBLIC_LIVE_API_URL}/auth`, credentials: 'include' }),
    endpoints: (builder) => {
        return {
            signin: builder.mutation<LOGIN_RESPONSE, LOGIN_REQUEST>({
                query: (userdata) => {
                    return {
                        url: '/login',
                        method: 'POST',
                        body: userdata
                    }
                },
            }),

            verifyOtp: builder.mutation<VERIFY_OTP_RESPONSE, VERIFY_OTP_REQUEST>({
                query: (otpData) => {
                    return {
                        url: '/verify-otp',
                        method: 'POST',
                        body: otpData
                    }
                },
            }),

            signout: builder.mutation<LOGOUT_RESPONSE, LOGOUT_REQUEST>({
                query: () => {
                    return {
                        url: '/logout',
                        method: 'POST',
                    }
                },
            }),

        }
    }
});

export const { useSigninMutation, useVerifyOtpMutation, useSignoutMutation } = authApi;