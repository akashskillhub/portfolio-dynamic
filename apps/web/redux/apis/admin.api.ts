import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    ADMIN_DELETE_RESPONSE,
    ADMIN_LIST_RESPONSE,
    ADMIN_UPDATE_REQUEST,
    EDUCATION_REQUEST,
    EDUCATION_RESULT,
    EDUCATION_RESPONSE,
    GET_ME_RESPONSE,
    PROJECT_RESULT,
    PROJECT_RESPONSE,
    REFRESH_RESPONSE,
    SOCIAL_REQUEST,
    SOCIAL_RESULT,
    SOCIAL_RESPONSE,
} from '@repo/types';
import type { RootType } from '../store';
import { setAccessToken } from '../slices/auth.slice';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `/api/admin`,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootType).auth.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const refreshBaseQuery = fetchBaseQuery({ baseUrl: `/api/auth`, credentials: 'include' });

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshResult = await refreshBaseQuery({ url: '/refresh', method: 'POST' }, api, extraOptions);

        const accessToken = (refreshResult.data as REFRESH_RESPONSE | undefined)?.result?.access_token;
        if (accessToken) {
            api.dispatch(setAccessToken(accessToken));
            result = await rawBaseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const adminApi = createApi({
    reducerPath: 'adminApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Education', 'Social', 'Project'],
    endpoints: (builder) => {
        return {
            // ==================== USER ====================
            getMe: builder.query<GET_ME_RESPONSE, void>({
                query: () => {
                    return {
                        url: '/me',
                        method: 'GET',
                    }
                },
            }),

            // ==================== EDUCATION ====================
            createEducation: builder.mutation<EDUCATION_RESPONSE, EDUCATION_REQUEST>({
                query: (data) => {
                    return {
                        url: '/education',
                        method: 'POST',
                        body: data,
                    }
                },
                invalidatesTags: ['Education'],
            }),
            readEducation: builder.query<ADMIN_LIST_RESPONSE<EDUCATION_RESULT>, void>({
                query: () => {
                    return {
                        url: '/education',
                        method: 'GET',
                    }
                },
                providesTags: ['Education'],
            }),
            updateEducation: builder.mutation<EDUCATION_RESPONSE, ADMIN_UPDATE_REQUEST & Partial<EDUCATION_REQUEST>>({
                query: ({ id, ...body }) => {
                    return {
                        url: `/education/${id}`,
                        method: 'PUT',
                        body,
                    }
                },
                invalidatesTags: ['Education'],
            }),
            deleteEducation: builder.mutation<ADMIN_DELETE_RESPONSE, { id: number }>({
                query: ({ id }) => {
                    return {
                        url: `/education/${id}`,
                        method: 'DELETE',
                    }
                },
                invalidatesTags: ['Education'],
            }),

            // ==================== SOCIAL ====================
            createSocial: builder.mutation<SOCIAL_RESPONSE, SOCIAL_REQUEST>({
                query: (data) => {
                    return {
                        url: '/social',
                        method: 'POST',
                        body: data,
                    }
                },
                invalidatesTags: ['Social'],
            }),
            readSocial: builder.query<ADMIN_LIST_RESPONSE<SOCIAL_RESULT>, void>({
                query: () => {
                    return {
                        url: '/social',
                        method: 'GET',
                    }
                },
                providesTags: ['Social'],
            }),
            updateSocial: builder.mutation<SOCIAL_RESPONSE, ADMIN_UPDATE_REQUEST & Partial<SOCIAL_REQUEST>>({
                query: ({ id, ...body }) => {
                    return {
                        url: `/social/${id}`,
                        method: 'PUT',
                        body,
                    }
                },
                invalidatesTags: ['Social'],
            }),
            deleteSocial: builder.mutation<ADMIN_DELETE_RESPONSE, { id: number }>({
                query: ({ id }) => {
                    return {
                        url: `/social/${id}`,
                        method: 'DELETE',
                    }
                },
                invalidatesTags: ['Social'],
            }),

            updateProfile: builder.mutation<ADMIN_DELETE_RESPONSE, { id: number, fd: FormData }>({
                query: (profileData) => {
                    return {
                        url: `/update-profile`,
                        method: 'POST',
                        body: profileData.fd
                    }
                },
                invalidatesTags: [],
            }),

            // ==================== PROJECT ====================
            createProject: builder.mutation<PROJECT_RESPONSE, FormData>({
                query: (fd) => {
                    return {
                        url: '/project',
                        method: 'POST',
                        body: fd,
                    }
                },
                invalidatesTags: ['Project'],
            }),
            readProjects: builder.query<ADMIN_LIST_RESPONSE<PROJECT_RESULT>, void>({
                query: () => {
                    return {
                        url: '/project',
                        method: 'GET',
                    }
                },
                providesTags: ['Project'],
            }),
            updateProject: builder.mutation<PROJECT_RESPONSE, { id: number, fd: FormData }>({
                query: ({ id, fd }) => {
                    return {
                        url: `/project/${id}`,
                        method: 'PUT',
                        body: fd,
                    }
                },
                invalidatesTags: ['Project'],
            }),
            deleteProject: builder.mutation<ADMIN_DELETE_RESPONSE, { id: number }>({
                query: ({ id }) => {
                    return {
                        url: `/project/${id}`,
                        method: 'DELETE',
                    }
                },
                invalidatesTags: ['Project'],
            }),
        }
    }
});

export const {
    useGetMeQuery,
    useCreateEducationMutation,
    useReadEducationQuery,
    useUpdateEducationMutation,
    useDeleteEducationMutation,
    useCreateSocialMutation,
    useReadSocialQuery,
    useUpdateSocialMutation,
    useDeleteSocialMutation,
    useUpdateProfileMutation,
    useCreateProjectMutation,
    useReadProjectsQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation
} = adminApi;