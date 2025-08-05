import React from 'react'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const authLayout = () => {
  return (
   
     <Stack  screenOptions={{headerShown: false}}/>
  )
}

export default authLayout