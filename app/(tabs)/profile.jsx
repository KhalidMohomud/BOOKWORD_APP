import { View, Text, TouchableOpacity, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { userAuth } from '../../store/authstore';
import styles from '../../assets/styles/profile.styles';
import ProfileHeader from '../components/profileHeader'
import Logout from '../components/Logout';
import {API_URl} from '../../assets/constant/api'
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../assets/constant/Colors';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { formatPublishDate } from '../lib/utils';
import Loading from '../components/Loading';
// import {sleep} from './index'

export default function Profile() {

    const [books,setBooks] = useState([]);
     const [loading,setLoading] = useState(true);
      const [refreshing,setRefreshing] = useState(false);
       const [page,setpage] = useState(1);
       const [hasMore,setHasMore] = useState(1);
       const [deleteBookId, setdeleteBookId] = useState(null)
       
          const {token}=  userAuth();
  
    const fetchBooks = async(pageNum=1, refresh=false  )=>{
        try {
           
          if(refresh) setRefreshing(true);
          else if (pageNum === 1) setLoading(true);
          const response = await fetch(`${API_URl}/books?page=${pageNum}&limit=10`,{
            headers: {Authorization: `Bear${token}`}
          });
           const data = await response.json();
           if(!response.ok) throw new Error(data.message || "Failed to fetch books");
            
           //todo fix it later
          //  setBooks((prevBooks)=> [...prevBooks, ...data.books])
          //  console.log(data.books.map((b) => b._id)); 
  
           // this is the solutions  dupicate of id 
            const uniqueBooks =
            refresh || pageNum ===1
            ? data.books 
            : Array.from(new Set([...books, ...data.books].map((book)=>
               book._id))).map((id)=> [...books,...data.books].find((book)=>book._id === id)
          );
           setBooks(uniqueBooks);
  
           setHasMore(pageNum < data.totalPage);
           setpage(pageNum);
        } catch (error) {
          console.log(error);
          
        } finally {
          if (refresh){
             
            
            setRefreshing(false);
  
          }
         
          else setLoading(false);
  
        }
        
       };

        //handle refresh
        const handlerefresh = async()=>{
          setRefreshing(true)
          await fetchBooks();
          setRefreshing(false);
          
        }

         useEffect(()=>{
          fetchBooks()
     },[]);

     const handleBookDelete = async(books_id) =>{
      try {
        setdeleteBookId(books_id);
        console.log("WWw");
        const response = await fetch(`${API_URl}/books/${books_id}`,{
          method: "DELETE",
          headers: {Authorization: `Bear${token}`},
        });

        const data = await response.json();
        if(!response.ok) throw new Error(data.message || "Failed to delete book");
        setBooks(books.filter((books)=> books._id !== books_id));
        Alert.alert("success", "Books delete sucessfully");

        
      } catch (error) {
        Alert.alert("Error",error.message || "Failed to delete Books")
        
      } finally {
         setdeleteBookId(null);
      }

    }

     const comfimeDeltet =(books_id)=>{
      Alert.alert("Delete recommendations ","Are you sure to delete Books",[
       { text: "Cancel" , style: "cancel"},
       {text: "delete" ,style: "destructive" , onPress: ()=> {handleBookDelete(books_id)}}
      ])

      console.log(22)
     }

  const renderRatingStart = (rating)=>{
        const start =[];
        for (let i = 1; i<=5; i++){
          start.push(
            <Ionicons
            key={i}
            name={i <= rating? "star":"star-outline" }
            size={16}
            color={i <= rating ? "#f4b400":COLORS.textSecondary}
            style={{marginRight:2}}
            />
          );
        }
        return start;
      }
     const renderBooksItem  =({item})=>(
      <View style={styles.bookItem}>
        <Image source={item.image} style={styles.bookImage}/>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <View style={styles.ratingContainer}>{renderRatingStart(item.rating)}</View>
           <Text style={styles.bookCaption}>{item.captions}</Text>
           {/* <Text style={styles.bookDate}>{new Date(item.createAt).toLocaleDateString()}</Text> */}
            <Text style={styles.bookDate}>{formatPublishDate(item.createdAt)}</Text>
        </View>
         <TouchableOpacity style={styles.deleteButton} onPress={()=> {comfimeDeltet(item._id)}}>
        

            {deleteBookId === item._id  ?(
              // <Ionicons  name='trash-outline' size={10} color={COLORS.primary}/>
              <ActivityIndicator size='small' color={COLORS.primary} />
    
            ):(
             <Ionicons name='trash-outline' size={20} color={COLORS.primary}/>

            )}
              </TouchableOpacity>
      </View>
     )
 

// loading
if(loading) return <Loading/>
     
 return (
  <View style={styles.container}>
    <ProfileHeader />
    <Logout />

    <View style={styles.booksHeader}>
      <Text style={styles.bookTitle}>Your Recommendation Book</Text>
      <Text style={styles.booksCount}>{books.length}</Text>
    </View>

    {/* list books */}
    <FlatList
      data={books}
      renderItem={renderBooksItem}
      keyExtractor={(item) => item._id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.booksList}

         refreshControl={
          <RefreshControl
          refreshing= {refreshing}
          // colors={COLORS.t}
          onRefresh={handlerefresh}
          // tintColor={COLORS.primary}
          />
         }

      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons
            name="boat-outline"
            size={50}
            color={COLORS.textSecondary}
          />
          <Text style={styles.emptyText}>No recommendations yet</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push("/create")}
          >
            <Text style={styles.addButton}>Add your first Book</Text>
          </TouchableOpacity>
        </View> // ✅ This was previously <View/> (incorrect)
      }
    />
  </View>
);
}