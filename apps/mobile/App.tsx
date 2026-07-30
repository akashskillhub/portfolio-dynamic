import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ReduxProvider from './redux/ReduxProvider'
import { PaperProvider } from 'react-native-paper'

const App = () => {
  return <ReduxProvider>
    <PaperProvider>
      <View>

      </View>
    </PaperProvider>
  </ReduxProvider>
}

export default App

const styles = StyleSheet.create({})