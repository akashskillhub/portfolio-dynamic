"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useReadProjectsQuery,
    useUpdateProjectMutation,
} from "@/redux/apis/admin.api"
import { useAppSelector } from "@/redux/store"
import type { PROJECT_RESULT } from "@repo/types"
import { Pencil, Plus, Trash2 } from "lucide-react"

const projectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    technology: z.string().optional(),
    category: z.array(z.enum(["web", "mobile"])).min(1, "Select at least one category"),
    source_url: z.string().url("Invalid URL").or(z.literal("")),
    live_url: z.string().url("Invalid URL").or(z.literal("")),
    hero: z.instanceof(File).optional(),
})

type ProjectFormData = z.infer<typeof projectSchema>

const ProjectForm = ({
    project,
    userId,
    onSuccess,
}: {
    project?: PROJECT_RESULT
    userId: number
    onSuccess: () => void
}) => {
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation()
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation()

    const {
        register,
        handleSubmit,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            technology: "",
            category: [],
            source_url: "",
            live_url: "",
        },
    })

    useEffect(() => {
        if (project) {
            reset({
                name: project.name,
                description: project.description ?? "",
                technology: project.technology?.join(", ") ?? "",
                category: (project.category ?? []) as ProjectFormData["category"],
                source_url: project.source_url ?? "",
                live_url: project.live_url ?? "",
            })
        }
    }, [project, reset])

    const hero = watch("hero")
    const [preview, setPreview] = useState<string | undefined>()
    useEffect(() => {
        if (hero) {
            const url = URL.createObjectURL(hero)
            setPreview(url)
            return () => URL.revokeObjectURL(url)
        }
        setPreview(project?.hero ?? undefined)
    }, [hero, project])

    const onSubmit = async (data: ProjectFormData) => {
        const fd = new FormData()
        fd.append("userId", String(userId))
        fd.append("name", data.name)
        if (data.description) fd.append("description", data.description)
        data.technology
            ?.split(",")
            .map((t) => t.trim())
            .filter(Boolean)
            .forEach((t) => fd.append("technology", t))
        data.category.forEach((c) => fd.append("category", c))
        if (data.source_url) fd.append("source_url", data.source_url)
        if (data.live_url) fd.append("live_url", data.live_url)
        if (data.hero) fd.append("hero", data.hero)

        if (project) {
            await updateProject({ id: project.id, fd }).unwrap()
        } else {
            await createProject(fd).unwrap()
        }
        onSuccess()
    }

    const isLoading = isCreating || isUpdating

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
                <Field>
                    <Label htmlFor="name">Name</Label>
                    <Input {...register("name")} id="name" placeholder="Portfolio website" aria-invalid={!!errors.name} />
                    <FieldError errors={[errors.name]} />
                </Field>
                <Field>
                    <Label htmlFor="description">Description</Label>
                    <Input {...register("description")} id="description" placeholder="A fullstack portfolio site" aria-invalid={!!errors.description} />
                    <FieldError errors={[errors.description]} />
                </Field>
                <Field>
                    <Label htmlFor="technology">Technology (comma separated)</Label>
                    <Input {...register("technology")} id="technology" placeholder="Next.js, Tailwind, Drizzle" aria-invalid={!!errors.technology} />
                    <FieldError errors={[errors.technology]} />
                </Field>
                <Field>
                    <Label>Category</Label>
                    <div className="flex gap-6">
                        <Label className="flex items-center gap-2 font-normal">
                            <Input type="checkbox" value="web" className="size-4" {...register("category")} />
                            Web
                        </Label>
                        <Label className="flex items-center gap-2 font-normal">
                            <Input type="checkbox" value="mobile" className="size-4" {...register("category")} />
                            Mobile
                        </Label>
                    </div>
                    <FieldError errors={[errors.category]} />
                </Field>
                <Field>
                    <Label htmlFor="source_url">Source URL</Label>
                    <Input {...register("source_url")} id="source_url" type="url" placeholder="https://github.com/..." aria-invalid={!!errors.source_url} />
                    <FieldError errors={[errors.source_url]} />
                </Field>
                <Field>
                    <Label htmlFor="live_url">Live URL</Label>
                    <Input {...register("live_url")} id="live_url" type="url" placeholder="https://example.com" aria-invalid={!!errors.live_url} />
                    <FieldError errors={[errors.live_url]} />
                </Field>
                <Field>
                    <Label htmlFor="hero">Hero image</Label>
                    <Input
                        id="hero"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setValue("hero", e.target.files?.[0])}
                    />
                </Field>
            </FieldGroup>
            {preview && (
                <Image src={preview} height={160} width={240} unoptimized alt="Hero preview" className="mt-4 rounded-xl object-cover" />
            )}
            <DialogFooter className="mt-6">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : project ? "Update" : "Create"}
                </Button>
            </DialogFooter>
        </form>
    )
}

const Project = () => {
    const userId = useAppSelector((state) => state.auth.user?.id)
    const { data: projectsData, isLoading } = useReadProjectsQuery()
    const [deleteProject] = useDeleteProjectMutation()

    const [open, setOpen] = useState(false)
    const [editing, setEditing] = useState<PROJECT_RESULT | undefined>()
    const [deleting, setDeleting] = useState<PROJECT_RESULT | undefined>()

    return (
        <Card className="w-full">
            <CardHeader className="flex-row items-center justify-between">
                <div>
                    <CardTitle>Projects</CardTitle>
                    <CardDescription>Manage your portfolio projects.</CardDescription>
                </div>
                <Dialog open={open} onOpenChange={(value) => {
                    setOpen(value)
                    if (!value) setEditing(undefined)
                }}>
                    <DialogTrigger render={<Button><Plus />Add Project</Button>} />
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? "Edit Project" : "Add Project"}</DialogTitle>
                            <DialogDescription>
                                {editing ? "Update the project details." : "Add a new project to your portfolio."}
                            </DialogDescription>
                        </DialogHeader>
                        {userId && (
                            <ProjectForm
                                project={editing}
                                userId={userId}
                                onSuccess={() => setOpen(false)}
                            />
                        )}
                        {!userId && (
                            <p className="text-sm text-muted-foreground">Please login to add projects.</p>
                        )}
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Technology</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Loading...</TableCell>
                            </TableRow>
                        )}
                        {projectsData?.result?.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell>{project.category?.join(", ")}</TableCell>
                                <TableCell className="max-w-60 truncate">{project.technology?.join(", ")}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditing(project)
                                                setOpen(true)
                                            }}
                                        >
                                            <Pencil />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => setDeleting(project)}
                                        >
                                            <Trash2 />
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>

            <Dialog open={!!deleting} onOpenChange={(value) => !value && setDeleting(undefined)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete project</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleting?.name}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleting(undefined)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (deleting) {
                                    await deleteProject({ id: deleting.id }).unwrap()
                                    setDeleting(undefined)
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default Project
