import { View, Text, TouchableOpacity,  FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import {Image} from 'expo-image'
import {userAuth }  from '../../store/authstore'
import styles from '../../assets/styles/home.styles';
import { API_URl } from '../../assets/constant/api';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../assets/constant/Colors';
import { formatPublishDate } from '../lib/utils';
import Loading from '../components/Loading';
import { useFocusEffect } from 'expo-router';




export const sleep  = (ms) => new Promise((resolve)=> setTimeout(resolve, ms))
export default function Index() {
    const [books,setBooks] = useState([]);
   const [loading,setLoading] = useState(true);
    const [refreshing,setRefreshing] = useState(false);
     const [page,setpage] = useState(1);
     const [hasMore,setHasMore] = useState(1);
     const {token} = userAuth();


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

      useEffect(()=>{
        
        fetchBooks()
      },[]);

      // thi is solutins for fetch
//       useFocusEffect is a React Navigation hook that runs every time a screen comes into focus — like when:
// You navigate to the screen,

	// Wraps the function so it's memoized and stable



      useFocusEffect(
  useCallback(() => {
    fetchBooks(1, true);
  }, [])
);

      
     const handleLoadMore = async () => {
  console.log('Trying to load more...');
  if (hasMore && !loading && !refreshing) {
    console.log('Loading next page:', page + 1);
    await fetchBooks(page + 1);
  } else {
    console.log('Skipping fetch: hasMore:', hasMore, 'loading:', loading, 'refreshing:', refreshing);
  }
};

   // loading
   if(loading) return <Loading size='small'/>

    

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
      

      const renderItem = ({item})=>(
        <View style={styles.bookCard}> 
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
          <Image source={{uri: item.user.profileImage}} style={styles.avatar}/>
            <Text>{item.user.username}</Text>
          </View>

        </View>
          <View style={styles.bookImageContainer}>
            <Image source={item.image} style={styles.bookImage} contentFit = "cover"/>

          </View>
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
              <View style={styles.ratingContainer}>{renderRatingStart(item.rating)}</View>
           <Text style={styles.caption}>{item.captions}</Text>
           <Text style={styles.date}>share on{formatPublishDate(item.createdAt)}</Text>
        </View>

        

        </View>
      )
         
  return (
    <View style={styles.container}>
      <FlatList
      data={books}
      renderItem={renderItem}
      keyExtractor={(item)=> item._id}
      contentContainerStyle = {styles.listContainer}
      showsVerticalScrollIndicator = {false}
      // refresh the page
        refreshControl={
          <RefreshControl 
            refreshing = {refreshing}
         onRefresh={()=> fetchBooks[1,true]}
         color={[COLORS.primary]}
         tintColor={COLORS.primary}
          />
        }
         

         onEndReached={handleLoadMore}
         onEndReachedThreshold={0.1}

      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BOOKWord🦖</Text>
          <Text style={styles.headerSubtitle}>great read from the community</Text>
        </View>
      }
         ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={60} color={COLORS.textSecondary}/>
            <Text style={styles.emptyText}>No recommendation yet</Text>
            <Text style={styles.emptySubtext}>Be the frist to share a book</Text>
          </View>
         }
     >
        </FlatList> 
  
    </View>
  )
}