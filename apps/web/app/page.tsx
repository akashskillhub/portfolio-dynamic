"use client"

import Image from "next/image"
import React from "react"
import { useReadPublicQuery } from "../redux/apis/public.api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const Home = () => {
    const { data, isLoading, error } = useReadPublicQuery()

    if (isLoading) {
        return (
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center text-sm text-destructive">
                Failed to load portfolio data.
            </div>
        )
    }

    const { user, skills, projects, education, social } = data?.result ?? {
        user: null,
        skills: [],
        projects: [],
        education: [],
        social: [],
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
            <Card>
                <CardHeader className="flex-row items-center gap-4">
                    <Avatar size="lg">
                        {user?.profile && <AvatarImage src={user.profile} alt={user.name ?? "Profile"} />}
                        <AvatarFallback>{(user?.name ?? "P")[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl">{user?.name ?? "Portfolio Owner"}</CardTitle>
                        <CardDescription>{user?.email}</CardDescription>
                        <CardDescription>{user?.mobile}</CardDescription>
                    </div>
                </CardHeader>
            </Card>

            {skills.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                            <span
                                key={skill.id}
                                className="rounded-full bg-muted px-3 py-1 text-sm"
                            >
                                {skill.skill_name}
                            </span>
                        ))}
                    </CardContent>
                </Card>
            )}

            {projects.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        {projects.map((project) => (
                            <Card key={project.id} size="sm" className="h-fit">
                                {project.hero && (
                                    <Image
                                        src={project.hero}
                                        alt={project.name}
                                        width={480}
                                        height={270}
                                        className="aspect-video w-full object-cover"
                                        unoptimized
                                    />
                                )}
                                <CardHeader>
                                    <CardTitle>{project.name}</CardTitle>
                                    <CardDescription>{project.category?.join(", ")}</CardDescription>
                                </CardHeader>
                                {project.description && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{project.description}</p>
                                    </CardContent>
                                )}
                                {project.technology && project.technology.length > 0 && (
                                    <CardContent className="flex flex-wrap gap-2">
                                        {project.technology.map((tech) => (
                                            <span
                                                key={tech}
                                                className="rounded-full bg-muted px-3 py-1 text-xs"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            )}

            {education.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Education</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {education.map((item) => (
                            <div key={item.id}>
                                <div className="font-medium">{item.education_name}</div>
                                <div className="text-sm text-muted-foreground">{item.year}</div>
                                <div className="text-sm text-muted-foreground">
                                    Percentage: {item.percentage ?? "-"} ·{" "}
                                    {item.isPursuing ? "Pursuing" : "Completed"}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {social.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Social Links</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {social.map((link) => (
                            <a
                                key={link.id}
                                href={link.platformLink ?? "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-full bg-muted px-3 py-1 text-sm hover:bg-primary hover:text-primary-foreground"
                            >
                                {link.platform}
                            </a>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default Home