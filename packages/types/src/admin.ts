export interface EDUCATION_REQUEST {
    userId?: number | null
    degree_year: string
    degree_college: string
    degree_percent: string
}

export interface EDUCATION_RESULT {
    id: number
    userId: number | null
    degree_year: string | null
    degree_college: string | null
    degree_percent: string | null
}

export interface EDUCATION_RESPONSE {
    message: string
    result: EDUCATION_RESULT
}

export interface SOCIAL_REQUEST {
    userId?: number | null
    platform: string
    platformLink: string
}

export interface SOCIAL_RESULT {
    id: number
    userId: number | null
    platform: string | null
    platformLink: string | null
}

export interface SOCIAL_RESPONSE {
    message: string
    result: SOCIAL_RESULT
}

export interface ADMIN_LIST_RESPONSE<T> {
    message: string
    result: T[]
}

export interface ADMIN_DELETE_RESPONSE {
    message: string
}

export interface ADMIN_UPDATE_REQUEST {
    id: number
    userId?: number | null
}

export interface GET_ME_RESULT {
    id: number
    name: string | null
    email: string
    mobile: string
}

export interface GET_ME_RESPONSE {
    message: string
    result: GET_ME_RESULT
}