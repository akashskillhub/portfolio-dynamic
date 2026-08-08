import React from 'react'
import { ScrollView } from 'react-native'
import { Appbar, Card, Chip, List, Text } from 'react-native-paper'

const education = [
    {
        title: 'B.Tech in Computer Science',
        description: 'XYZ University',
        year: '2020 - 2024',
        chips: ['Software Engineering', 'Data Structures'],
    },
    {
        title: 'Higher Secondary (12th)',
        description: 'ABC School',
        year: '2018 - 2020',
        chips: ['Science', 'Mathematics'],
    },
]

const Education = () => {
    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.Content title="Education" />
            </Appbar.Header>
            {education.map((item) => (
                <Card key={item.title} mode="outlined">
                    <Card.Title
                        title={item.title}
                        subtitle={item.description}
                        right={() => <Text variant="labelMedium">{item.year}</Text>}
                        rightStyle={{ marginRight: 16 }}
                    />
                    <Card.Content>
                        <List.Section>
                            {item.chips.map((chip) => (
                                <Chip key={chip} icon="check-circle">{chip}</Chip>
                            ))}
                        </List.Section>
                    </Card.Content>
                </Card>
            ))}
        </ScrollView>
    )
}

export default Education
