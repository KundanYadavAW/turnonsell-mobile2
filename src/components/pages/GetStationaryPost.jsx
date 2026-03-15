import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator
} from "react-native";
import axios from "axios";
import { useStore } from "";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { useStore } from "";

const GetStationaryPost = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/stationary/stationaryposts`);
      // Shuffle posts
      const shuffled = response.data.sort(() => Math.random() - 0.5);
      setPosts(shuffled);
    } catch (err) {
      setError("Failed to load stationary posts");
    } finally {
      setLoading(false);
    }
  };

  const isDark = darkMode === true || darkMode === "true";

  const renderPost = ({ item }) => {
    const profilePic = item.picture 
      ? (item.picture.startsWith("http") ? item.picture : `${baseURL}/uploads/${item.picture}`) 
      : null;
      
    // Handle potentially stringified images array like footwear does, just in case
    const imagesArray = typeof item.images === 'string' ? JSON.parse(item.images) : item.images;
    const postImage = imagesArray && imagesArray.length > 0 
      ? `${baseURL}/uploads/${imagesArray[0]}` 
      : null;

    return (
      <TouchableOpacity 
        style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        onPress={() => navigation.navigate("DetailsStationary", { id: item.id })}
      >
        <View style={styles.cardHeader}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
              <Ionicons name="person" size={16} color={isDark ? "#aaa" : "#555"} />
            </View>
          )}
          <Text style={[styles.userName, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
            {item.user_name}
          </Text>
        </View>

        {postImage ? (
          <Image source={{ uri: postImage }} style={styles.postImage} />
        ) : (
          <View style={[styles.postImage, styles.placeholderImage, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
            <Ionicons name="image-outline" size={40} color={isDark ? "#aaa" : "#555"} />
          </View>
        )}

        <View style={styles.priceTag}>
          <Text style={styles.priceText}>₹{item.price}</Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
            {item.stationary_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
          Stationary
        </Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("SearchStationaryPost")}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <Ionicons name="chevron-forward" size={14} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={styles.loader} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          snapToInterval={266}
          decelerationRate="fast"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  lightText: { color: "#333" },
  darkText: { color: "#fff" },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    color: "#2196F3",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 2,
  },
  errorText: {
    color: "#d32f2f",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  loader: {
    marginVertical: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  card: {
    width: 250,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
  },
  lightCard: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  darkCard: {
    backgroundColor: "#2d3748",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.2)",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  placeholderAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  lightPlaceholder: { backgroundColor: "#e0e0e0" },
  darkPlaceholder: { backgroundColor: "#4a5568" },
  userName: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  postImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  priceTag: {
    position: "absolute",
    bottom: 50,
    right: 10,
    backgroundColor: "#2196F3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardBody: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
});

export default GetStationaryPost;




