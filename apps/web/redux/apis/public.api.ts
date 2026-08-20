import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PUBLIC_RESPONSE } from '@repo/types';

export const publicApi = createApi({
    reducerPath: 'publicApi',
    baseQuery: fetchBaseQuery({ baseUrl: `/api/public` }),
    endpoints: (builder) => {
        return {
            readPublic: builder.query<PUBLIC_RESPONSE, void>({
                query: () => {
                    return {
                        url: '/',
                        method: 'GET',
                    }
                },
            }),
        }
    }
});

export const { useReadPublicQuery } = publicApi;