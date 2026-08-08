import React, { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Appbar, Button, Card, HelperText, Snackbar, Text, TextInput } from 'react-native-paper'
import { useSigninMutation, useVerifyOtpMutation } from '../redux/apis/auth.api'
import { setCredentials } from '../redux/slices/auth.slice'

const credentialsSchema = z.object({
    username: z.string().trim().min(3, "Enter your email or mobile number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})
type CredentialsFormValues = z.infer<typeof credentialsSchema>

const otpSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, "OTP must be 6 digits"),
})
type OtpFormValues = z.infer<typeof otpSchema>

type Step = "credentials" | "otp"

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
    const dispatch = useDispatch()
    const [step, setStep] = useState<Step>("credentials")
    const [credentials, setCredentialsState] = useState<CredentialsFormValues | null>(null)
    const [snackbar, setSnackbar] = useState("")

    const [signin, { isLoading: isSigningIn }] = useSigninMutation()
    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation()

    const {
        control: credentialsControl,
        handleSubmit: handleSubmitCredentials,
        formState: { errors: credentialsErrors },
    } = useForm<CredentialsFormValues>({
        resolver: zodResolver(credentialsSchema),
    })

    const {
        control: otpControl,
        handleSubmit: handleSubmitOtp,
        formState: { errors: otpErrors },
    } = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
    })

    const onCredentialsSubmit = async (values: CredentialsFormValues) => {
        setSnackbar("")
        try {
            await signin(values).unwrap()
            setCredentialsState(values)
            setStep("otp")
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
    }

    const onOtpSubmit = async (values: OtpFormValues) => {
        if (!credentials) return
        setSnackbar("")
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
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
    }

    const onResendOtp = async () => {
        if (!credentials) return
        setSnackbar("")
        try {
            await signin(credentials).unwrap()
            setSnackbar("A new OTP has been sent to your email")
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Appbar.Header>
                <Appbar.Content title="Portfolio" />
            </Appbar.Header>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}>
                <Card mode="outlined">
                    <Card.Title
                        title="Welcome back"
                        subtitle={step === "credentials"
                            ? "Enter your email/mobile and password to sign in"
                            : `Enter the 6-digit OTP sent to ${credentials?.username}`}
                    />
                    <Card.Content>
                        {step === "credentials" ? (
                            <>
                                <Controller
                                    control={credentialsControl}
                                    name="username"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            label="Email or mobile"
                                            mode="outlined"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType="email-address"
                                            error={!!credentialsErrors.username}
                                        />
                                    )}
                                />
                                <HelperText type="error" visible={!!credentialsErrors.username}>
                                    {credentialsErrors.username?.message}
                                </HelperText>
                                <Controller
                                    control={credentialsControl}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            label="Password"
                                            mode="outlined"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            secureTextEntry
                                            error={!!credentialsErrors.password}
                                        />
                                    )}
                                />
                                <HelperText type="error" visible={!!credentialsErrors.password}>
                                    {credentialsErrors.password?.message}
                                </HelperText>
                                <Button
                                    mode="contained"
                                    loading={isSigningIn}
                                    disabled={isSigningIn}
                                    onPress={handleSubmitCredentials(onCredentialsSubmit)}
                                >
                                    Continue
                                </Button>
                                <Text variant="bodySmall">
                                    An OTP will be emailed to you
                                </Text>
                            </>
                        ) : (
                            <>
                                <Controller
                                    control={otpControl}
                                    name="otp"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            label="One-time password"
                                            mode="outlined"
                                            value={value}
                                            onChangeText={onChange}
                                            onBlur={onBlur}
                                            keyboardType="number-pad"
                                            maxLength={6}
                                            autoFocus
                                            error={!!otpErrors.otp}
                                        />
                                    )}
                                />
                                <HelperText type="error" visible={!!otpErrors.otp}>
                                    {otpErrors.otp?.message}
                                </HelperText>
                                <Button
                                    mode="contained"
                                    loading={isVerifying}
                                    disabled={isVerifying}
                                    onPress={handleSubmitOtp(onOtpSubmit)}
                                >
                                    Verify & Sign in
                                </Button>
                                <Button
                                    mode="text"
                                    disabled={isSigningIn}
                                    onPress={onResendOtp}
                                >
                                    Resend OTP
                                </Button>
                                <Button
                                    mode="text"
                                    disabled={isVerifying}
                                    onPress={() => setStep("credentials")}
                                >
                                    Back
                                </Button>
                            </>
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>
            <Snackbar
                visible={!!snackbar}
                onDismiss={() => setSnackbar("")}
                duration={3000}
            >
                {snackbar}
            </Snackbar>
        </KeyboardAvoidingView>
    )
}

export default Login
