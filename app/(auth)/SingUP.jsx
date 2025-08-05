import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'
import styles from '../../assets/styles/signup.styles'
import {useState} from 'react'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../assets/constant/Colors';
import { useRouter } from 'expo-router';
import { userAuth  } from '../../store/authstore';
import { Alert } from 'react-native';

   const SingUP = ()=> {
      const [username , setUsername] =  useState("")
     const [email ,setEmail] = useState("");
      const [password ,setPassword] = useState("");
      const [showPassword ,setShowPassword] = useState(false);
      // const [isLoading ,setIsLoading] = useState(false);

       const {register, user , isLoading} = userAuth();

      const router =  useRouter()
 
     const handleSingUP =  async()=>{
      const result =  await register(username,email,password);
      if(!result.success) Alert.alert("error", result.error);
       
      // console.log(result);
      //  console.log(user);
    
         
    };
    return (
     <KeyboardAvoidingView
     style={{flex: 1}}
       behavior={Platform.OS === "android" ? "padding"  : "height"} >
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>BookWorm 🦖</Text>
               <Text style={styles.subtitle}>share your favorite reads</Text>

            </View>
            <View style={styles.formContainer}> 
              {/* username */}
                   <View style={styles.inputGroup}>
                <Text style={styles.label}>UserName</Text>
                 <View style={styles.inputContainer}>
                  <Ionicons 
                    name="person-outline"
                    size={20}
                    color={COLORS.primary}
                    style={styles.inputIcon}
                    />
                    <TextInput
                     style={styles.input}
                     placeholder='Enter your Username'
                     placeholderTextColor={COLORS.placeholderText}
                     value={username}
                     onChangeText={setUsername}
                     keyboardType='email-address'
                     autoCapitalize='none'
                    
                    />
                 </View>
              </View>
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
                 <TouchableOpacity style={styles.button} onPress={handleSingUP} disabled={isLoading}>
           {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
              <Text style={styles.buttonText}>SingUP</Text>
               )}
              </TouchableOpacity>
              {/* footer */}
              <View style={styles.footer}>
                   <Text style={styles.footerText}>already you have an account</Text>
                       <TouchableOpacity onPress={()=> router.back()}> 
                  <Text style={styles.link}>SingUP</Text>

               </TouchableOpacity>
              </View>
         
           
          </View>
        </View>


     </KeyboardAvoidingView>
    )
  }


export default SingUP