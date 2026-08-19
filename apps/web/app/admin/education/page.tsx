"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import type { EDUCATION_RESULT } from "@repo/types"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Field, FieldError, FieldGroup } from "@/components/ui/field"
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

import {
    useCreateEducationMutation,
    useDeleteEducationMutation,
    useReadEducationQuery,
    useUpdateEducationMutation,
} from "@/redux/apis/admin.api"
import { useAppSelector } from "@/redux/store"

const educationSchema = z.object({
    education_name: z.string().min(1, "Education name is required"),
    percentage: z.string().optional(),
    year: z.string().min(1, "Year is required"),
    isPursuing: z.boolean().optional(),
})

type EducationFormData = z.infer<typeof educationSchema>

const Education = () => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EducationFormData>({
        resolver: zodResolver(educationSchema),
        defaultValues: {
            education_name: "",
            percentage: "",
            year: "",
            isPursuing: false,
        },
    })

    const userId = useAppSelector((state) => state.auth.user?.id)

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<EDUCATION_RESULT | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<EDUCATION_RESULT | null>(null)

    const { data } = useReadEducationQuery()
    const [createEducation, { isLoading: isCreating, error: createError }] = useCreateEducationMutation()
    const [updateEducation, { isLoading: isUpdating, error: updateError }] = useUpdateEducationMutation()
    const [deleteEducation, { isLoading: isDeleting }] = useDeleteEducationMutation()

    const isPursuing = watch("isPursuing")

    const openCreate = () => {
        setEditing(null)
        reset({
            education_name: "",
            percentage: "",
            year: "",
            isPursuing: false,
        })
        setFormOpen(true)
    }

    const openEdit = (item: EDUCATION_RESULT) => {
        setEditing(item)
        reset({
            education_name: item.education_name ?? "",
            percentage: item.percentage ?? "",
            year: item.year ?? "",
            isPursuing: item.isPursuing ?? false,
        })
        setFormOpen(true)
    }

    const onSubmit = async (formData: EducationFormData) => {
        if (!userId) return
        if (editing) {
            await updateEducation({ id: editing.id, userId, ...formData }).unwrap()
        } else {
            await createEducation({ userId, ...formData }).unwrap()
        }
        setFormOpen(false)
        setEditing(null)
        reset()
    }

    const onDelete = async () => {
        if (!deleteTarget) return
        await deleteEducation({ id: deleteTarget.id }).unwrap()
        setDeleteTarget(null)
    }

    const apiError = ((editing ? updateError : createError) as { data?: { message?: string } })?.data?.message
    const isSaving = isCreating || isUpdating

    return (
        <>
            <div className="text-end">
                <Button onClick={openCreate}>Add education</Button>
            </div>

            <Dialog open={formOpen} onOpenChange={setFormOpen}>
                <DialogContent className="sm:max-w-sm">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit education" : "Add education"}</DialogTitle>
                            <DialogDescription>
                                {editing ? "Update this education record." : "Add a new education record."}
                            </DialogDescription>
                        </DialogHeader>
                        <FieldGroup>
                            <Field>
                                <Label htmlFor="education_name">Education name</Label>
                                <Input {...register("education_name")} id="education_name" placeholder="B.Tech in CSE" aria-invalid={!!errors.education_name} />
                                <FieldError errors={[errors.education_name]} />
                            </Field>
                            <Field>
                                <Label htmlFor="percentage">Percentage</Label>
                                <Input {...register("percentage")} id="percentage" placeholder="82.5%" aria-invalid={!!errors.percentage} />
                                <FieldError errors={[errors.percentage]} />
                            </Field>
                            <Field>
                                <Label htmlFor="year">Year</Label>
                                <Input {...register("year")} id="year" placeholder="2020 - 2024" aria-invalid={!!errors.year} />
                                <FieldError errors={[errors.year]} />
                            </Field>
                            <Field>
                                <Label className="flex items-center gap-2 font-normal">
                                    <Input
                                        type="checkbox"
                                        className="size-4"
                                        checked={isPursuing}
                                        onChange={(e) => setValue("isPursuing", e.target.checked)}
                                    />
                                    Currently pursuing
                                </Label>
                            </Field>
                        </FieldGroup>
                        <DialogFooter className="mt-6">
                            <DialogClose render={<Button variant="outline">Cancel</Button>} />
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? "Saving..." : editing ? "Save changes" : "Add education"}
                            </Button>
                        </DialogFooter>
                        {apiError && <p className="text-sm text-destructive">{apiError}</p>}
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Delete education</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <span className="font-medium text-foreground">{deleteTarget?.education_name}</span>? This action cannot be undone.
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
                        <TableHead>Education</TableHead>
                        <TableHead>Percentage</TableHead>
                        <TableHead>Year</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data && data.result.length > 0
                            ? data.result.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.education_name}</TableCell>
                                    <TableCell>{item.percentage ?? "-"}</TableCell>
                                    <TableCell>{item.year ?? "-"}</TableCell>
                                    <TableCell>{item.isPursuing ? "Pursuing" : "Completed"}</TableCell>
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
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                                        No education records found.
                                    </TableCell>
                                </TableRow>
                            )
                    }
                </TableBody>
            </Table>
        </>
    )
}

export default Education
