import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import styles from '../../assets/styles/profile.styles'
import COLORS from '../../assets/constant/Colors'
import { userAuth } from '../../store/authstore'
import { Ionicons } from '@expo/vector-icons';

export default function Logout() {
    const {logOut} = userAuth();
    // const confirmButton = ()=>{
    //     Alert.alert("Logout", "Are you sure want to logout?",
    //         {text: "Cancel",styles: "cancel"},
    //         {text: "Logout", onPress: ()=>Logout(),style: "destructive"}
    //     )
    // }
    const confirmButton = () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    { text: "Logout", onPress: () => logOut(), style: "destructive" }
  ]);
};

  return (
    <TouchableOpacity onPress={confirmButton} style={styles.logoutButton}>

        <Ionicons 
        name= "log-out-outline"
        size={20}
        color={COLORS.white}/>
        <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  )
}