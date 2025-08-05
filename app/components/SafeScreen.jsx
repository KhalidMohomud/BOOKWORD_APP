import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import COLORS from '../../assets/constant/Colors'
const SafeScreen = ({children}) => {
    const insert  =  useSafeAreaInsets();
  return (
    <View  style={[styles.container ,{paddingTop: insert.top}]}>
      {children}
    </View>
  )
}

export default SafeScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: COLORS.background
    }
})