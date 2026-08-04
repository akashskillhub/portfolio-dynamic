import crypto from "crypto"

export const generateOTP = () => {
    const min = Math.pow(10, 5)
    const max = Math.pow(10, 6) - 1
    const otp = crypto.randomInt(min, max)
    return otp
}
