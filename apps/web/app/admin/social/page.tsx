"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import React from 'react'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCreateSocialMutation, useGetMeQuery } from "@/redux/apis/admin.api";
import { useAppSelector } from "@/redux/store";

const socialSchema = z.object({
    platform: z.string().min(3),
    platformLink: z.string().url(),
})

type FormData = z.infer<typeof socialSchema>

const Social = () => {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(socialSchema),
        defaultValues: {
            platform: "",
            platformLink: "",
        }
    });

    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const { data: meData } = useGetMeQuery(undefined, { skip: !accessToken });
    const [createSocial, { isLoading, error }] = useCreateSocialMutation();

    const onSubmit = async (data: FormData) => {
        console.log("hello");

        if (!meData?.result.id) return;
        await createSocial({ userId: meData.result.id, ...data });
        reset();
    };

    const apiError = (error as { data?: { message?: string } })?.data?.message;

    return <>
        <div className='text-end'>
            <Dialog>
                <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
                <DialogContent className="sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>Edit profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re
                                done.
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="platform">Platform</Label>
                                <Input {...register("platform")} id="platform" placeholder="github" aria-invalid={!!errors.platform} />
                                {errors.platform && <span className="text-sm text-destructive">{errors.platform.message}</span>}
                            </Field>
                            <Field>
                                <Label htmlFor="platformLink">Platform Link</Label>
                                <Input {...register("platformLink")} id="platformLink" placeholder="https://www.github.com" aria-invalid={!!errors.platformLink} />
                                {errors.platformLink && <span className="text-sm text-destructive">{errors.platformLink.message}</span>}
                            </Field>
                        </FieldGroup>
                        <DialogFooter className="mt-6">
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button type="submit" disabled={isLoading || isSubmitting}>
                                {isLoading || isSubmitting ? "Saving..." : "Save changes"}
                            </Button>
                        </DialogFooter>
                        {apiError && <p className="text-sm text-destructive">{apiError}</p>}
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    </>
}

export default Social