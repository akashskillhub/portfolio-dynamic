import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PaperProvider } from 'react-native-paper'
import ReduxProvider from './redux/ReduxProvider'
import { useAppSelector } from './redux/store'
import Login from './screens/Login'
import Home from './screens/Home'

export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>()

const RootNavigator = () => {
    const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                    <Stack.Screen name="Home" component={Home} />
                ) : (
                    <Stack.Screen name="Login" component={Login} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const App = () => {
    return (
        <ReduxProvider>
            <PaperProvider>
                <RootNavigator />
            </PaperProvider>
        </ReduxProvider>
    )
}

export default App
