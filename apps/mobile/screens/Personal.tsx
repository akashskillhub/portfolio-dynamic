import React from 'react'
import { ScrollView } from 'react-native'
import { Appbar, Avatar, Card, Chip, Divider, List, Text } from 'react-native-paper'
import { useAppSelector } from '../redux/store'

const Personal = () => {
    const { user } = useAppSelector((state) => state.auth)

    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.Content title="Personal" />
            </Appbar.Header>
            <Card mode="outlined">
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
                    <Text variant="bodyMedium">
                        Passionate about building clean, scalable web and mobile applications with modern tools.
                    </Text>
                </Card.Content>
            </Card>
            <Card mode="outlined">
                <Card.Title title="Skills" />
                <Card.Content>
                    <Chip icon="language-typescript">TypeScript</Chip>
                    <Chip icon="server">Node.js</Chip>
                    <Chip icon="cellphone">React Native</Chip>
                    <Chip icon="database">PostgreSQL</Chip>
                </Card.Content>
            </Card>
        </ScrollView>
    )
}

export default Personal
