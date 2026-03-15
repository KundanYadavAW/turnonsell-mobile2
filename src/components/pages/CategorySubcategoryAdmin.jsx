import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useStore } from '../../../src/zustand/store';


import axiosInstance from "../mycomponents/AxiosInstance"; // if applicable for React Native, otherwise use axios directly

const CategorySubcategoryAdmin = () => {
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const [password, setPassword] = useState("");
  const [activeSection, setActiveSection] = useState("category"); // 'category' or 'subcategory'

  // Data
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Selections
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Dropdown States
  const [openGender, setOpenGender] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);

  // Inputs
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");

  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editSubcategoryId, setEditSubcategoryId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH GENDERS ================= */
  useEffect(() => {
    fetchGenders();
  }, [baseURL]);

  const fetchGenders = async () => {
    try {
      const res = await axios.get(`${baseURL}/dropdown/genders`);
      setGenders(res.data.map(g => ({ label: g.name, value: g.id })));
    } catch (err) {
      console.error("Error fetching genders:", err);
    }
  };

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    if (selectedGender) {
      setLoading(true);
      axios
        .get(`${baseURL}/dropdown/categories/${selectedGender}`)
        .then(res => {
          setCategories(res.data);
          setSubcategories([]);
          setSelectedCategory(null);
        })
        .catch(err => console.error("Error fetching categories:", err))
        .finally(() => setLoading(false));
    } else {
       setCategories([]);
    }
  }, [selectedGender, baseURL]);

  /* ================= FETCH SUBCATEGORIES ================= */
  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      axios
        .get(`${baseURL}/dropdown/subcategories/${selectedCategory}`)
        .then(res => setSubcategories(res.data))
        .catch(err => console.error("Error fetching subcategories:", err))
        .finally(() => setLoading(false));
    } else {
       setSubcategories([]);
    }
  }, [selectedCategory, baseURL]);

  /* ================= CATEGORY CRUD ================= */
  const addOrEditCategory = async () => {
    if (!categoryName.trim() || !password.trim() || !selectedGender) {
      Alert.alert("Validation", "All fields are required!");
      return;
    }

    setSubmitting(true);
    try {
      if (editCategoryId) {
        await axiosInstance.put(`${baseURL}/dropdown/editCategory/${editCategoryId}`, {
          name: categoryName,
          password
        });
        Alert.alert("Success", "Category updated successfully!");
      } else {
        await axiosInstance.post(`${baseURL}/dropdown/addCategory`, {
          name: categoryName,
          gender_id: selectedGender,
          password
        });
        Alert.alert("Success", "Category added successfully!");
      }

      setCategoryName("");
      setEditCategoryId(null);
      
      // Refresh categories
      const res = await axios.get(`${baseURL}/dropdown/categories/${selectedGender}`);
      setCategories(res.data);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Error occurred");
    } finally {
       setSubmitting(false);
    }
  };

  const deleteCategory = (id) => {
    if (!password.trim()) {
      Alert.alert("Validation", "Password is required!");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await axiosInstance.delete(`${baseURL}/dropdown/deleteCategory/${id}`, {
                data: { password }
              });
              Alert.alert("Success", "Category deleted successfully!");
              setCategories(categories.filter(c => c.id !== id));
            } catch (err) {
              Alert.alert("Error", err.response?.data?.message || "Error occurred");
            }
          }
        }
      ]
    );
  };

  /* ================= SUBCATEGORY CRUD ================= */
  const addOrEditSubcategory = async () => {
    if (!subcategoryName.trim() || !password.trim() || !selectedCategory) {
      Alert.alert("Validation", "All fields are required!");
      return;
    }

    setSubmitting(true);
    try {
      if (editSubcategoryId) {
        await axiosInstance.put(`${baseURL}/dropdown/editSubcategory/${editSubcategoryId}`, {
          name: subcategoryName,
          password
        });
        Alert.alert("Success", "Subcategory updated successfully!");
      } else {
        await axiosInstance.post(`${baseURL}/dropdown/addSubcategory`, {
          name: subcategoryName,
          category_id: selectedCategory,
          password
        });
        Alert.alert("Success", "Subcategory added successfully!");
      }

      setSubcategoryName("");
      setEditSubcategoryId(null);
      
      // Refresh subcategories
      const res = await axios.get(`${baseURL}/dropdown/subcategories/${selectedCategory}`);
      setSubcategories(res.data);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Error occurred");
    } finally {
       setSubmitting(false);
    }
  };

  const deleteSubcategory = (id) => {
    if (!password.trim()) {
      Alert.alert("Validation", "Password is required!");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this subcategory?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              await axiosInstance.delete(`${baseURL}/dropdown/deleteSubcategory/${id}`, {
                data: { password }
              });
              Alert.alert("Success", "Subcategory deleted successfully!");
              setSubcategories(subcategories.filter(s => s.id !== id));
            } catch (err) {
              Alert.alert("Error", err.response?.data?.message || "Error occurred");
            }
          }
        }
      ]
    );
  };

  const renderListItem = ({ item, type }) => (
    <View style={[styles.listItem, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>
      <Text style={[styles.listItemText, { color: isDark ? "#fff" : "#333" }]}>{item.name}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: isDark ? '#332b1a' : '#fff3e0' }]}
          onPress={() => {
            if (type === 'category') {
              setCategoryName(item.name);
              setEditCategoryId(item.id);
            } else {
              setSubcategoryName(item.name);
              setEditSubcategoryId(item.id);
            }
          }}
        >
          <Icon name="edit" size={20} color="#ff9800" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: isDark ? '#3a2020' : '#ffebee' }]}
          onPress={() => type === 'category' ? deleteCategory(item.id) : deleteSubcategory(item.id)}
        >
          <Icon name="delete" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        {/* Header */}
        <View style={[styles.headerGradient, { backgroundColor: isDark ? "#1e1e2e" : "#6A1B9A" }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.headerTitle}>Category & Subcategory Admin</Text>
            <Text style={styles.headerSubtitle}>Manage your products</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          {/* Password Section */}
          <View style={[styles.card, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#eee" }]}>
            <Text style={[styles.label, { color: isDark ? "#ccc" : "#2c3e50" }]}>🔐 Admin Password</Text>
            <TextInput
              style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your admin password"
              placeholderTextColor={isDark ? "#888" : "#999"}
              secureTextEntry
            />
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeSection === "category" ? (isDark ? styles.tabBtnActiveDark : styles.tabBtnActiveLight) : (isDark ? styles.tabBtnInactiveDark : styles.tabBtnInactiveLight)
              ]}
              onPress={() => setActiveSection("category")}
            >
               <Text style={[styles.tabBtnText, activeSection === "category" ? styles.tabBtnTextActive : (isDark ? {color: '#ccc'} : {color: '#555'})]}>
                 📂 Categories
               </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.tabBtn, 
                activeSection === "subcategory" ? (isDark ? styles.tabBtnActiveDark : styles.tabBtnActiveLight) : (isDark ? styles.tabBtnInactiveDark : styles.tabBtnInactiveLight)
              ]}
              onPress={() => setActiveSection("subcategory")}
            >
               <Text style={[styles.tabBtnText, activeSection === "subcategory" ? styles.tabBtnTextActive : (isDark ? {color: '#ccc'} : {color: '#555'})]}>
                 📁 Subcategories
               </Text>
            </TouchableOpacity>
          </View>

          {/* ---------------- CATEGORY SECTION ---------------- */}
          {activeSection === "category" && (
            <View style={[styles.contentCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#eee" }]}>
              
              <View style={{ zIndex: 3000, marginBottom: 16 }}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#2c3e50" }]}>Gender</Text>
                <DropDownPicker
                  open={openGender}
                  value={selectedGender}
                  items={genders}
                  setOpen={setOpenGender}
                  setValue={setSelectedGender}
                  style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }]}
                  textStyle={{ color: isDark ? "#fff" : "#333" }}
                  dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }}
                  zIndex={3000}
                  zIndexInverse={1000}
                  placeholder="Select Gender"
                  listMode="SCROLLVIEW"
                />
              </View>

              <View style={[styles.inputGroup, { zIndex: 1000 }]}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#2c3e50" }]}>Category Name</Text>
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }]}
                  value={categoryName}
                  onChangeText={setCategoryName}
                  placeholder="Enter Category Name"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                />
              </View>

              <View style={[styles.actionButtonsRow, { zIndex: 1000 }]}>
                 {editCategoryId && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => {setCategoryName(""); setEditCategoryId(null)}}>
                       <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                 )}
                 <TouchableOpacity 
                   style={[styles.primaryBtn, submitting && { opacity: 0.7 }]}
                   onPress={addOrEditCategory}
                   disabled={submitting}
                 >
                   {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{editCategoryId ? "Update Category" : "Add Category"}</Text>}
                 </TouchableOpacity>
              </View>

              {loading ? (
                 <ActivityIndicator size="small" color="#6A1B9A" style={{ marginTop: 20 }} />
              ) : (
                 <FlatList
                   data={categories}
                   keyExtractor={(item) => item.id.toString()}
                   renderItem={({item}) => renderListItem({ item, type: 'category' })}
                   scrollEnabled={false}
                   style={{ marginTop: 20 }}
                   ListEmptyComponent={<Text style={{ color: isDark ? '#ccc' : '#666', textAlign: 'center', marginTop: 10 }}>No categories found for selected gender.</Text>}
                 />
              )}
            </View>
          )}

          {/* ---------------- SUBCATEGORY SECTION ---------------- */}
          {activeSection === "subcategory" && (
            <View style={[styles.contentCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#eee" }]}>
              
              <View style={{ zIndex: 4000, marginBottom: 16 }}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#2c3e50" }]}>Gender Filter</Text>
                <DropDownPicker
                  open={openGender}
                  value={selectedGender}
                  items={genders}
                  setOpen={setOpenGender}
                  setValue={setSelectedGender}
                  style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }]}
                  textStyle={{ color: isDark ? "#fff" : "#333" }}
                  dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }}
                  zIndex={4000}
                  zIndexInverse={1000}
                  placeholder="Select Gender First"
                  listMode="SCROLLVIEW"
                />
              </View>

              <View style={{ zIndex: 3000, marginBottom: 16 }}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#2c3e50" }]}>Category</Text>
                <DropDownPicker
                  open={openCategory}
                  value={selectedCategory}
                  items={categories.map(c => ({ label: c.name, value: c.id }))}
                  setOpen={setOpenCategory}
                  setValue={setSelectedCategory}
                  style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }]}
                  textStyle={{ color: isDark ? "#fff" : "#333" }}
                  dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }}
                  zIndex={3000}
                  zIndexInverse={2000}
                  placeholder="Select Category"
                  listMode="SCROLLVIEW"
                />
              </View>

              <View style={[styles.inputGroup, { zIndex: 1000 }]}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#2c3e50" }]}>Subcategory Name</Text>
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#e0e6ed" }]}
                  value={subcategoryName}
                  onChangeText={setSubcategoryName}
                  placeholder="Enter Subcategory Name"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                />
              </View>

              <View style={[styles.actionButtonsRow, { zIndex: 1000 }]}>
                 {editSubcategoryId && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => {setSubcategoryName(""); setEditSubcategoryId(null)}}>
                       <Text style={styles.cancelBtnText}>Cancel</Text>
                    </TouchableOpacity>
                 )}
                 <TouchableOpacity 
                   style={[styles.primaryBtn, submitting && { opacity: 0.7 }]}
                   onPress={addOrEditSubcategory}
                   disabled={submitting}
                 >
                   {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>{editSubcategoryId ? "Update Subcategory" : "Add Subcategory"}</Text>}
                 </TouchableOpacity>
              </View>

              {loading ? (
                 <ActivityIndicator size="small" color="#6A1B9A" style={{ marginTop: 20 }} />
              ) : (
                 <FlatList
                   data={subcategories}
                   keyExtractor={(item) => item.id.toString()}
                   renderItem={({item}) => renderListItem({ item, type: 'subcategory' })}
                   scrollEnabled={false}
                   style={{ marginTop: 20 }}
                   ListEmptyComponent={<Text style={{ color: isDark ? '#ccc' : '#666', textAlign: 'center', marginTop: 10 }}>No subcategories found for selected category.</Text>}
                 />
              )}
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  scrollContent: { padding: 16, paddingBottom: 60 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contentCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8 },
  inputGroup: { marginBottom: 16 },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontWeight: '600'
  },
  dropdown: { borderRadius: 12, borderWidth: 2, minHeight: 50 },
  tabsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnActiveLight: { backgroundColor: '#6A1B9A', shadowColor: '#6A1B9A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  tabBtnActiveDark: { backgroundColor: '#bb86fc' },
  tabBtnInactiveLight: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  tabBtnInactiveDark: { backgroundColor: '#1e1e2e', borderWidth: 1, borderColor: '#333' },
  tabBtnText: { fontSize: 16, fontWeight: '700' },
  tabBtnTextActive: { color: '#fff' },
  actionButtonsRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6A1B9A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cancelBtn: {
    borderWidth: 2,
    borderColor: '#F44336',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  cancelBtnText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  listItemText: { fontSize: 16, fontWeight: '600', flex: 1, marginRight: 10 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  }
});

export default CategorySubcategoryAdmin;




