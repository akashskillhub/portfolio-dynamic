import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Personal from './Personal'
import Education from './Education'
import Projects from './Projects'
import Settings from './Settings'

export type HomeTabParamList = {
    Personal: undefined;
    Education: undefined;
    Projects: undefined;
    Settings: undefined;
}

const Tab = createBottomTabNavigator<HomeTabParamList>()

const Home = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Personal"
                component={Personal}
                options={{
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Education"
                component={Education}
                options={{
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="school" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Projects"
                component={Projects}
                options={{
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="folder-multiple" color={color} size={size} />,
                }}
            />
            <Tab.Screen
                name="Settings"
                component={Settings}
                options={{
                    tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />,
                }}
            />
        </Tab.Navigator>
    )
}

export default Home
