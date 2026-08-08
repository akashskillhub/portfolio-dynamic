import React from 'react'
import { ScrollView } from 'react-native'
import { Appbar, Button, Card, Chip, Text } from 'react-native-paper'

const projects = [
    {
        title: 'Portfolio Platform',
        description: 'Full stack portfolio with admin dashboard, email OTP authentication and mobile app.',
        chips: ['React', 'React Native', 'Node.js', 'PostgreSQL'],
    },
    {
        title: 'E-commerce Store',
        description: 'Online store with cart, checkout and payment integration.',
        chips: ['Next.js', 'Tailwind CSS', 'Stripe'],
    },
]

const Projects = () => {
    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.Content title="Projects" />
            </Appbar.Header>
            {projects.map((project) => (
                <Card key={project.title} mode="outlined">
                    <Card.Title title={project.title} />
                    <Card.Content>
                        <Text variant="bodyMedium">{project.description}</Text>
                    </Card.Content>
                    <Card.Content>
                        {project.chips.map((chip) => (
                            <Chip key={chip} icon="tag">{chip}</Chip>
                        ))}
                    </Card.Content>
                    <Card.Actions>
                        <Button icon="github">Source</Button>
                        <Button icon="open-in-new">Demo</Button>
                    </Card.Actions>
                </Card>
            ))}
        </ScrollView>
    )
}

export default Projects
