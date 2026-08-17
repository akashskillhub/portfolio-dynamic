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
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import React, { useState } from 'react'

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useCreateSocialMutation, useDeleteSocialMutation, useGetMeQuery, useReadSocialQuery, useUpdateSocialMutation } from "@/redux/apis/admin.api";
import { useAppSelector } from "@/redux/store";
import type { SOCIAL_RESULT } from "@repo/types";

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

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<SOCIAL_RESULT | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SOCIAL_RESULT | null>(null);

    const { data } = useReadSocialQuery()

    const accessToken = useAppSelector((state) => state.auth.accessToken);
    const { data: meData } = useGetMeQuery(undefined, { skip: !accessToken });
    const [createSocial, { isLoading: isCreating, error: createError }] = useCreateSocialMutation();
    const [updateSocial, { isLoading: isUpdating, error: updateError }] = useUpdateSocialMutation();
    const [deleteSocial, { isLoading: isDeleting }] = useDeleteSocialMutation();

    const openCreate = () => {
        setEditing(null);
        reset({ platform: "", platformLink: "" });
        setFormOpen(true);
    };

    const openEdit = (item: SOCIAL_RESULT) => {
        setEditing(item);
        reset({ platform: item.platform ?? "", platformLink: item.platformLink ?? "" });
        setFormOpen(true);
    };

    const onSubmit = async (formData: FormData) => {
        if (!meData?.result.id) return;
        if (editing) {
            await updateSocial({ id: editing.id, userId: meData.result.id, ...formData });
        } else {
            await createSocial({ userId: meData.result.id, ...formData });
        }
        setFormOpen(false);
        setEditing(null);
        reset();
    };

    const onDelete = async () => {
        if (!deleteTarget) return;
        await deleteSocial({ id: deleteTarget.id });
        setDeleteTarget(null);
    };

    const apiError = ((editing ? updateError : createError) as { data?: { message?: string } })?.data?.message;
    const isSaving = isCreating || isUpdating || isSubmitting;

    return <>
        <div className='text-end'>
            <Button onClick={openCreate}>Add social</Button>
        </div>

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>{editing ? "Edit social" : "Add social"}</DialogTitle>
                        <DialogDescription>
                            {editing ? "Update this social link." : "Add a new social link."}
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
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? "Saving..." : editing ? "Save changes" : "Add social"}
                        </Button>
                    </DialogFooter>
                    {apiError && <p className="text-sm text-destructive">{apiError}</p>}
                </form>
            </DialogContent>
        </Dialog>

        <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete social</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget?.platform}</span>? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Cancel</Button>} />
                    <Button variant="destructive" onClick={onDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Platform</TableHead>
                    <TableHead>Url</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data && data.result.length > 0
                        ? data.result.map(item => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.platform}</TableCell>
                                <TableCell>
                                    <a href={item.platformLink ?? "#"} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                                        {item.platformLink}
                                    </a>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outline" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => setDeleteTarget(item)}>Remove</Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                        : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center text-muted-foreground">
                                    No social links found.
                                </TableCell>
                            </TableRow>
                        )
                }
            </TableBody>
        </Table>
    </>
}

export default Social