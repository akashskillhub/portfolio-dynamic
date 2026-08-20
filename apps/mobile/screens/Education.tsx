import { zodResolver } from '@hookform/resolvers/zod'
import type { EDUCATION_RESULT } from '@repo/types'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import {
    Appbar,
    Button,
    Card,
    Checkbox,
    Dialog,
    FAB,
    HelperText,
    IconButton,
    Portal,
    Snackbar,
    Text,
    TextInput,
} from 'react-native-paper'
import { z } from 'zod'
import {
    useCreateEducationMutation,
    useDeleteEducationMutation,
    useReadEducationQuery,
    useUpdateEducationMutation,
} from '../redux/apis/admin.api'
import { useAppSelector } from '../redux/store'

const educationSchema = z.object({
    education_name: z.string().min(1, "Education name is required"),
    percentage: z.string().optional(),
    year: z.string().min(1, "Year is required"),
    isPursuing: z.boolean().optional(),
})

type EducationFormValues = z.infer<typeof educationSchema>

function getResponseError(error: unknown): string {
    if (typeof error === "object" && error !== null && "data" in error) {
        const data = (error as { data?: unknown }).data
        if (typeof data === "object" && data !== null && "message" in data) {
            const message = (data as { message?: unknown }).message
            if (typeof message === "string") return message
        }
    }
    return "Something went wrong. Please try again."
}

const emptyValues: EducationFormValues = {
    education_name: "",
    percentage: "",
    year: "",
    isPursuing: false,
}

const EducationForm = ({
    education,
    userId,
    onDone,
}: {
    education?: EDUCATION_RESULT
    userId: number
    onDone: () => void
}) => {
    const [createEducation, { isLoading: isCreating, error: createError }] = useCreateEducationMutation()
    const [updateEducation, { isLoading: isUpdating, error: updateError }] = useUpdateEducationMutation()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EducationFormValues>({
        resolver: zodResolver(educationSchema),
        defaultValues: emptyValues,
    })

    useEffect(() => {
        if (education) {
            reset({
                education_name: education.education_name ?? "",
                percentage: education.percentage ?? "",
                year: education.year ?? "",
                isPursuing: education.isPursuing ?? false,
            })
        }
    }, [education, reset])

    const onSubmit = async (values: EducationFormValues) => {
        const payload = {
            userId,
            education_name: values.education_name,
            percentage: values.percentage,
            year: values.year,
            isPursuing: values.isPursuing,
        }
        if (education) {
            await updateEducation({ id: education.id, ...payload }).unwrap()
        } else {
            await createEducation(payload).unwrap()
        }
        onDone()
    }

    const apiError = getResponseError(education ? updateError : createError)
    const isSaving = isCreating || isUpdating

    return (
        <Dialog.Content>
            <Controller
                control={control}
                name="education_name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            label="Education name"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={!!errors.education_name}
                        />
                        <HelperText type="error" visible={!!errors.education_name}>{errors.education_name?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                name="percentage"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            label="Percentage"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="82.5%"
                            error={!!errors.percentage}
                        />
                        <HelperText type="error" visible={!!errors.percentage}>{errors.percentage?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                name="year"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            label="Year"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            placeholder="2020 - 2024"
                            error={!!errors.year}
                        />
                        <HelperText type="error" visible={!!errors.year}>{errors.year?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                name="isPursuing"
                render={({ field: { onChange, value } }) => (
                    <Checkbox.Item
                        label="Currently pursuing"
                        status={value ? "checked" : "unchecked"}
                        onPress={() => onChange(!value)}
                    />
                )}
            />
            {apiError && <HelperText type="error" visible>{apiError}</HelperText>}
            <Dialog.Actions>
                <Button mode="contained" loading={isSaving} disabled={isSaving} onPress={handleSubmit(onSubmit)}>
                    {education ? "Update" : "Add"}
                </Button>
            </Dialog.Actions>
        </Dialog.Content>
    )
}

const Education = () => {
    const userId = useAppSelector((state) => state.auth.user?.id)
    const { data, isLoading, isFetching, refetch } = useReadEducationQuery()
    const [deleteEducation, { isLoading: isDeleting, error: deleteError }] = useDeleteEducationMutation()

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<EDUCATION_RESULT | undefined>()
    const [deleteTarget, setDeleteTarget] = useState<EDUCATION_RESULT | null>(null)
    const [snackbar, setSnackbar] = useState("")

    const openCreate = () => {
        setEditing(undefined)
        setFormOpen(true)
    }

    const openEdit = (education: EDUCATION_RESULT) => {
        setEditing(education)
        setFormOpen(true)
    }

    const onDelete = async () => {
        if (!deleteTarget) return
        try {
            await deleteEducation({ id: deleteTarget.id }).unwrap()
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
        setDeleteTarget(null)
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Education" />
            </Appbar.Header>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} />
                }
            >
                {isLoading && <Text style={styles.center}>Loading...</Text>}
                {data && data.result.length === 0 && (
                    <Text style={styles.center}>No education records found. Tap + to add one.</Text>
                )}
                {data?.result.map((education) => (
                    <Card key={education.id} mode="outlined" style={styles.card}>
                        <Card.Title
                            title={education.education_name ?? ""}
                            subtitle={education.year ?? ""}
                            right={(props) => (
                                <View style={styles.cardActions}>
                                    <IconButton {...props} icon="pencil" onPress={() => openEdit(education)} />
                                    <IconButton {...props} icon="delete" onPress={() => setDeleteTarget(education)} />
                                </View>
                            )}
                        />
                        <Card.Content style={styles.row}>
                            <Text variant="bodyMedium">
                                Percentage: {education.percentage ?? "-"}
                            </Text>
                            <Text variant="bodyMedium">
                                Status: {education.isPursuing ? "Pursuing" : "Completed"}
                            </Text>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            <Portal>
                <Dialog visible={formOpen} onDismiss={() => setFormOpen(false)}>
                    <Dialog.Title>{editing ? "Edit Education" : "Add Education"}</Dialog.Title>
                    {userId && (
                        <EducationForm
                            education={editing}
                            userId={userId}
                            onDone={() => setFormOpen(false)}
                        />
                    )}
                </Dialog>

                <Dialog visible={!!deleteTarget} onDismiss={() => setDeleteTarget(null)}>
                    <Dialog.Title>Delete education</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete "{deleteTarget?.education_name}"?</Text>
                        {deleteError && (
                            <HelperText type="error" visible>{getResponseError(deleteError)}</HelperText>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button loading={isDeleting} disabled={isDeleting} onPress={onDelete}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <FAB icon="plus" style={styles.fab} onPress={openCreate} />

            <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar("")} duration={3000}>
                {snackbar}
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16, paddingBottom: 96 },
    center: { textAlign: "center", marginTop: 24, color: "#666" },
    card: { marginBottom: 12 },
    row: { flexDirection: "row", justifyContent: "space-between" },
    cardActions: { flexDirection: "row" },
    fab: { position: "absolute", right: 16, bottom: 16 },
})

export default Education