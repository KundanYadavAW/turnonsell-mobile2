import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useStore } from '../../../src/zustand/store';


import axiosInstance from "../mycomponents/AxiosInstance"; // assuming this works in RN environment

const GetAllData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Profile Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const userType = useStore((state) => state.userType);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${baseURL}/api/getalluser`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (userId) => {
    setProfileLoading(true);
    setModalVisible(true);
    try {
      const response = await axiosInstance.get(`${baseURL}/api/userprofile/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSelectedUser(response.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to fetch user profile");
      setModalVisible(false);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleTempDelete = (userId) => {
    Alert.alert("Confirm", "Temporarily delete this user?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          try {
            await axiosInstance.put(`${baseURL}/api/tempdeleteaccount/${userId}`, {}, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            Alert.alert("Success", "User account temporarily deleted.");
            setUsers(users.map(u => u.id === userId ? { ...u, is_deleted: 1 } : u));
          } catch (error) {
            Alert.alert("Error", "Failed to temporarily delete user account.");
          }
        }
      }
    ]);
  };

  const handlePermanentDelete = (userId) => {
    Alert.alert("Warning", "Permanently delete this user? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          try {
            await axiosInstance.delete(`${baseURL}/api/deleteaccount/${userId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            Alert.alert("Success", "User account permanently deleted.");
            setUsers(users.filter(u => u.id !== userId));
          } catch (error) {
            Alert.alert("Error", "Failed to permanently delete user account.");
          }
        }
      }
    ]);
  };

  const handleRestore = (userId) => {
    Alert.alert("Confirm", "Restore this user?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Restore",
        onPress: async () => {
          try {
            await axiosInstance.put(`${baseURL}/api/restoreaccount/${userId}`, {}, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            Alert.alert("Success", "User account restored.");
            setUsers(users.map(u => u.id === userId ? { ...u, is_deleted: 0 } : u));
          } catch (error) {
            Alert.alert("Error", "Failed to restore user account.");
          }
        }
      }
    ]);
  };

  const renderUserCard = ({ item }) => {
    const isDeleted = item.is_deleted === 1 || item.is_deleted === true;
    
    return (
      <TouchableOpacity 
        style={[styles.userCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}
        activeOpacity={0.7}
        onPress={() => fetchUserProfile(item.id)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.userName, { color: isDark ? "#fff" : "#333" }]} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: isDeleted ? '#ffebee' : '#e8f5e9' }]}>
            <Text style={[styles.statusText, { color: isDeleted ? '#c62828' : '#2e7d32' }]}>{isDeleted ? "Deleted" : "Active"}</Text>
          </View>
        </View>

        <Text style={[styles.userEmail, { color: isDark ? "#aaa" : "#666" }]} numberOfLines={1}>{item.email}</Text>
        
        <View style={styles.detailsRow}>
          <Text style={[styles.detailText, { color: isDark ? "#888" : "#888" }]}>Role: {item.role}</Text>
          <Text style={[styles.detailText, { color: isDark ? "#888" : "#888" }]}>Auth: {item.auth_type}</Text>
        </View>

        <View style={styles.actionButtons}>
          {!isDeleted ? (
            <TouchableOpacity style={[styles.actionBtn, styles.actionBtnWarning]} onPress={(e) => { e.stopPropagation(); handleTempDelete(item.id); }}>
              <Icon name="block" size={16} color="#fff" />
              <Text style={styles.actionBtnText}>Deactivate</Text>
            </TouchableOpacity>
          ) : (
             <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSuccess]} onPress={(e) => { e.stopPropagation(); handleRestore(item.id); }}>
               <Icon name="restore" size={16} color="#fff" />
               <Text style={styles.actionBtnText}>Restore</Text>
             </TouchableOpacity>
          )}

          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={(e) => { e.stopPropagation(); handlePermanentDelete(item.id); }}>
            <Icon name="delete-forever" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const AdminNavigationButtons = () => (
    <View style={styles.adminLinksContainer}>
       <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}>Manage Data</Text>
       <View style={styles.adminButtonsGrid}>
         <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? '#2d2d3d' : '#f0f0f0' }]} onPress={() => navigation.navigate("Ads")}>
           <Icon name="campaign" size={24} color={isDark ? "#bb86fc" : "#6A1B9A"} />
           <Text style={[styles.navButtonText, { color: isDark ? "#fff" : "#333" }]}>Ads</Text>
         </TouchableOpacity>
         
         <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? '#2d2d3d' : '#f0f0f0' }]} onPress={() => navigation.navigate("EditCollegeData")}>
           <Icon name="school" size={24} color={isDark ? "#bb86fc" : "#6A1B9A"} />
           <Text style={[styles.navButtonText, { color: isDark ? "#fff" : "#333" }]}>Colleges</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? '#2d2d3d' : '#f0f0f0' }]} onPress={() => navigation.navigate("EditDegreeData")}>
           <Icon name="book" size={24} color={isDark ? "#bb86fc" : "#6A1B9A"} />
           <Text style={[styles.navButtonText, { color: isDark ? "#fff" : "#333" }]}>Degrees</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? '#2d2d3d' : '#f0f0f0' }]} onPress={() => navigation.navigate("EditYearData")}>
           <Icon name="date-range" size={24} color={isDark ? "#bb86fc" : "#6A1B9A"} />
           <Text style={[styles.navButtonText, { color: isDark ? "#fff" : "#333" }]}>Years</Text>
         </TouchableOpacity>

         <TouchableOpacity style={[styles.navButton, { backgroundColor: isDark ? '#2d2d3d' : '#f0f0f0' }]} onPress={() => navigation.navigate("CategorySubcategoryAdmin")}>
           <Icon name="category" size={24} color={isDark ? "#bb86fc" : "#6A1B9A"} />
           <Text style={[styles.navButtonText, { color: isDark ? "#fff" : "#333" }]}>Cats/SubCats</Text>
         </TouchableOpacity>

         <TouchableOpacity 
           style={[styles.navButton, { backgroundColor: '#6A1B9A' }]} 
           onPress={() => Linking.openURL('https://analytics.google.com/analytics/web/#/a196652232p309498301/reports/intelligenthome')}
         >
           <Icon name="analytics" size={24} color="#fff" />
           <Text style={[styles.navButtonText, { color: "#fff" }]}>Analytics</Text>
         </TouchableOpacity>
       </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
      <View style={[styles.header, { backgroundColor: isDark ? "#1e1e2e" : "#6A1B9A" }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUserCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<AdminNavigationButtons />}
        ListEmptyComponent={
          loading ? (
             <ActivityIndicator size="large" color="#6A1B9A" style={{ marginTop: 40 }} />
          ) : (
             <Text style={{ textAlign: 'center', marginTop: 40, color: isDark ? '#ccc' : '#666' }}>
               {error || "No users found."}
             </Text>
          )
        }
      />

      {/* User Profile Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? "#1e1e2e" : "#fff" }]}>
            <View style={[styles.modalHeader, { backgroundColor: isDark ? "#333" : "#1976d2" }]}>
               <Text style={styles.modalHeaderTitle}>User Profile</Text>
               <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Icon name="close" size={24} color="#fff" />
               </TouchableOpacity>
            </View>

            {profileLoading ? (
               <View style={styles.modalLoader}>
                  <ActivityIndicator size="large" color="#1976d2" />
               </View>
            ) : selectedUser ? (
               <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                 
                 <Text style={[styles.sectionHeading, { color: isDark ? "#fff" : "#333" }]}>User Details:</Text>
                 <Text style={[styles.infoText, { color: isDark ? "#ccc" : "#555" }]}><Text style={styles.bold}>Name:</Text> {selectedUser.user.name}</Text>
                 <Text style={[styles.infoText, { color: isDark ? "#ccc" : "#555" }]}><Text style={styles.bold}>Email:</Text> {selectedUser.user.email}</Text>
                 <Text style={[styles.infoText, { color: isDark ? "#ccc" : "#555" }]}><Text style={styles.bold}>Role:</Text> {selectedUser.user.role}</Text>

                 <Text style={[styles.sectionHeading, { color: isDark ? "#fff" : "#333" }]}>User Posts (Books):</Text>
                 {selectedUser.userPosts?.length > 0 ? (
                   selectedUser.userPosts.map((post) => (
                     <Text key={post.id} style={[styles.itemText, { color: isDark ? "#aaa" : "#666" }]}>
                       📚 {post.college_name} - {post.degree_name} (Year: {post.year})
                     </Text>
                   ))
                 ) : <Text style={{ color: '#888' }}>No book posts found.</Text>}

                 <Text style={[styles.sectionHeading, { color: isDark ? "#fff" : "#333" }]}>Clothing Posts:</Text>
                 {selectedUser.clothPosts?.length > 0 ? (
                   selectedUser.clothPosts.map((post) => (
                     <Text key={post.id} style={[styles.itemText, { color: isDark ? "#aaa" : "#666" }]}>
                       👕 {post.gender} - {post.category} - {post.subcategory} ({post.college})
                     </Text>
                   ))
                 ) : <Text style={{ color: '#888' }}>No clothing posts found.</Text>}

                 <Text style={[styles.sectionHeading, { color: isDark ? "#fff" : "#333" }]}>Stationary Posts:</Text>
                 {selectedUser.stationaryPosts?.length > 0 ? (
                   selectedUser.stationaryPosts.map((post) => (
                     <Text key={post.id} style={[styles.itemText, { color: isDark ? "#aaa" : "#666" }]}>
                       ✏️ {post.stationary_name} - ₹{post.price} ({post.college_name})
                     </Text>
                   ))
                 ) : <Text style={{ color: '#888' }}>No stationary posts found.</Text>}

                 <Text style={[styles.sectionHeading, { color: isDark ? "#fff" : "#333" }]}>Footwear Posts:</Text>
                 {selectedUser.footwearPosts?.length > 0 ? (
                   selectedUser.footwearPosts.map((post) => (
                     <Text key={post.id} style={[styles.itemText, { color: isDark ? "#aaa" : "#666" }]}>
                       👟 {post.gender} - {post.category} - {post.subcategory} | Size: {post.size} | ₹{post.price}
                     </Text>
                   ))
                 ) : <Text style={{ color: '#888' }}>No footwear posts found.</Text>}

               </ScrollView>
            ) : (
               <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>No profile data available</Text>
            )}

            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  listContent: { padding: 16, paddingBottom: 40 },
  
  adminLinksContainer: {
     marginBottom: 20,
     paddingBottom: 20,
     borderBottomWidth: 1,
     borderBottomColor: '#ddd'
  },
  sectionTitle: {
     fontSize: 18,
     fontWeight: 'bold',
     marginBottom: 12
  },
  adminButtonsGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     gap: 10,
  },
  navButton: {
     flexDirection: 'row',
     alignItems: 'center',
     paddingVertical: 12,
     paddingHorizontal: 16,
     borderRadius: 12,
     width: '48%', // 2 columns roughly
     gap: 8,
     shadowColor: '#000',
     shadowOffset: {width: 0, height: 1},
     shadowOpacity: 0.1,
     shadowRadius: 2,
     elevation: 2,
  },
  navButtonText: {
     fontSize: 14,
     fontWeight: '600'
  },

  userCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  userName: { fontSize: 18, fontWeight: 'bold', flex: 1, marginRight: 10 },
  userEmail: { fontSize: 14, marginBottom: 8 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  detailText: { fontSize: 12 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  actionButtons: { flexDirection: 'row', justifyContent: 'flex-start', gap: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, gap: 4 },
  actionBtnWarning: { backgroundColor: '#ed6c02' },
  actionBtnSuccess: { backgroundColor: '#2e7d32' },
  actionBtnDanger: { backgroundColor: '#d32f2f' },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalHeaderTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalLoader: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  modalScroll: { padding: 20 },
  sectionHeading: { fontSize: 16, fontWeight: 'bold', marginTop: 16, marginBottom: 8 },
  infoText: { fontSize: 15, marginBottom: 4 },
  itemText: { fontSize: 14, marginBottom: 4, paddingLeft: 8 },
  bold: { fontWeight: 'bold' },
  closeBtn: {
    backgroundColor: '#1976d2',
    padding: 14,
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold'}
});

export default GetAllData;




