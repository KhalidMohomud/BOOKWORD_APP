import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import COLORS from '../../assets/constant/Colors';
import { userAuth } from '../../store/authstore';

const Home = () => {
  const { user } = userAuth();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header / Welcome */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.username}>{user?.username || "Reader"} 👋</Text>
        </View>
        <Image
          source={{ uri: user?.profileImage || 'https://api.dicebear.com/9.x/pixel-art/svg?seed=reader' }}
          style={styles.avatar}
        />
      </View>

      {/* Featured Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Reading List 📚</Text>
        <Text style={styles.cardSubtitle}>You haven't added any books yet.</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Your First Book</Text>
        </TouchableOpacity>
      </View>

      {/* Explore Section */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Discover New Reads 🔍</Text>
        <Text style={styles.cardSubtitle}>Explore top books recommended by other readers.</Text>
        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonOutlineText}>Start Exploring</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.background || '#fff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 16,
    color: COLORS.text || '#444',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary || '#222',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
  },
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.primary || '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 12,
  },
  button: {
    backgroundColor: COLORS.primary || '#5A67D8',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
  },
  buttonOutline: {
    borderColor: COLORS.primary || '#5A67D8',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonOutlineText: {
    color: COLORS.primary || '#5A67D8',
    fontWeight: '500',
    textAlign: 'center',
  },
});
