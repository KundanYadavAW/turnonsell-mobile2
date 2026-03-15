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



const EditYearData = () => {
  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'delete'
  const [selectedYear, setSelectedYear] = useState(null);
  const [yearName, setYearName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/dropdown/years`);
      const mappedData = res.data.map(item => ({
          id: item.id,
          name: item.name || item.year_name  // Handle both cases as backend returns year_name
      }));
      setYears(mappedData);
    } catch (err) {
      console.error('Error fetching years:', err);
      Alert.alert('Error', 'Failed to fetch years');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setYearName('');
    setAdminPassword('');
    setModalVisible(true);
  };

  const openEditModal = (yearItem) => {
    setModalMode('edit');
    setSelectedYear(yearItem);
    setYearName(yearItem.name);
    setAdminPassword('');
    setModalVisible(true);
  };

  const openDeleteModal = (yearItem) => {
    setModalMode('delete');
    setSelectedYear(yearItem);
    setAdminPassword('');
    setModalVisible(true);
  };

  const handleAction = async () => {
    if ((modalMode === 'add' || modalMode === 'edit') && !yearName.trim()) {
      Alert.alert('Validation Error', 'Year name is required.');
      return;
    }
    if (!adminPassword.trim()) {
      Alert.alert('Validation Error', 'Admin password is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        await axios.post(`${baseURL}/dropdown/years`, {
          name: yearName,
          password: adminPassword
        });
        Alert.alert('Success', 'Year added successfully!');
      } else if (modalMode === 'edit') {
        await axios.put(`${baseURL}/dropdown/years/${selectedYear.id}`, {
          name: yearName,
          password: adminPassword
        });
        Alert.alert('Success', 'Year updated successfully!');
      } else if (modalMode === 'delete') {
        await axios.delete(`${baseURL}/dropdown/years/${selectedYear.id}`, {
          data: { password: adminPassword }
        });
        Alert.alert('Success', 'Year deleted successfully!');
      }
      
      setModalVisible(false);
      fetchYears();
    } catch (err) {
      console.error(`Error ${modalMode}ing year:`, err);
      Alert.alert('Error', err.response?.data?.message || `Failed to ${modalMode} year.`);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredYears = years.filter(year =>
    year.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderYearItem = ({ item }) => (
    <View style={[styles.yearItem, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>
      <View style={styles.yearInfo}>
        <Text style={[styles.yearId, { color: isDark ? "#888" : "#888" }]}>#{item.id}</Text>
        <Text style={[styles.yearName, { color: isDark ? "#fff" : "#333" }]} numberOfLines={2}>
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
        <Text style={[styles.headerTitle, { color: isDark ? "#bb86fc" : "#8B7FB8" }]}>Year Manager</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addBtn}>
          <Icon name="add" size={28} color={isDark ? "#bb86fc" : "#8B7FB8"} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBox, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#444" : "#ddd" }]}>
          <Icon name="search" size={22} color={isDark ? "#888" : "#888"} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? "#fff" : "#333" }]}
            placeholder="Search years..."
            placeholderTextColor={isDark ? "#888" : "#999"}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#8B7FB8" />
          <Text style={{ color: isDark ? "#ccc" : "#666", marginTop: 10 }}>Loading years...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredYears}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderYearItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <Text style={{ color: isDark ? '#ccc' : '#666' }}>No years found.</Text>
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
                {modalMode === 'add' ? 'Add Year' : modalMode === 'edit' ? 'Edit Year' : 'Delete Year'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={isDark ? "#ccc" : "#555"} />
              </TouchableOpacity>
            </View>

            {modalMode === 'delete' ? (
              <Text style={[styles.deletePrompt, { color: isDark ? "#ccc" : "#555" }]}>
                Are you sure you want to delete <Text style={{fontWeight: 'bold'}}>{selectedYear?.name}</Text>?
              </Text>
            ) : (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Year Name</Text>
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                  value={yearName}
                  onChangeText={setYearName}
                  placeholder="Enter year name"
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
  yearItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  yearInfo: { flex: 1, marginRight: 10 },
  yearId: { fontSize: 12, marginBottom: 4 },
  yearName: { fontSize: 16, fontWeight: '600' },
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

export default EditYearData;




