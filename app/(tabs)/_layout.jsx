import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../assets/constant/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function TabLayouts() {
//     What useSafeAreaInsets() Does
// This hook gives you the current device's safe area padding (in pixels), returned as an object:
    const insets = useSafeAreaInsets()

  return (
   <Tabs screenOptions={{
    headerShown: false,
     tabBarActiveTintColor: COLORS.primary,
     headerShadowVisible: false,
      
      headerTitleStyle: {
       color: COLORS.textPrimary,
        fontWeight: "600",
      },
       
     tabBarStyle:{
        backgroundColor: COLORS.cardBackground,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingTop:5,
        height: 60+insets.bottom,
        paddingBottom: insets.bottom
    

     }
     
     
     
     
     }}>
      <Tabs.Screen name="index" options={{
         title: 'Home',
        tabBarIcon: ({color,size})=>(
         <Ionicons name='home-outline' size={size} color={color}/>
        )  
    }} /> 
      <Tabs.Screen name="create" options={{
         title: 'Create',
         tabBarIcon:({color,size})=>{
            return  <Ionicons name='add-circle-outline' size={size} color={color}/>
         } }} />
      <Tabs.Screen name="profile" options={{ 
        title: 'Profile' ,
           tabBarIcon: ({color,size})=>(
         <Ionicons name='person-outline' size={size} color={color}/>
        )  }} />
   </Tabs>
  )
}