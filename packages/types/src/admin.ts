export interface EDUCATION_REQUEST {
    userId?: number | null
    education_name: string
    percentage?: string | null
    year?: string | null
    isPursuing?: boolean | null
}

export interface EDUCATION_RESULT {
    id: number
    userId: number | null
    education_name: string | null
    percentage: string | null
    year: string | null
    isPursuing: boolean | null
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

export interface PROJECT_REQUEST {
    userId?: number | null
    name: string
    description?: string | null
    technology?: string[] | null
    category?: string[] | null
    source_url?: string | null
    live_url?: string | null
}

export interface PROJECT_RESULT extends PROJECT_REQUEST {
    id: number
    userId: number | null
    description: string | null
    technology: string[] | null
    category: string[] | null
    source_url: string | null
    live_url: string | null
    hero: string | null
}

export interface PROJECT_RESPONSE {
    message: string
    result: PROJECT_RESULT
}

export interface SKILL_REQUEST {
    userId?: number | null
    skill_name: string
}

export interface SKILL_RESULT {
    id: number
    userId: number | null
    skill_name: string | null
}

export interface SKILL_RESPONSE {
    message: string
    result: SKILL_RESULT
}