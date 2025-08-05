import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Alert } from 'react-native'
import React, { useState } from 'react'
import styles  from '../../assets/styles/login.styles'
import COLORS from '../../assets/constant/Colors'
import {Ionicons} from "@expo/vector-icons"
import {Link, useRouter} from "expo-router"
import { Platform } from 'react-native'
import {userAuth }  from '../../store/authstore'

const Login = () => {
   const [email ,setEmail] = useState("");
    const [password ,setPassword] = useState("");
    const [showPassword ,setShowPassword] = useState(false);

    const router =  useRouter()
      const {User , login , isLoading }=  userAuth();
      // console.log("heye", User);

    const handleLogin = async()=>{
      const result = await login(email, password);
      if(!result.success)  Alert.alert("error", result.error);
   
      
      console.log(result)
    //  if(result.success)  router.push('/home'); 
     };
  return (
    <KeyboardAvoidingView 
    style={{flex: 1
    }}
     behavior= {Platform.OS === "android" ? "padding": "height"}>
    <View style={styles.container}>
      <View style={styles.topIllustration}>
         <Image source={require("../../assets/images/i.png")} 
           style={styles.illustrationImage}
            resizeMethod='contain' />
      </View>
            <View style={styles.card}>
            <View style={styles.formContainer}> 
              {/* EMAIL */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                 <View style={styles.inputContainer}>
                  <Ionicons 
                    name="mail-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                    />
                    <TextInput
                     style={styles.input}
                     placeholder='Enter your email'
                     placeholderTextColor={COLORS.placeholderText}
                     value={email}
                     onChangeText={setEmail}
                     keyboardType='email-address'
                     autoCapitalize='none'
                    
                    />
                 </View>
              </View>
                {/* password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>password</Text>
                  <View style={styles.inputContainer}>
                     {/* {icons left} */}
                     <Ionicons 
                    name="lock-closed-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                    />
                     <TextInput
                     style={styles.input}
                     placeholder='Enter your password'
                     placeholderTextColor={COLORS.placeholderText}
                     value={password}
                     onChangeText={setPassword}
                     secureTextEntry= {!showPassword}
                    
                    />
                    <TouchableOpacity 
                    onPress={()=> setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                      <Ionicons
                      name={showPassword ? "eye-outline":"eye-off-outline"}
                      color={COLORS.primary}
                       size={20}/>
                       
                    </TouchableOpacity>
                  

                  </View>

                </View>
               
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
           {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
              <Text style={styles.buttonText}>Login</Text>
               )}
              </TouchableOpacity>
             {/* footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Dont you have an account</Text>
               <Link href="SingUP" asChild >
                 <TouchableOpacity> 
                  <Text style={styles.link}>SingUP</Text>

               </TouchableOpacity>
               </Link>
            </View>
            </View>      
    </View>
    </KeyboardAvoidingView>
  )
}
export default Login;
