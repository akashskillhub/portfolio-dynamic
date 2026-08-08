import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { useDispatch } from 'react-redux'
import { Appbar, Button, Card, Divider, List, Snackbar } from 'react-native-paper'
import { useSignoutMutation } from '../redux/apis/auth.api'
import { clearCredentials } from '../redux/slices/auth.slice'
import { useAppSelector } from '../redux/store'

const Settings = () => {
    const dispatch = useDispatch()
    const { user } = useAppSelector((state) => state.auth)
    const [signout, { isLoading }] = useSignoutMutation()
    const [visible, setVisible] = useState(false)
    const [notice, setNotice] = useState("")

    const onLogout = async () => {
        try {
            await signout().unwrap()
        } catch {
            setNotice("Failed to sign out from server")
            setVisible(true)
        } finally {
            dispatch(clearCredentials())
        }
    }

    return (
        <ScrollView>
            <Appbar.Header>
                <Appbar.Content title="Settings" />
            </Appbar.Header>
            <Card mode="outlined">
                <Card.Title title="Account" subtitle="Signed in details" />
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
                </Card.Content>
            </Card>
            <Card mode="outlined">
                <Card.Content>
                    <Button
                        mode="contained"
                        icon="logout"
                        loading={isLoading}
                        disabled={isLoading}
                        onPress={onLogout}
                    >
                        Logout
                    </Button>
                </Card.Content>
            </Card>
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                duration={3000}
            >
                {notice}
            </Snackbar>
        </ScrollView>
    )
}

export default Settings
