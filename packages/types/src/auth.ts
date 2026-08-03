export interface LOGIN_REQUEST {
    username: string
    password: string
}
export interface LOGIN_RESPONSE {
    message: string
    result: {
        id: number
        email: string
        password: string
    }
}


export interface REGISTER_REQUEST {
    name: string
    email: string
    password: string
    mobile: string
}
export interface REGISTER_RESPONSE {
    message: string
}


export type LOGOUT_REQUEST = void

export interface LOGOUT_RESPONSE {
    message: string
}