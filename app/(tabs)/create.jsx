import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import  { useState } from 'react'
import {useRouter} from 'expo-router'
import styles from '../../assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../assets/constant/Colors';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userAuth }  from '../../store/authstore'
import {API_URl} from '../../assets/constant/api'

// Function to check base64 image size
const getBase64Size = (base64String) => {
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / 1024; // Convert to KB
}; 

export default function Create() {
  const [title,setTitle] = useState("");
   const [caption,setCaption] = useState("");
    const [rating,setRating] = useState(3);
     const [image,setImage] = useState(null);
    const [imageBase64,setimageBase64] = useState(null);
    const [imageSize,setImageSize] = useState(null);
     const [loading,setLoading] = useState(false);
     const {token} = userAuth();

     
      
         const router =  useRouter();
  const rendRatingPicker = () => {
          const stars = [];
          for (let i = 1; i <= 5; i++) {
      stars.push(
      <TouchableOpacity key={i} onPress={() => setRating(i)} style={styles.starButton}>
        <Ionicons
          name={i <= rating ? "star" : "star-outline"}
          size={32}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
        />
      </TouchableOpacity>
    );
  }

  return <View style={styles.ratingContainer}>{stars}</View>;
     };

     const imagePicker = async()=>{
      try {
        if(Platform.OS !== "android"){

          const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
          console.log(status);
        
           if(status !== "granted"){
            Alert.alert("permission Denied ","we need camera role permissions to upload image");
            return
           }

        }
        //
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            //  mediaTypes: ImagePicker.MediaTypeOptions.All, // images + videos
            allowsEditing: true,
            aspect:[4,3],
            quality: 0.5, // compress image to reduce size
            base64: true,
          });
          if(!result.canceled){
            console.log("result is here",result);
            setImage(result.assets[0].uri);
          }

          // if base64 is provided , use it 
          if(result.assets[0].base64){
            setimageBase64(result.assets[0].base64);
            setImageSize(getBase64Size(result.assets[0].base64));
          }else{
            const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri ,{
                        encoding: FileSystem.EncodingType.Base64,
            })
            setimageBase64(base64);
            setImageSize(getBase64Size(base64));
          }
        
      } catch (error) {
        console.log("S",error)
        
      }

     }

    //  const handlesumbit = async()=>{
    //    if(!title || !imageBase64 || !rating || !caption){
    //       Alert.alert("  all fills are required ");
    //       return;
    //    }
    //    try {
    //     setLoading(true);
         
    //     //get file extem=nstions from Url or defult to jpeg
    //     const uriParse = image.split(".");
    //     const fileType = uriParse[uriParse.lenght -1];
    //     const imageType = fileType ? `image/${fileType.toLowerCase()}`: "image/jpeg";
    //     const imageDateUrl = `data:${imageType};base64,${imageBase64}`;

    //       const result = fetch(`${API_URl}/books`,{
    //         method: "POST",
    //         headers: {
    //           Authorization: `Bear ${token}`,
        
    //           "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //           title,
    //           caption,
    //           rating: rating.token,
    //           image: imageDateUrl,
    //         }),
    //       });

    //       const data = await result.json();
    //       if(!result.ok) throw new Error(data.message || "something went wrong");
    //       Alert.alert("books reccomedation has been post");
    //       setTitle("");
    //       setRating("");
    //       setCaption("");
    //       setImage(null);
    //       setimageBase64(null);
          

    //    } catch (error) {
    //     console.log("error create post",error);
    //     Alert.alert("error", error.message || "something went wrong");


        
    //    } finally{
    //      setLoading(false);
    //    }
      
    //  }
    const handlesumbit = async () => {
  if (!title || !imageBase64 || !rating || !caption) {
    Alert.alert("All fields are required");
    return;
  }

  // Check image size
  const imageSizeKB = getBase64Size(imageBase64);
  if (imageSizeKB > 500) { // 500KB limit
    Alert.alert(
      "Image too large", 
      `Image size is ${Math.round(imageSizeKB)}KB. Please select a smaller image or reduce the quality.`
    );
    return;
  }

  try {
    setLoading(true);

    const uriParse = image.split(".");
    const fileType = uriParse[uriParse.length - 1];
    const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
    const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

    console.log("Sending request to:", `${API_URl}/books`);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Request data:", {
      title,
      captions: caption,
      rating,
      imageSize: imageDataUrl.length
    });

    const result = await fetch(`${API_URl}/books`, {
      method: "POST",
      headers: {
        Authorization: `Bear${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        captions: caption,
        rating,
        image: imageDataUrl,
      }),
    });

    console.log("Response status:", result.status);
    console.log("Response headers:", result.headers);

    const contentType = result.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await result.json();
      if (!result.ok) throw new Error(data.message || "Something went wrong");
      
      Alert.alert("Success", "Book recommendation has been posted!");
      setTitle("");
      setRating(3);
      setCaption("");
      setImage(null);
      setimageBase64(null);
      setImageSize(null);
    } else {
      const text = await result.text();
      throw new Error(`Unexpected response: ${text}`);
    }
  } catch (error) {
    console.log("Error creating post:", error);
    Alert.alert("Error", error.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};





       
  return (
    <KeyboardAvoidingView
      style={{flex:1}} 
      behavior={Platform.OS === "android"? "padding": "height"}>
        <ScrollView contentContainerStyle={styles.container} 
        style={styles.scrollViewStyle}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Book your Recommendations</Text>
                  <Text style={styles.subtitle}>Share your Foverate Item</Text>
          </View>
        </View>
         <View style={styles.form}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>BOOK tittle</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons 
                    name='book-outline'
                     color={COLORS.textSecondary}
                     size={20}
                     style= {styles.inputIcon}
                     />
             
                  <TextInput
                  style={styles.input}
                  placeholder='enter book title'
                  placeholderTextColor={COLORS.placeholderText}
                  value={title}
                  onChangeText={setTitle}
                  />
                       </View>



              </View>

              {/* rating */}
              <View  style={styles.formGroup}>
                <Text style={styles.label }>Your Rate</Text>
                 {rendRatingPicker()}
              </View>
               {/* / image */}
               <View style={styles.formGroup}>
                <Text style={styles.label}>Image</Text>

                <TouchableOpacity style={styles.imagePicker} onPress={imagePicker}>
                  {image? (
                    <Image source={{uri:image}} style={styles.previewImage}/>

                  ): (
                    <View style={styles.placeholderContainer}>
                      <Ionicons name='image-outline' size={40}color={COLORS.textSecondary}/>
                      <Text style={styles.placeholderText}>Tap to select image</Text>

                    </View>
                  )}

                </TouchableOpacity>
                {imageSize && (
                  <Text style={{fontSize: 12, color: imageSize > 500 ? '#ff6b6b' : '#4CAF50', marginTop: 5}}>
                    Image size: {Math.round(imageSize)}KB {imageSize > 500 ? '(Too large)' : '(Good size)'}
                  </Text>
                )}

                </View>
                {/* textArea */}
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Captions</Text>
                   <TextInput 
                   style={styles.textArea}
                   placeholder='write your or throught about this book'
                   placeholderTextColor={COLORS.placeholderText}
                   value={caption}
                   onChangeText={setCaption}
                   multiline/>
                </View>
                 <TouchableOpacity style={styles.button} onPress={handlesumbit}
                 disabled={loading}>
                  {loading ?(
                    <ActivityIndicator color={COLORS.white}/>

                  ): (
                    <>
                    <Ionicons
                    name='cloud-upload-outline'
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}/>
                    <Text style={styles.buttonText}>Share</Text>

                    </>
                  )}

                 </TouchableOpacity>

             
              

            </View>
        </ScrollView>
      
    </KeyboardAvoidingView>
  )
}