import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../../src/zustand/store';
// import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axiosInstance from "../mycomponents/AxiosInstance";


const { width } = Dimensions.get('window');

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState(0); // 0: Book, 1: Cloth, 2: Stationary, 3: Footwear
  const [isAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const userType = useStore((state) => state.userType);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const tabToType = ["book", "cloth", "stationary", "footwear"];

  useEffect(() => {
    fetchProfile();
  }, [accessToken, baseURL]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`${baseURL}/api/my-posts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const profileData = response.data;
      if (profileData.footwearPosts) {
        profileData.footwearPosts = profileData.footwearPosts.map(post => ({
          ...post,
          images: typeof post.images === 'string' ? JSON.parse(post.images) : post.images
        }));
      }
      setProfile(profileData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  // const handleDelete = (type, postId) => {
  //   console.log("Deleting1:", type, postId);
  //   Alert.alert(
  //     "Confirm Delete",
  //     "Are you sure you want to delete this post? This action cannot be undone.",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Delete",
  //         style: "destructive",
  //         onPress: async () => {
  //           try {
  //             setLoading(true);
  //             console.log("Deleting2:", type, postId);
  //             const response = await axiosInstance.delete(`${baseURL}/api/delete-post/${type}/${postId}`, {
  //               headers: { Authorization: `Bearer ${accessToken}` },
  //             });

  //             Alert.alert("Success", response.data.message || "Post deleted successfully");

  //             setProfile((prev) => ({
  //               ...prev,
  //               userPosts: type === "book" ? prev.userPosts.filter((p) => p.id !== postId) : prev.userPosts || [],
  //               clothPosts: type === "cloth" ? prev.clothPosts.filter((p) => p.id !== postId) : prev.clothPosts || [],
  //               stationaryPosts: type === "stationary" ? prev.stationaryPosts.filter((p) => p.id !== postId) : prev.stationaryPosts || [],
  //               footwearPosts: type === "footwear" ? prev.footwearPosts.filter((p) => p.id !== postId) : prev.footwearPosts || [],
  //             }));
              
  //           } catch (error) {
  //             console.error("Error deleting post:", error);
  //             const errorMsg = error.response ? error.response.data.message : error.message;
  //             Alert.alert("Error", `Failed to delete post: ${errorMsg}`);
  //           } finally {
  //             setLoading(false);
  //           }
  //         }
  //       }
  //     ]
  //   );
  // };


  const handleDelete = (type, postId) => {
     console.log("Deleting1:", type, postId);
  Alert.alert(
    "Confirm Delete",
    "Are you sure you want to delete this post?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          axiosInstance.delete(`${baseURL}/api/delete-post/${type}/${postId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            Alert.alert("Success", response.data.message || "Post deleted successfully");
            setProfile((prev) => ({
              ...prev,
              userPosts: type === "book" ? prev.userPosts.filter((p) => String(p.id) !== String(postId)) : prev.userPosts || [],
              clothPosts: type === "cloth" ? prev.clothPosts.filter((p) => String(p.id) !== String(postId)) : prev.clothPosts || [],
              stationaryPosts: type === "stationary" ? prev.stationaryPosts.filter((p) => String(p.id) !== String(postId)) : prev.stationaryPosts || [],
              footwearPosts: type === "footwear" ? prev.footwearPosts.filter((p) => String(p.id) !== String(postId)) : prev.footwearPosts || [],
            }));
          })
          .catch((error) => {
            const errorMsg = error.response ? error.response.data.message : error.message;
            Alert.alert("Error", `Failed to delete post: ${errorMsg}`);
          });
        }
      }
    ]
  );
};

  const handleEdit = (type, id) => {
    switch (type) {
      case "book": navigation.navigate("EditPost", { postId: id }); break;
      case "cloth": navigation.navigate("EditClothPost", { id: id }); break;
      case "stationary": navigation.navigate("EditStationary", { id: id }); break;
      case "footwear": navigation.navigate("EditFootwear", { id: id }); break;
    }
  };

  const handleCreateNew = () => {
    switch (activeTab) {
      case 0: navigation.navigate("UploadForm"); break;
      case 1: navigation.navigate("UploadClothForm"); break;
      case 2: navigation.navigate("UploadStationaryForm"); break;
      case 3: navigation.navigate("UploadFootwearForm"); break;
    }
  };

  const getCurrentPosts = () => {
    if (!profile) return [];
    switch (activeTab) {
      case 0: return profile.userPosts || [];
      case 1: return profile.clothPosts || [];
      case 2: return profile.stationaryPosts || [];
      case 3: return profile.footwearPosts || [];
      default: return [];
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  if (loading && !profile) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: isDark ? "#121212" : "#f8f7ff" }]}>
        <Text style={{ color: isDark ? "#fff" : "#000" }}>Loading profile...</Text>
      </View>
    );
  }

  const posts = getCurrentPosts();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f8f7ff" }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {profile && (
          <>
            {/* User Info Card */}
            <View style={[styles.profileCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff", borderColor: isDark ? "#333" : "rgba(147, 112, 219, 0.2)" }]}>
              <View style={styles.profileHeader}>
                <TouchableOpacity onPress={() => setAvatarPopupOpen(true)} style={styles.avatarContainer}>
                  {profile.user.picture ? (
                    <Image
                      source={{ uri: profile.user.picture.startsWith("http") ? profile.user.picture : `${baseURL}/uploads/${profile.user.picture}` }}
                      style={styles.avatar}
                    />
                  ) : (
                    <View style={[styles.avatar, styles.placeholderAvatar]}>
                      <Icon name="account-circle" size={80} color="#ccc" />
                    </View>
                  )}
                  <View style={styles.cameraIconBadge}>
                    <Icon name="photo-camera" size={12} color="#fff" />
                  </View>
                </TouchableOpacity>

                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>{profile.user.name}</Text>
                  <View style={styles.emailContainer}>
                    <Icon name="email" size={16} color="#9370DB" />
                    <Text style={[styles.userEmail, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>{profile.user.email}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity style={styles.actionButtonOutline} onPress={() => navigation.navigate("Setting")}>
                  <Icon name="settings" size={20} color="#9370DB" style={styles.actionIcon} />
                  <Text style={styles.actionButtonTextOutline}>Settings</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.actionButtonOutlineSecondary} onPress={() => navigation.navigate("EditProfile")}>
                  <Icon name="edit-note" size={20} color="#6A1B9A" style={{ marginRight: 6 }} />
                  <Text style={styles.actionButtonTextOutlineSecondary}>Edit Profile</Text>
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Tabs */}
            <View style={[styles.tabsContainer, { backgroundColor: isDark ? "#2d2d2d" : "transparent" }]}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                {[
                  { icon: "menu-book", label: "Book" },
                  { icon: "checkroom", label: "Cloth" },
                  { icon: "category", label: "Other" },
                  { icon: "directions-run", label: "Footwear" }
                ].map((tab, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.tab, activeTab === idx && styles.activeTab]}
                    onPress={() => setActiveTab(idx)}
                  >
                    <Icon name={tab.icon} size={24} color={activeTab === idx ? "#fff" : (isDark ? "#bb86fc" : "#9370DB")} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Posts */}
            {posts.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: isDark ? "#1e1e1e" : "#fff", borderColor: isDark ? "#444" : "rgba(147, 112, 219, 0.3)" }]}>
                <Text style={[styles.emptyStateTitle, { color: isDark ? "#ccc" : "#666" }]}>No {tabToType[activeTab]} posts found</Text>
                <Text style={[styles.emptyStateSub, { color: isDark ? "#888" : "#999" }]}>You haven't created any {tabToType[activeTab]} posts yet</Text>
                <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
                  <Text style={styles.createButtonText}>Create your first {tabToType[activeTab]} post</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.postsGrid}>
                {posts.map((post) => (
                  <View key={post.id} style={[styles.postCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff", borderColor: isDark ? "#333" : "rgba(147, 112, 219, 0.1)" }]}>
                    <View style={styles.postMediaContainer}>
                      <View style={styles.priceChip}>
                        <Text style={styles.priceChipText}>{formatPrice(post.price)}</Text>
                      </View>

                      {post.images && post.images.length > 0 ? (
                        <View style={styles.imageGrid}>
                          {post.images.slice(0, 2).map((img, idx) => (
                            <Image
                              key={idx}
                              source={{ uri: `${baseURL}/uploads/${img}` }}
                              style={[styles.postImage, post.images.length === 1 ? { width: '100%' } : { width: '50%' }]}
                            />
                          ))}
                        </View>
                      ) : (
                        <View style={[styles.noImageContainer, { backgroundColor: isDark ? "#333" : "#f0f0f0" }]}>
                          <Text style={{ color: isDark ? "#aaa" : "#666" }}>No images available</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.postContent}>
                      <Text style={[styles.postTitle, { color: isDark ? "#bb86fc" : "#6A1B9A" }]} numberOfLines={2}>
                        {activeTab === 0 && post.book_name}
                        {activeTab === 1 && (post.subcategory || "Cloth Item")}
                        {activeTab === 2 && (post.stationary_name || "Item")}
                        {activeTab === 3 && (post.subcategory || "Footwear Item")}
                      </Text>
                      <View style={styles.dateContainer}>
                        <Icon name="access-time" size={14} color="#9370DB" />
                        <Text style={[styles.dateText, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>
                          {post.created_at ? new Date(post.created_at).toLocaleDateString() : "Recently posted"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.postActions}>
                      <TouchableOpacity style={[styles.postActionBtn, styles.editBtn]} onPress={() => handleEdit(tabToType[activeTab], post.id)}>
                        <Icon name="edit" size={16} color="#fff" />
                        <Text style={styles.postActionText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.postActionBtn, styles.deleteBtn]} onPress={() => handleDelete(tabToType[activeTab], post.id)}>
                        <Icon name="delete" size={16} color="#fff" />
                        <Text style={styles.postActionText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Avatar Popup Modal */}
      <Modal visible={isAvatarPopupOpen} transparent={true} animationType="fade" onRequestClose={() => setAvatarPopupOpen(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setAvatarPopupOpen(false)}>
          <View style={styles.modalContent}>
            {profile?.user.picture ? (
              <Image
                source={{ uri: profile.user.picture.startsWith("http") ? profile.user.picture : `${baseURL}/uploads/${profile.user.picture}` }}
                style={styles.fullAvatar}
                resizeMode="contain"
              />
            ) : (
              <Icon name="account-circle" size={200} color="#fff" />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#9370DB',
  },
  placeholderAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cameraIconBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#9370DB',
    padding: 4,
    borderRadius: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userEmail: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#9370DB',
    borderRadius: 8,
  },
  actionButtonOutlineSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#6A1B9A',
    borderRadius: 8,
  },
  actionButtonTextOutline: {
    color: '#9370DB',
    fontWeight: '600',
    marginLeft: 6,
  },
  actionButtonTextOutlineSecondary: {
    color: '#6A1B9A',
    fontWeight: '600',
  },
  tabsContainer: {
    marginBottom: 20,
    borderRadius: 12,
  },
  tabsScroll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    flex: 1,
  },
  activeTab: {
    backgroundColor: '#9370DB',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyStateSub: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#9370DB',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postsGrid: {
    flexDirection: 'column',
    gap: 16,
  },
  postCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  postMediaContainer: {
    height: 180,
    position: 'relative',
  },
  priceChip: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#9370DB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  priceChipText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  imageGrid: {
    flexDirection: 'row',
    height: '100%',
  },
  postImage: {
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  postActions: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  postActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  editBtn: {
    backgroundColor: '#1976d2',
  },
  deleteBtn: {
    backgroundColor: '#d32f2f',
  },
  postActionText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  }
});

export default Profile;




