import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { userAuth } from '../../store/authstore';

export default function profile() {
   const {token , logOut} = userAuth();
  return (
    <View>
     <TouchableOpacity onPress={logOut}>
       <Text>LogoUt</Text>
     </TouchableOpacity>
    </View>
  )
}