import { zodResolver } from '@hookform/resolvers/zod'
import type { PROJECT_RESULT } from '@repo/types'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import { Image, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import {
    Appbar,
    Button,
    Card,
    Checkbox,
    Chip,
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
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useReadProjectsQuery,
    useUpdateProjectMutation,
} from '../redux/apis/admin.api'
import { useAppSelector } from '../redux/store'

const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    technology: z.string().optional(),
    category: z.array(z.enum(["web", "mobile"])).min(1, "Select at least one category"),
    source_url: z.string().url("Invalid URL").or(z.literal("")),
    live_url: z.string().url("Invalid URL").or(z.literal("")),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const CATEGORIES = ["web", "mobile"] as const

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

const emptyValues: ProjectFormValues = {
    name: "",
    description: "",
    technology: "",
    category: [],
    source_url: "",
    live_url: "",
}

const ProjectForm = ({
    project,
    userId,
    onDone,
}: {
    project?: PROJECT_RESULT
    userId: number
    onDone: () => void
}) => {
    const [createProject, { isLoading: isCreating, error: createError }] = useCreateProjectMutation()
    const [updateProject, { isLoading: isUpdating, error: updateError }] = useUpdateProjectMutation()

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProjectFormValues>({
        resolver: zodResolver(projectSchema),
        defaultValues: emptyValues,
    })

    useEffect(() => {
        if (project) {
            reset({
                name: project.name,
                description: project.description ?? "",
                technology: project.technology?.join(", ") ?? "",
                category: (project.category ?? []) as ProjectFormValues["category"],
                source_url: project.source_url ?? "",
                live_url: project.live_url ?? "",
            })
        }
    }, [project, reset])

    const [hero, setHero] = useState<ImagePicker.ImagePickerAsset | undefined>(undefined)
    const [preview, setPreview] = useState<string | undefined>(project?.hero ?? undefined)

    useEffect(() => {
        setPreview(hero ? hero.uri : project?.hero ?? undefined)
    }, [hero, project])

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.7,
        })
        if (!result.canceled) {
            setHero(result.assets[0])
        }
    }

    const onSubmit = async (values: ProjectFormValues) => {
        const fd = new FormData()
        fd.append("userId", String(userId))
        fd.append("name", values.name)
        if (values.description) fd.append("description", values.description)
        values.technology
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .forEach((t) => fd.append("technology", t))
        values.category.forEach((c) => fd.append("category", c))
        if (values.source_url) fd.append("source_url", values.source_url)
        if (values.live_url) fd.append("live_url", values.live_url)
        if (hero) {
            fd.append("hero", {
                uri: hero.uri,
                name: hero.fileName ?? "hero.jpg",
                type: hero.mimeType ?? "image/jpeg",
            } as unknown as Blob)
        }

        if (project) {
            await updateProject({ id: project.id, fd }).unwrap()
        } else {
            await createProject(fd).unwrap()
        }
        onDone()
    }

    const apiError = getResponseError(editingError(project, createError, updateError))
    const isSaving = isCreating || isUpdating

    return (
        <Dialog.Content>
            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            label="Name"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={!!errors.name}
                        />
                        <HelperText type="error" visible={!!errors.name}>{errors.name?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        label="Description"
                        mode="outlined"
                        multiline
                        numberOfLines={3}
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                    />
                )}
            />
            <Controller
                control={control}
                name="technology"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            label="Technology (comma separated)"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                        />
                        <HelperText type="info">e.g. React, Node.js, PostgreSQL</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                    <>
                        <View style={styles.checkboxRow}>
                            {CATEGORIES.map((category) => (
                                <Checkbox.Item
                                    key={category}
                                    label={category}
                                    status={value.includes(category) ? "checked" : "unchecked"}
                                    onPress={() => {
                                        onChange(
                                            value.includes(category)
                                                ? value.filter((c) => c !== category)
                                                : [...value, category]
                                        )
                                    }}
                                />
                            ))}
                        </View>
                        <HelperText type="error" visible={!!errors.category}>{errors.category?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                name="source_url"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            label="Source URL"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={!!errors.source_url}
                        />
                        <HelperText type="error" visible={!!errors.source_url}>{errors.source_url?.message}</HelperText>
                    </>
                )}
            />
            <Controller
                control={control}
                name="live_url"
                render={({ field: { onChange, onBlur, value } }) => (
                    <>
                        <TextInput
                            label="Live URL"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            onBlur={onBlur}
                            error={!!errors.live_url}
                        />
                        <HelperText type="error" visible={!!errors.live_url}>{errors.live_url?.message}</HelperText>
                    </>
                )}
            />
            {apiError && <HelperText type="error" visible>{apiError}</HelperText>}
            <Button
                mode="outlined"
                icon="image"
                onPress={pickImage}
                style={styles.heroButton}
            >
                {hero || project?.hero ? "Change hero image" : "Pick hero image"}
            </Button>
            {preview && (
                <Image source={{ uri: preview }} style={styles.heroPreview} resizeMode="cover" />
            )}
            <Dialog.Actions>
                <Button mode="contained" loading={isSaving} disabled={isSaving} onPress={handleSubmit(onSubmit)}>
                    {project ? "Update" : "Add"}
                </Button>
            </Dialog.Actions>
        </Dialog.Content>
    )
}

function editingError(
    project: PROJECT_RESULT | undefined,
    createError: unknown,
    updateError: unknown
): unknown {
    return project ? updateError : createError
}

const Projects = () => {
    const userId = useAppSelector((state) => state.auth.user?.id)
    const { data, isLoading, isFetching, refetch } = useReadProjectsQuery()
    const [deleteProject, { isLoading: isDeleting, error: deleteError }] = useDeleteProjectMutation()

    const [formOpen, setFormOpen] = useState(false)
    const [editing, setEditing] = useState<PROJECT_RESULT | undefined>()
    const [deleteTarget, setDeleteTarget] = useState<PROJECT_RESULT | null>(null)
    const [snackbar, setSnackbar] = useState("")

    const openCreate = () => {
        setEditing(undefined)
        setFormOpen(true)
    }

    const openEdit = (project: PROJECT_RESULT) => {
        setEditing(project)
        setFormOpen(true)
    }

    const onDelete = async () => {
        if (!deleteTarget) return
        try {
            await deleteProject({ id: deleteTarget.id }).unwrap()
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
        setDeleteTarget(null)
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Projects" />
            </Appbar.Header>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={isFetching} onRefresh={refetch} />
                }
            >
                {isLoading && <Text style={styles.center}>Loading...</Text>}
                {data && data.result.length === 0 && (
                    <Text style={styles.center}>No projects found. Tap + to add one.</Text>
                )}
                {data?.result.map((project) => (
                    <Card key={project.id} mode="outlined" style={styles.card}>
                        {project.hero && (
                            <Card.Cover source={{ uri: project.hero }} resizeMode="cover" />
                        )}
                        <Card.Title
                            title={project.name}
                            subtitle={project.category?.join(", ")}
                            right={(props) => (
                                <View style={styles.cardActions}>
                                    <IconButton {...props} icon="pencil" onPress={() => openEdit(project)} />
                                    <IconButton {...props} icon="delete" onPress={() => setDeleteTarget(project)} />
                                </View>
                            )}
                        />
                        {project.description ? (
                            <Card.Content>
                                <Text variant="bodyMedium">{project.description}</Text>
                            </Card.Content>
                        ) : null}
                        {project.technology && project.technology.length > 0 && (
                            <Card.Content style={styles.chips}>
                                {project.technology.map((tech) => (
                                    <Chip key={tech} icon="tag">{tech}</Chip>
                                ))}
                            </Card.Content>
                        )}
                        {(project.source_url || project.live_url) && (
                            <Card.Actions>
                                {project.source_url && (
                                    <Button icon="github" onPress={() => setSnackbar(project.source_url!)}>Source</Button>
                                )}
                                {project.live_url && (
                                    <Button icon="open-in-new" onPress={() => setSnackbar(project.live_url!)}>Demo</Button>
                                )}
                            </Card.Actions>
                        )}
                    </Card>
                ))}
            </ScrollView>

            <Portal>
                <Dialog visible={formOpen} onDismiss={() => setFormOpen(false)}>
                    <Dialog.Title>{editing ? "Edit Project" : "Add Project"}</Dialog.Title>
                    {userId && (
                        <ProjectForm
                            project={editing}
                            userId={userId}
                            onDone={() => setFormOpen(false)}
                        />
                    )}
                </Dialog>

                <Dialog visible={!!deleteTarget} onDismiss={() => setDeleteTarget(null)}>
                    <Dialog.Title>Delete project</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete "{deleteTarget?.name}"?</Text>
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
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    cardActions: { flexDirection: "row" },
    checkboxRow: { flexDirection: "row", alignItems: "center" },
    fab: { position: "absolute", right: 16, bottom: 16 },
    heroButton: { marginTop: 12 },
    heroPreview: { width: "100%", height: 140, borderRadius: 8, marginTop: 12 },
})

export default Projects