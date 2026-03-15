import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, 
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, 
  ActivityIndicator, Modal, FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useStore } from '../../../src/zustand/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { MaterialCommunityIcons } from '@expo/vector-icons';



const EditCollegeData = () => {
  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const currentUser = useStore((state) => state.userId);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [collegeName, setCollegeName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/dropdown/colleges`);
      setColleges(res.data);
    } catch (err) {
      console.error('Error fetching colleges:', err);
      Alert.alert('Error', 'Failed to fetch colleges');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setCollegeName('');
    setAdminPassword('');
    setModalVisible(true);
  };

  const openEditModal = (college) => {
    setModalMode('edit');
    setSelectedCollege(college);
    setCollegeName(college.name);
    setAdminPassword('');
    setModalVisible(true);
  };

  const openDeleteModal = (college) => {
    setModalMode('delete');
    setSelectedCollege(college);
    setAdminPassword('');
    setModalVisible(true);
  };

  const handleAction = async () => {
    if ((modalMode === 'add' || modalMode === 'edit') && !collegeName.trim()) {
      Alert.alert('Validation Error', 'College name is required.');
      return;
    }
    if (!adminPassword.trim()) {
      Alert.alert('Validation Error', 'Admin password is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        await axios.post(`${baseURL}/dropdown/colleges`, {
          name: collegeName,
          password: adminPassword
        });
        Alert.alert('Success', 'College added successfully!');
      } else if (modalMode === 'edit') {
        await axios.put(`${baseURL}/dropdown/colleges/${selectedCollege.id}`, {
          name: collegeName,
          password: adminPassword
        });
        Alert.alert('Success', 'College updated successfully!');
      } else if (modalMode === 'delete') {
        await axios.delete(`${baseURL}/dropdown/colleges/${selectedCollege.id}`, {
          data: { password: adminPassword }
        });
        Alert.alert('Success', 'College deleted successfully!');
      }
      
      setModalVisible(false);
      fetchColleges();
    } catch (err) {
      console.error(`Error ${modalMode}ing college:`, err);
      Alert.alert('Error', err.response?.data?.message || `Failed to ${modalMode} college.`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredColleges = colleges.filter(college =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCollegeItem = ({ item }) => (
    <View style={[styles.collegeItem, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>
      <View style={styles.collegeInfo}>
        <Text style={[styles.collegeId, { color: isDark ? "#888" : "#888" }]}>#{item.id}</Text>
        <Text style={[styles.collegeName, { color: isDark ? "#fff" : "#333" }]} numberOfLines={2}>
          {item.name}
        </Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: isDark ? '#2a2a3a' : '#f0f0f0' }]}
          onPress={() => openEditModal(item)}
        >
          <Icon name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: isDark ? '#2a2a3a' : '#f0f0f0' }]}
          onPress={() => openDeleteModal(item)}
        >
          <Icon name="delete" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? "#bb86fc" : "#8B7FB8" }]}>College Manager</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addBtn}>
          <Icon name="add" size={28} color={isDark ? "#bb86fc" : "#8B7FB8"} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#444" : "#ddd" }]}>
          <Icon name="search" size={22} color={isDark ? "#888" : "#888"} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? "#fff" : "#333" }]}
            placeholder="Search colleges..."
            placeholderTextColor={isDark ? "#888" : "#999"}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8B7FB8" />
          <Text style={{ color: isDark ? "#ccc" : "#666", marginTop: 10 }}>Loading colleges...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredColleges}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCollegeItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={{ color: isDark ? '#ccc' : '#666' }}>No colleges found.</Text>
            </View>
          }
        />
      )}

      {/* Action Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: isDark ? "#1e1e2e" : "#fff" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: isDark ? "#fff" : "#333" }]}>
                {modalMode === 'add' ? 'Add College' : modalMode === 'edit' ? 'Edit College' : 'Delete College'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={isDark ? "#ccc" : "#555"} />
              </TouchableOpacity>
            </View>

            {modalMode === 'delete' ? (
              <Text style={[styles.deletePrompt, { color: isDark ? "#ccc" : "#555" }]}>
                Are you sure you want to delete <Text style={{fontWeight: 'bold'}}>{selectedCollege?.name}</Text>?
              </Text>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>College Name</Text>
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                  value={collegeName}
                  onChangeText={setCollegeName}
                  placeholder="Enter college name"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Admin Password</Text>
              <TextInput
                style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                value={adminPassword}
                onChangeText={setAdminPassword}
                placeholder="Enter admin password"
                placeholderTextColor={isDark ? "#888" : "#999"}
                secureTextEntry
              />
            </View>

            <TouchableOpacity 
              style={[
                styles.actionBtn, 
                { backgroundColor: modalMode === 'delete' ? '#F44336' : (isDark ? '#bb86fc' : '#8B7FB8') },
                submitting && { opacity: 0.7 }
              ]} 
              onPress={handleAction}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionBtnText}>
                  {modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Save' : 'Delete'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  addBtn: { padding: 8 },
  searchContainer: { paddingHorizontal: 16, paddingBottom: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 16, paddingBottom: 20 },
  collegeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  collegeInfo: { flex: 1, marginRight: 10 },
  collegeId: { fontSize: 12, marginBottom: 4 },
  collegeName: { fontSize: 16, fontWeight: '600' },
  actionButtons: { flexDirection: 'row', gap: 10 },
  iconButton: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: 'center', alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  deletePrompt: { fontSize: 16, marginBottom: 20, lineHeight: 24 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  actionBtn: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  actionBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default EditCollegeData;




