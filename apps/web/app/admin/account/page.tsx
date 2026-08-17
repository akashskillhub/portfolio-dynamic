"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateProfileMutation } from "@/redux/apis/admin.api"

const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Mobile must be at least 10 digits"),
    hero: z.instanceof(File).optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const Account = () => {
    const [updateProfile, { isLoading, error }] = useUpdateProfileMutation()
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: "",
            email: "",
            mobile: "",
        },
    })

    const hero = watch("hero")
    const [preview, setPreview] = useState<undefined | string>()

    useEffect(() => {
        if (hero) {
            const url = URL.createObjectURL(hero)
            setPreview(url)
            return () => URL.revokeObjectURL(url)
        }
        setPreview(undefined)
    }, [hero])

    const onSubmit = async (formData: ProfileFormData) => {
        const fd = new FormData()
        fd.append("name", formData.name)
        fd.append("email", formData.email)
        fd.append("mobile", formData.mobile)
        if (formData.hero) {
            fd.append("hero", formData.hero)
        }
        await updateProfile({ id: 1, fd }).unwrap()
    }

    const apiError = (error as { data?: { message?: string } })?.data?.message

    return (
        <Card className="mx-auto w-full max-w-md">
            <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>Update your profile information.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Name</Label>
                            <Input {...register("name")} id="name" placeholder="ross doe" aria-invalid={!!errors.name} />
                            <FieldError errors={[errors.name]} />
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email</Label>
                            <Input {...register("email")} id="email" type="email" placeholder="ross@example.com" aria-invalid={!!errors.email} />
                            <FieldError errors={[errors.email]} />
                        </Field>
                        <Field>
                            <Label htmlFor="mobile">Mobile</Label>
                            <Input {...register("mobile")} id="mobile" type="tel" placeholder="1234567890" aria-invalid={!!errors.mobile} />
                            <FieldError errors={[errors.mobile]} />
                        </Field>
                        <Field>
                            <Label htmlFor="hero">Profile picture</Label>
                            <Input
                                id="hero"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setValue("hero", e.target.files?.[0])}
                            />
                        </Field>
                    </FieldGroup>
                    {preview && (
                        <Image src={preview} height={100} width={100} unoptimized alt="Profile preview" className="mt-4 rounded-full object-cover" />
                    )}
                    {apiError && <p className="mt-4 text-sm text-destructive">{apiError}</p>}
                    <Button type="submit" className="mt-6" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default Account