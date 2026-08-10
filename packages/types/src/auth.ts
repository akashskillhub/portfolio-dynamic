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


export interface VERIFY_OTP_REQUEST {
    username: string
    otp: string
}

export interface VERIFY_OTP_RESPONSE {
    message: string
    result?: {
        id: number,
        email: string,
        mobile: string,
        access_token: string
    }
}

export interface REFRESH_RESPONSE {
    message: string
    result?: {
        access_token: string
    }
}