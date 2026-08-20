import {
    EDUCATION_RESULT,
    PROJECT_RESULT,
    SKILL_RESULT,
    SOCIAL_RESULT,
} from "./admin"

export interface PUBLIC_USER {
    id: number
    name: string | null
    email: string
    mobile: string
    profile: string | null
}

export interface PUBLIC_RESULT {
    user: PUBLIC_USER | null
    skills: SKILL_RESULT[]
    projects: PROJECT_RESULT[]
    education: EDUCATION_RESULT[]
    social: SOCIAL_RESULT[]
}

export interface PUBLIC_RESPONSE {
    message: string
    result: PUBLIC_RESULT
}