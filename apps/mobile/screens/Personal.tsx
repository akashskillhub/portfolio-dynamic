import { zodResolver } from '@hookform/resolvers/zod'
import type { SKILL_RESULT } from '@repo/types'
import React, { useEffect, useState } from 'react'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { Controller, useForm } from 'react-hook-form'
import {
    Appbar,
    Avatar,
    Button,
    Card,
    Chip,
    Dialog,
    Divider,
    FAB,
    HelperText,
    IconButton,
    List,
    Portal,
    Snackbar,
    Text,
    TextInput,
} from 'react-native-paper'
import { z } from 'zod'
import {
    useCreateSkillMutation,
    useDeleteSkillMutation,
    useReadSkillsQuery,
    useUpdateProfileMutation,
    useUpdateSkillMutation,
} from '../redux/apis/admin.api'
import { useAppSelector } from '../redux/store'

const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Mobile must be at least 10 digits"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const skillSchema = z.object({
    skill_name: z.string().min(1, "Skill name is required"),
})

type SkillFormValues = z.infer<typeof skillSchema>

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

const Personal = () => {
    const { user } = useAppSelector((state) => state.auth)
    const userId = user?.id

    const { data: skillsData, isLoading: skillsLoading, isFetching: skillsFetching, refetch: refetchSkills } = useReadSkillsQuery()
    const [createSkill, { isLoading: isCreatingSkill, error: createSkillError }] = useCreateSkillMutation()
    const [updateSkill, { isLoading: isUpdatingSkill, error: updateSkillError }] = useUpdateSkillMutation()
    const [deleteSkill, { isLoading: isDeletingSkill, error: deleteSkillError }] = useDeleteSkillMutation()
    const [updateProfile, { isLoading: isUpdatingProfile, error: profileError }] = useUpdateProfileMutation()

    const [skillFormOpen, setSkillFormOpen] = useState(false)
    const [editingSkill, setEditingSkill] = useState<SKILL_RESULT | undefined>()
    const [deleteTarget, setDeleteTarget] = useState<SKILL_RESULT | null>(null)
    const [snackbar, setSnackbar] = useState("")

    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            mobile: user?.mobile ?? "",
        },
    })

    const {
        control: skillControl,
        handleSubmit: handleSkillSubmit,
        reset: resetSkill,
        formState: { errors: skillErrors },
    } = useForm<SkillFormValues>({
        resolver: zodResolver(skillSchema),
        defaultValues: { skill_name: "" },
    })

    useEffect(() => {
        if (editingSkill) {
            resetSkill({ skill_name: editingSkill.skill_name ?? "" })
        }
    }, [editingSkill, resetSkill])

    const onProfileSubmit = async (values: ProfileFormValues) => {
        try {
            await updateProfile(values).unwrap()
            setSnackbar("Profile updated")
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
    }

    const onSkillSubmit = async (values: SkillFormValues) => {
        if (!userId) return
        try {
            if (editingSkill) {
                await updateSkill({ id: editingSkill.id, userId, ...values }).unwrap()
            } else {
                await createSkill({ userId, ...values }).unwrap()
            }
            setSkillFormOpen(false)
            setEditingSkill(undefined)
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
    }

    const onDeleteSkill = async () => {
        if (!deleteTarget) return
        try {
            await deleteSkill({ id: deleteTarget.id }).unwrap()
        } catch (err) {
            setSnackbar(getResponseError(err))
        }
        setDeleteTarget(null)
    }

    const skillApiError = getResponseError(editingSkill ? updateSkillError : createSkillError)

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Personal" />
            </Appbar.Header>
            <ScrollView
                contentContainerStyle={styles.content}
                refreshControl={
                    <RefreshControl refreshing={skillsFetching} onRefresh={refetchSkills} />
                }
            >
                <Card mode="outlined" style={styles.card}>
                    <Card.Title
                        title={user?.email ?? "Portfolio Owner"}
                        subtitle="Full Stack Developer"
                        left={(props) => <Avatar.Text {...props} size={48} label="PF" />}
                    />
                    <Card.Content>
                        <List.Item
                            title="Email"
                            description={user?.email ?? "Not available"}
                            left={() => <List.Icon icon="email" />}
                        />
                        <Divider />
                        <List.Item
                            title="Mobile"
                            description={user?.mobile ?? "Not available"}
                            left={() => <List.Icon icon="phone" />}
                        />
                        <Divider />
                        <Text variant="bodyMedium" style={styles.sectionTitle}>
                            Update profile
                        </Text>
                        <Controller
                            control={profileControl}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <TextInput
                                        label="Name"
                                        mode="outlined"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={!!profileErrors.name}
                                    />
                                    <HelperText type="error" visible={!!profileErrors.name}>{profileErrors.name?.message}</HelperText>
                                </>
                            )}
                        />
                        <Controller
                            control={profileControl}
                            name="email"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <TextInput
                                        label="Email"
                                        mode="outlined"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        error={!!profileErrors.email}
                                    />
                                    <HelperText type="error" visible={!!profileErrors.email}>{profileErrors.email?.message}</HelperText>
                                </>
                            )}
                        />
                        <Controller
                            control={profileControl}
                            name="mobile"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <TextInput
                                        label="Mobile"
                                        mode="outlined"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        keyboardType="phone-pad"
                                        error={!!profileErrors.mobile}
                                    />
                                    <HelperText type="error" visible={!!profileErrors.mobile}>{profileErrors.mobile?.message}</HelperText>
                                </>
                            )}
                        />
                        {profileError && (
                            <HelperText type="error" visible>{getResponseError(profileError)}</HelperText>
                        )}
                        <Button
                            mode="contained"
                            loading={isUpdatingProfile}
                            disabled={isUpdatingProfile}
                            onPress={handleProfileSubmit(onProfileSubmit)}
                            style={styles.button}
                        >
                            Update profile
                        </Button>
                    </Card.Content>
                </Card>

                <Card mode="outlined" style={styles.card}>
                    <Card.Title
                        title="Skills"
                        right={(props) => (
                            <IconButton
                                {...props}
                                icon="plus"
                                onPress={() => {
                                    setEditingSkill(undefined)
                                    resetSkill({ skill_name: "" })
                                    setSkillFormOpen(true)
                                }}
                            />
                        )}
                    />
                    <Card.Content style={styles.chips}>
                        {skillsLoading && <Text>Loading...</Text>}
                        {skillsData && skillsData.result.length === 0 && (
                            <Text>No skills added yet.</Text>
                        )}
                        {skillsData?.result.map((skill) => (
                            <Chip
                                key={skill.id}
                                icon="tag"
                                onPress={() => {
                                    setEditingSkill(skill)
                                    setSkillFormOpen(true)
                                }}
                                onClose={() => setDeleteTarget(skill)}
                            >
                                {skill.skill_name}
                            </Chip>
                        ))}
                    </Card.Content>
                </Card>
            </ScrollView>

            <Portal>
                <Dialog visible={skillFormOpen} onDismiss={() => setSkillFormOpen(false)}>
                    <Dialog.Title>{editingSkill ? "Edit Skill" : "Add Skill"}</Dialog.Title>
                    <Dialog.Content>
                        <Controller
                            control={skillControl}
                            name="skill_name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <>
                                    <TextInput
                                        label="Skill name"
                                        mode="outlined"
                                        value={value}
                                        onChangeText={onChange}
                                        onBlur={onBlur}
                                        error={!!skillErrors.skill_name}
                                    />
                                    <HelperText type="error" visible={!!skillErrors.skill_name}>{skillErrors.skill_name?.message}</HelperText>
                                </>
                            )}
                        />
                        {skillApiError && <HelperText type="error" visible>{skillApiError}</HelperText>}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setSkillFormOpen(false)}>Cancel</Button>
                        <Button
                            mode="contained"
                            loading={isCreatingSkill || isUpdatingSkill}
                            disabled={isCreatingSkill || isUpdatingSkill}
                            onPress={handleSkillSubmit(onSkillSubmit)}
                        >
                            {editingSkill ? "Update" : "Add"}
                        </Button>
                    </Dialog.Actions>
                </Dialog>

                <Dialog visible={!!deleteTarget} onDismiss={() => setDeleteTarget(null)}>
                    <Dialog.Title>Delete skill</Dialog.Title>
                    <Dialog.Content>
                        <Text>Are you sure you want to delete "{deleteTarget?.skill_name}"?</Text>
                        {deleteSkillError && (
                            <HelperText type="error" visible>{getResponseError(deleteSkillError)}</HelperText>
                        )}
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button loading={isDeletingSkill} disabled={isDeletingSkill} onPress={onDeleteSkill}>Delete</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>

            <Snackbar visible={!!snackbar} onDismiss={() => setSnackbar("")} duration={3000}>
                {snackbar}
            </Snackbar>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 16 },
    card: { marginBottom: 12 },
    chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    sectionTitle: { marginTop: 8, marginBottom: 8, fontWeight: "600" },
    button: { marginTop: 8 },
})

export default Personal