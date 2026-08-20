import { BaseQueryFn, FetchArgs, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
    ADMIN_DELETE_RESPONSE,
    ADMIN_LIST_RESPONSE,
    EDUCATION_REQUEST,
    EDUCATION_RESULT,
    EDUCATION_RESPONSE,
    GET_ME_RESPONSE,
    PROJECT_RESULT,
    PROJECT_RESPONSE,
    REFRESH_RESPONSE,
    SKILL_REQUEST,
    SKILL_RESULT,
    SKILL_RESPONSE,
} from '@repo/types';
import type { RootType } from '../store';
import { setAccessToken } from '../slices/auth.slice';

const API_BASE = process.env.EXPO_PUBLIC_LIVE_API_URL ?? 'http://localhost:5000';

const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${API_BASE}/admin`,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootType).auth.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const refreshBaseQuery = fetchBaseQuery({ baseUrl: `${API_BASE}/auth` });

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
    tagTypes: ['Education', 'Project', 'Skill', 'Profile'],
    endpoints: (builder) => {
        return {
            getMe: builder.query<GET_ME_RESPONSE, void>({
                query: () => ({
                    url: '/me',
                    method: 'GET',
                }),
            }),

            // ==================== EDUCATION ====================
            createEducation: builder.mutation<EDUCATION_RESPONSE, EDUCATION_REQUEST>({
                query: (data) => ({
                    url: '/education',
                    method: 'POST',
                    body: data,
                }),
                invalidatesTags: ['Education'],
            }),
            readEducation: builder.query<ADMIN_LIST_RESPONSE<EDUCATION_RESULT>, void>({
                query: () => ({
                    url: '/education',
                    method: 'GET',
                }),
                providesTags: ['Education'],
            }),
            updateEducation: builder.mutation<EDUCATION_RESPONSE, { id: number } & Partial<EDUCATION_REQUEST>>({
                query: ({ id, ...body }) => ({
                    url: `/education/${id}`,
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: ['Education'],
            }),
            deleteEducation: builder.mutation<ADMIN_DELETE_RESPONSE, { id: number }>({
                query: ({ id }) => ({
                    url: `/education/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Education'],
            }),

            // ==================== PROJECT ====================
            createProject: builder.mutation<PROJECT_RESPONSE, FormData>({
                query: (fd) => ({
                    url: '/project',
                    method: 'POST',
                    body: fd,
                }),
                invalidatesTags: ['Project'],
            }),
            readProjects: builder.query<ADMIN_LIST_RESPONSE<PROJECT_RESULT>, void>({
                query: () => ({
                    url: '/project',
                    method: 'GET',
                }),
                providesTags: ['Project'],
            }),
            updateProject: builder.mutation<PROJECT_RESPONSE, { id: number, fd: FormData }>({
                query: ({ id, fd }) => ({
                    url: `/project/${id}`,
                    method: 'PUT',
                    body: fd,
                }),
                invalidatesTags: ['Project'],
            }),
            deleteProject: builder.mutation<ADMIN_DELETE_RESPONSE, { id: number }>({
                query: ({ id }) => ({
                    url: `/project/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Project'],
            }),

            // ==================== SKILL ====================
            createSkill: builder.mutation<SKILL_RESPONSE, SKILL_REQUEST>({
                query: (data) => ({
                    url: '/skill',
                    method: 'POST',
                    body: data,
                }),
                invalidatesTags: ['Skill'],
            }),
            readSkills: builder.query<ADMIN_LIST_RESPONSE<SKILL_RESULT>, void>({
                query: () => ({
                    url: '/skill',
                    method: 'GET',
                }),
                providesTags: ['Skill'],
            }),
            updateSkill: builder.mutation<SKILL_RESPONSE, { id: number } & Partial<SKILL_REQUEST>>({
                query: ({ id, ...body }) => ({
                    url: `/skill/${id}`,
                    method: 'PUT',
                    body,
                }),
                invalidatesTags: ['Skill'],
            }),
            deleteSkill: builder.mutation<ADMIN_DELETE_RESPONSE, { id: number }>({
                query: ({ id }) => ({
                    url: `/skill/${id}`,
                    method: 'DELETE',
                }),
                invalidatesTags: ['Skill'],
            }),

            // ==================== PROFILE ====================
            updateProfile: builder.mutation<GET_ME_RESPONSE, { name: string, email: string, mobile: string }>({
                query: (data) => ({
                    url: '/update-profile',
                    method: 'POST',
                    body: data,
                }),
                invalidatesTags: ['Profile'],
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
    useCreateProjectMutation,
    useReadProjectsQuery,
    useUpdateProjectMutation,
    useDeleteProjectMutation,
    useCreateSkillMutation,
    useReadSkillsQuery,
    useUpdateSkillMutation,
    useDeleteSkillMutation,
    useUpdateProfileMutation,
} = adminApi;