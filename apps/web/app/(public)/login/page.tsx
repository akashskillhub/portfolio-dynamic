"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"

import { useSigninMutation, useVerifyOtpMutation } from "@/redux/apis/auth.api"
import { setCredentials } from "@/redux/slices/auth.slice"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const credentialsSchema = z.object({
    username: z.string().trim().min(3, "Enter your email or mobile number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
type CredentialsFormValues = z.infer<typeof credentialsSchema>

const otpSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
})
type OtpFormValues = z.infer<typeof otpSchema>

function getResponseError(error: unknown): string {
    if (typeof error === "object" && error !== null && "data" in error) {
        const data = (error as { data?: unknown }).data
        if (typeof data === "string") return data
        if (typeof data === "object" && data !== null && "message" in data) {
            const message = (data as { message?: unknown }).message
            if (typeof message === "string") return message
        }
    }
    return "Something went wrong. Please try again."
}

const Login = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [step, setStep] = useState<"credentials" | "otp">("credentials")
    const [credentials, setCredentialsState] = useState<{
        username: string
        password: string
    } | null>(null)
    const [error, setError] = useState("")
    const [notice, setNotice] = useState("")

    const [signin, { isLoading: isSigningIn }] = useSigninMutation()
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()

    const {
        register: registerCredentials,
        handleSubmit: handleSubmitCredentials,
        formState: { errors: credentialsErrors },
    } = useForm<CredentialsFormValues>({
        resolver: zodResolver(credentialsSchema),
    })

    const {
        register: registerOtp,
        handleSubmit: handleSubmitOtp,
        formState: { errors: otpErrors },
    } = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
    })

    const onCredentialsSubmit = async (values: CredentialsFormValues) => {
        setError("")
        setNotice("")
        try {
            await signin(values).unwrap()
            setCredentialsState(values)
            setStep("otp")
        } catch (err) {
            setError(getResponseError(err))
        }
    }

    const onOtpSubmit = async (values: OtpFormValues) => {
        if (!credentials) return
        setError("")
        setNotice("")
        try {
            const response = await verifyOtp({
                username: credentials.username,
                otp: values.otp,
            }).unwrap()
            if (response.result) {
                dispatch(setCredentials({
                    user: {
                        id: response.result.id,
                        email: response.result.email,
                        mobile: response.result.mobile,
                    },
                    accessToken: response.result.access_token,
                }))
            }
            router.push("/admin")
        } catch (err) {
            setError(getResponseError(err))
        }
    }

    const resendOtp = async () => {
        if (!credentials) return
        setError("")
        setNotice("")
        try {
            await signin(credentials).unwrap()
            setNotice("A new OTP has been sent to your email")
        } catch (err) {
            setError(getResponseError(err))
        }
    }

    return (
        <div className="flex min-h-svh items-center justify-center p-4">
            <Card size="sm" className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">Welcome back</CardTitle>
                    <CardDescription>
                        {step === "credentials"
                            ? "Enter your credentials to sign in"
                            : `Enter the 6-digit OTP sent to ${credentials?.username}`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {notice && (
                        <Alert className="mb-4">
                            <AlertTitle>Notice</AlertTitle>
                            <AlertDescription>{notice}</AlertDescription>
                        </Alert>
                    )}

                    {step === "credentials" ? (
                        <form
                            key="credentials-form"
                            className="grid gap-4"
                            onSubmit={handleSubmitCredentials(onCredentialsSubmit)}
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="username">Email or mobile</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="you@example.com"
                                    aria-invalid={!!credentialsErrors.username}
                                    {...registerCredentials("username")}
                                />
                                {credentialsErrors.username && (
                                    <p className="text-sm text-destructive">
                                        {credentialsErrors.username.message}
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    aria-invalid={!!credentialsErrors.password}
                                    {...registerCredentials("password")}
                                />
                                {credentialsErrors.password && (
                                    <p className="text-sm text-destructive">
                                        {credentialsErrors.password.message}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="mt-2 w-full" disabled={isSigningIn}>
                                {isSigningIn ? "Signing in..." : "Continue"}
                            </Button>
                        </form>
                    ) : (
                        <form
                            key="otp-form"
                            className="grid gap-4"
                            onSubmit={handleSubmitOtp(onOtpSubmit)}
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="otp">One-time password</Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    placeholder="Enter 6-digit OTP"
                                    className="text-center tracking-[0.4em] text-lg"
                                    aria-invalid={!!otpErrors.otp}
                                    autoFocus
                                    {...registerOtp("otp")}
                                />
                                {otpErrors.otp && (
                                    <p className="text-sm text-destructive">
                                        {otpErrors.otp.message}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" className="mt-2 w-full" disabled={isVerifying}>
                                {isVerifying ? "Verifying..." : "Verify & Sign in"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="justify-between">
                    {step === "otp" ? (
                        <>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setError("")
                                    setNotice("")
                                    setStep("credentials")
                                }}
                                disabled={isVerifying}
                            >
                                Back
                            </Button>
                            <Button
                                type="button"
                                variant="link"
                                onClick={resendOtp}
                                disabled={isSigningIn}
                            >
                                Resend OTP
                            </Button>
                        </>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                            An OTP will be emailed to you
                        </span>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

export default Login