// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, 
//   SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, 
//   ActivityIndicator, Image 
// } from 'react-native';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import axios from 'axios';
// import { useStore } from '../../../src/zustand/store';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import * as ImagePicker from 'expo-image-picker';
// import DropDownPicker from 'react-native-dropdown-picker';



// const EditClothPost = () => {
//   const route = useRoute();
//   const { id } = route.params || {};
  
//   const accessToken = useStore((state) => state.accessToken);
//   const baseURL = useStore((state) => state.baseURL);
//   const darkMode = useStore((state) => state.darkMode);
//   const currentUser = useStore((state) => state.userId);
//   const navigation = useNavigation();

//   const isDark = darkMode === true || darkMode === "true";

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     collegeId: "",
//     genderId: "",
//     categoryId: "",
//     subcategoryId: "",
//     description: "",
//     price: "",
//     phone_number: "",
//     rate: 0,
//     images: [] // existing images or newly picked images
//   });

//   // Dropdown States
//   const [colleges, setColleges] = useState([]);
//   const [genders, setGenders] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);

//   // Dropdown Picker States
//   const [openCollege, setOpenCollege] = useState(false);
//   const [openGender, setOpenGender] = useState(false);
//   const [openCategory, setOpenCategory] = useState(false);
//   const [openSubcategory, setOpenSubcategory] = useState(false);

//   useEffect(() => {
//     fetchInitialDropdowns();
//     if (id) {
//       fetchPost();
//     }
//   }, [id]);

//   const fetchInitialDropdowns = async () => {
//     try {
//       const [colRes, genRes] = await Promise.all([
//         axios.get(`${baseURL}/dropdown/colleges`),
//         axios.get(`${baseURL}/dropdown/genders`)
//       ]);
//       setColleges(colRes.data.map(c => ({ label: c.name, value: c.id })));
//       setGenders(genRes.data.map(g => ({ label: g.name, value: g.id })));
//     } catch (error) {
//       console.error("Error fetching initial dropdowns", error);
//     }
//   };

//   const fetchPost = async () => {
//     try {
//       const response = await axios.get(`${baseURL}/cloth/clothpostsbyid/${id}`);
//       const post = response.data;

//       // Redirect if not the owner
//       if (parseInt(post.user_id) !== parseInt(currentUser)) {
//         Alert.alert("Unauthorized", "You are not authorized to edit this post");
//         navigation.goBack();
//         return;
//       }

//       setFormData({
//         collegeId: post.college_id,
//         genderId: post.gender_id,
//         categoryId: post.category_id,
//         subcategoryId: post.subcategory_id,
//         description: post.description || "",
//         price: post.price ? post.price.toString() : "",
//         phone_number: post.phone_number || "",
//         rate: post.rate || 0,
//         images: Array.isArray(post.images) ? post.images : (typeof post.images === 'string' ? JSON.parse(post.images) : [])
//       });
      
//       // Fetch dependent dropdowns
//       if (post.gender_id) fetchCategories(post.gender_id);
//       if (post.category_id) fetchSubcategories(post.category_id);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching post:", error);
//       Alert.alert("Error", "Could not load post data.");
//       navigation.goBack();
//     }
//   };

//   const fetchCategories = async (genderId) => {
//     if (!genderId) return;
//     try {
//       const response = await axios.get(`${baseURL}/dropdown/categories/${genderId}`);
//       setCategories(response.data.map(c => ({ label: c.name, value: c.id })));
//       // Reset subcategories if fetching new categories manually
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchSubcategories = async (categoryId) => {
//     if (!categoryId) return;
//     try {
//       const response = await axios.get(`${baseURL}/dropdown/subcategories/${categoryId}`);
//       setSubcategories(response.data.map(sc => ({ label: sc.name, value: sc.id })));
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };

//   const handleChange = (name, value) => {
//     setFormData(prev => ({ ...prev, [name]: value }));
//     if (name === 'genderId') {
//       fetchCategories(value);
//       setFormData(prev => ({ ...prev, categoryId: '', subcategoryId: '' }));
//       setSubcategories([]);
//     }
//     if (name === 'categoryId') {
//       fetchSubcategories(value);
//       setFormData(prev => ({ ...prev, subcategoryId: '' }));
//     }
//   };

//   const handlePickImages = async () => {
//     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
//       return;
//     }

//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 0.8,
//     });

//     if (!result.canceled && result.assets) {
//       const newImages = result.assets.map(asset => ({
//         uri: asset.uri,
//         name: asset.fileName || `cloth_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
//         type: asset.mimeType || 'image/jpeg',
//         isNew: true
//       }));

//       // Replace existing images with new ones (same logic as EditPost)
//       setFormData(prev => ({ ...prev, images: newImages }));
//     }
//   };

//   const validateForm = () => {
//     if (!formData.collegeId) return "College is required.";
//     if (!formData.genderId) return "Gender is required.";
//     if (!formData.categoryId) return "Category is required.";
//     if (!formData.subcategoryId) return "Subcategory is required.";
//     if (!formData.description?.trim()) return "Description is required.";
//     if (!formData.price?.trim()) return "Price is required.";
//     if (!formData.rate) return "Rate is required.";
//     return null;
//   };

//   const handleSubmit = async () => {
//     const errorMsg = validateForm();
//     if (errorMsg) {
//       Alert.alert("Validation Error", errorMsg);
//       return;
//     }

//     setSubmitting(true);
//     const formDataToSend = new FormData();
//     formDataToSend.append("college_id", formData.collegeId);
//     formDataToSend.append("gender_id", formData.genderId);
//     formDataToSend.append("category_id", formData.categoryId);
//     formDataToSend.append("subcategory_id", formData.subcategoryId);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("price", formData.price);
//     formDataToSend.append("phone_number", formData.phone_number);
//     formDataToSend.append("rate", formData.rate.toString());

//     // Images
//     const hasNewImages = formData.images.length > 0 && formData.images[0].isNew;
//     if (hasNewImages) {
//       formData.images.forEach((img) => {
//         formDataToSend.append("images", {
//           uri: img.uri,
//           name: img.name,
//           type: img.type
//         });
//       });
//     } else {
//       // Send existing string JSON
//       formDataToSend.append("images", JSON.stringify(formData.images));
//     }

//     try {
//       await axios.put(`${baseURL}/cloth/editclothposts/${id}`, formDataToSend, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "multipart/form-data"
//         }
//       });
      
//       Alert.alert("Success", "Clothing post updated successfully!");
//       navigation.goBack();
//     } catch (error) {
//       console.error("Error updating cloth post:", error);
//       Alert.alert("Error", error.response?.data?.message || "Error updating post");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const renderStars = () => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <TouchableOpacity key={i} onPress={() => handleChange("rate", i)}>
//           <Icon 
//             name={i <= formData.rate ? "star" : "star-border"} 
//             size={36} 
//             color={i <= formData.rate ? "#FFD700" : (isDark ? "#555" : "#ccc")} 
//           />
//         </TouchableOpacity>
//       );
//     }
//     return <View style={styles.starsContainer}>{stars}</View>;
//   };

//   if (loading) {
//     return (
//       <View style={[styles.centerContainer, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
//         <ActivityIndicator size="large" color="#9370DB" />
//         <Text style={{ color: isDark ? "#fff" : "#333", marginTop: 10 }}>Loading post data...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
//       <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
//         <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
//           <View style={styles.header}>
//             <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
//               <Icon name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
//             </TouchableOpacity>
//             <Text style={[styles.headerTitle, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>Edit Clothing Post</Text>
//             <View style={{ width: 24 }} />
//           </View>

//           <View style={[styles.formCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>
            
//             {/* Dropdowns */}
//             <View style={{ zIndex: 4000, marginBottom: 16 }}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>College</Text>
//               <DropDownPicker
//                 open={openCollege}
//                 value={formData.collegeId}
//                 items={colleges}
//                 setOpen={setOpenCollege}
//                 setValue={(val) => handleChange("collegeId", val())}
//                 style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
//                 textStyle={{ color: isDark ? "#fff" : "#333" }}
//                 dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
//                 zIndex={4000}
//                 zIndexInverse={1000}
//                 listMode="SCROLLVIEW"
//                 searchable={true}
//                 placeholder="Select College"
//               />
//             </View>

//             <View style={{ zIndex: 3000, marginBottom: 16 }}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Gender</Text>
//               <DropDownPicker
//                 open={openGender}
//                 value={formData.genderId}
//                 items={genders}
//                 setOpen={setOpenGender}
//                 setValue={(val) => handleChange("genderId", val())}
//                 style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
//                 textStyle={{ color: isDark ? "#fff" : "#333" }}
//                 dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
//                 zIndex={3000}
//                 zIndexInverse={2000}
//                 listMode="SCROLLVIEW"
//                 placeholder="Select Gender"
//               />
//             </View>

//             <View style={{ zIndex: 2000, marginBottom: 16 }}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Category</Text>
//               <DropDownPicker
//                 open={openCategory}
//                 value={formData.categoryId}
//                 items={categories}
//                 setOpen={setOpenCategory}
//                 setValue={(val) => handleChange("categoryId", val())}
//                 style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
//                 textStyle={{ color: isDark ? "#fff" : "#333" }}
//                 dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
//                 zIndex={2000}
//                 zIndexInverse={3000}
//                 listMode="SCROLLVIEW"
//                 placeholder={categories.length > 0 ? "Select Category" : "Select Gender First"}
//                 disabled={categories.length === 0}
//               />
//             </View>

//             <View style={{ zIndex: 1000, marginBottom: 16 }}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Subcategory</Text>
//               <DropDownPicker
//                 open={openSubcategory}
//                 value={formData.subcategoryId}
//                 items={subcategories}
//                 setOpen={setOpenSubcategory}
//                 setValue={(val) => handleChange("subcategoryId", val())}
//                 style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
//                 textStyle={{ color: isDark ? "#fff" : "#333" }}
//                 dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
//                 zIndex={1000}
//                 zIndexInverse={4000}
//                 listMode="SCROLLVIEW"
//                 placeholder={subcategories.length > 0 ? "Select Subcategory" : "Select Category First"}
//                 disabled={subcategories.length === 0}
//               />
//             </View>

//             {/* Form Fields */}
//             <View style={styles.inputGroup}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Price (₹)</Text>
//               <TextInput
//                 style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
//                 value={formData.price}
//                 onChangeText={(text) => handleChange("price", text)}
//                 placeholder="Enter price"
//                 placeholderTextColor={isDark ? "#888" : "#999"}
//                 keyboardType="numeric"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Description</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
//                 value={formData.description}
//                 onChangeText={(text) => handleChange("description", text)}
//                 placeholder="Enter clothing details, size, brand etc."
//                 placeholderTextColor={isDark ? "#888" : "#999"}
//                 multiline
//                 numberOfLines={4}
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Phone Number (Optional)</Text>
//               <TextInput
//                 style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
//                 value={formData.phone_number}
//                 onChangeText={(text) => handleChange("phone_number", text)}
//                 placeholder="Phone number"
//                 placeholderTextColor={isDark ? "#888" : "#999"}
//                 keyboardType="phone-pad"
//               />
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Condition Rating</Text>
//               {renderStars()}
//             </View>

//             {/* Images */}
//             <View style={styles.inputGroup}>
//               <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Images</Text>
//               <View style={styles.imagesContainer}>
//                 {formData.images.map((img, idx) => (
//                   <View key={idx} style={styles.imageWrapper}>
//                     <Image 
//                       source={{ uri: img.isNew ? img.uri : `${baseURL}/uploads/${img}` }} 
//                       style={styles.postImage} 
//                     />
//                   </View>
//                 ))}
//                 <TouchableOpacity style={[styles.addImageBtn, { borderColor: isDark ? "#555" : "#ccc" }]} onPress={handlePickImages}>
//                   <Icon name="add-photo-alternate" size={32} color={isDark ? "#bbb" : "#666"} />
//                   <Text style={{ color: isDark ? '#bbb' : '#666', fontSize: 12, marginTop: 4 }}>Pick</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             <TouchableOpacity 
//               style={[styles.submitButton, submitting && { opacity: 0.7 }]}
//               onPress={handleSubmit}
//               disabled={submitting}
//             >
//               {submitting ? (
//                 <ActivityIndicator color="#fff" />
//               ) : (
//                 <Text style={styles.submitButtonText}>Update Post</Text>
//               )}
//             </TouchableOpacity>

//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   scrollContent: { padding: 16, paddingBottom: 40 },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   backBtn: { padding: 8 },
//   headerTitle: { fontSize: 22, fontWeight: 'bold' },
//   formCard: {
//     borderRadius: 16,
//     padding: 20,
//     borderWidth: 1,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
//   dropdown: {
//     borderRadius: 12,
//     borderWidth: 1,
//     minHeight: 50,
//   },
//   inputGroup: { marginBottom: 20 },
//   input: {
//     borderWidth: 1,
//     borderRadius: 12,
//     padding: 14,
//     fontSize: 16,
//   },
//   textArea: { height: 100, textAlignVertical: 'top' },
//   starsContainer: { flexDirection: 'row', gap: 8 },
//   imagesContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//     marginTop: 8,
//   },
//   imageWrapper: {
//     width: 80, height: 80, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd'
//   },
//   postImage: { width: '100%', height: '100%' },
//   addImageBtn: {
//     width: 80, height: 80, borderRadius: 8, borderWidth: 2, borderStyle: 'dashed',
//     alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'
//   },
//   submitButton: {
//     backgroundColor: '#8a2be2',
//     height: 54,
//     borderRadius: 27,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     shadowColor: "#8a2be2",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
// });

// export default EditClothPost;













import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useStore } from '../../../src/zustand/store';
import axiosInstance from "../mycomponents/AxiosInstance";

const { height } = Dimensions.get("window");

// ─── High-performance Searchable Picker (handles 4500+ items) ────────────────
const SearchablePicker = ({
  label,
  placeholder,
  items,
  value,
  onChange,
  isDark,
  disabled = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceTimer = useRef(null);
  const inputRef = useRef(null);

  // Debounce search so we don't filter large lists on every keystroke
  const handleSearchChange = useCallback((text) => {
    setSearch(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(text);
    }, 200);
  }, []);

  // useMemo so we only re-filter when debouncedSearch or items change
  const filteredItems = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return items;
    }
    const q = debouncedSearch.toLowerCase().trim();
    // Prioritize: starts-with first, then contains
    const startsWith = [];
    const contains = [];
    for (const item of items) {
      const lbl = item.label.toLowerCase();
      if (lbl.startsWith(q)) startsWith.push(item);
      else if (lbl.includes(q)) contains.push(item);
    }
    return [...startsWith, ...contains];
  }, [debouncedSearch, items]);

  const selectedLabel = value
    ? items.find((i) => i.value === value)?.label ?? placeholder
    : placeholder;

  const openModal = useCallback(() => {
    if (disabled) return;
    setSearch("");
    setDebouncedSearch("");
    setModalVisible(true);
  }, [disabled]);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setSearch("");
    setDebouncedSearch("");
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const handleSelect = useCallback((item) => {
    onChange(item.value);
    closeModal();
  }, [onChange, closeModal]);

  const handleClearInline = useCallback(() => {
    onChange(null);
  }, [onChange]);

  const handleClearModal = useCallback(() => {
    onChange(null);
    closeModal();
  }, [onChange, closeModal]);

  // Memoized renderItem — critical for FlatList performance with large lists
  const renderItem = useCallback(({ item }) => {
    const isSelected = item.value === value;
    return (
      <TouchableOpacity
        style={[
          pickerStyles.optionItem,
          isDark ? pickerStyles.darkOption : pickerStyles.lightOption,
          isSelected && (isDark ? pickerStyles.darkSelectedOption : pickerStyles.lightSelectedOption),
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            pickerStyles.optionText,
            isDark ? pickerStyles.darkText : pickerStyles.lightText,
            isSelected && pickerStyles.selectedOptionText,
          ]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={18} color="#8A63D2" />
        )}
      </TouchableOpacity>
    );
  }, [value, isDark, handleSelect]);

  const keyExtractor = useCallback((item) => String(item.value), []);

  // Empty component
  const ListEmpty = useMemo(() => (
    <View style={pickerStyles.noResultsWrap}>
      <Ionicons name="search-outline" size={36} color={isDark ? "#555" : "#ccc"} />
      <Text style={[pickerStyles.noResultsLabel, { color: isDark ? "#aaa" : "#888" }]}>
        No results for "{debouncedSearch}"
      </Text>
    </View>
  ), [debouncedSearch, isDark]);

  // Result count header
  const ListHeader = useMemo(() => {
    if (!debouncedSearch.trim() || filteredItems.length === 0) return null;
    return (
      <Text style={[pickerStyles.resultCount, { color: isDark ? "#888" : "#aaa" }]}>
        {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
      </Text>
    );
  }, [debouncedSearch, filteredItems.length, isDark]);

  return (
    <>
      {/* ── Trigger button ── */}
      <TouchableOpacity
        style={[
          pickerStyles.pickerTrigger,
          isDark ? pickerStyles.darkDropdown : pickerStyles.lightDropdown,
          disabled && pickerStyles.disabledTrigger,
        ]}
        onPress={openModal}
        activeOpacity={disabled ? 1 : 0.8}
      >
        <Text
          style={[
            pickerStyles.pickerTriggerText,
            {
              color: disabled
                ? (isDark ? "#444" : "#bbb")
                : value
                  ? (isDark ? "#fff" : "#333")
                  : (isDark ? "#666" : "#aaa"),
            },
          ]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        {value && !disabled ? (
          <TouchableOpacity
            onPress={handleClearInline}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={isDark ? "#888" : "#aaa"} />
          </TouchableOpacity>
        ) : (
          <Ionicons
            name="chevron-down"
            size={18}
            color={disabled ? (isDark ? "#444" : "#ccc") : (isDark ? "#888" : "#aaa")}
          />
        )}
      </TouchableOpacity>

      {/* ── Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={pickerStyles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={[pickerStyles.modalSheet, isDark ? pickerStyles.darkModal : pickerStyles.lightModal]}>

          {/* Modal header */}
          <View style={[pickerStyles.modalHeader, { borderBottomColor: isDark ? "#2D2540" : "#eee" }]}>
            <Text style={[pickerStyles.modalTitle, isDark ? pickerStyles.darkText : pickerStyles.lightText]}>
              {label}
            </Text>
            <TouchableOpacity
              onPress={closeModal}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={22} color={isDark ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>

          {/* Search bar inside modal */}
          <View style={[pickerStyles.modalSearchWrap, isDark ? pickerStyles.darkModalSearch : pickerStyles.lightModalSearch]}>
            <Ionicons name="search" size={17} color={isDark ? "#888" : "#aaa"} />
            <TextInput
              ref={inputRef}
              style={[pickerStyles.modalSearchInput, { color: isDark ? "#fff" : "#333" }]}
              placeholder={`Search ${label.toLowerCase()}...`}
              placeholderTextColor={isDark ? "#555" : "#bbb"}
              value={search}
              onChangeText={handleSearchChange}
              autoFocus
              clearButtonMode="while-editing"
              returnKeyType="search"
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => { setSearch(""); setDebouncedSearch(""); }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={17} color={isDark ? "#888" : "#aaa"} />
              </TouchableOpacity>
            )}
          </View>

          {/* Clear current selection */}
          {value && (
            <TouchableOpacity
              style={[pickerStyles.clearSelectionBtn, isDark ? pickerStyles.darkClearBtn : pickerStyles.lightClearBtn]}
              onPress={handleClearModal}
            >
              <Ionicons name="close-circle-outline" size={15} color="#8A63D2" />
              <Text style={pickerStyles.clearSelectionText}>Clear selection</Text>
            </TouchableOpacity>
          )}

          {/* High-performance list */}
          <FlatList
            data={filteredItems}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeader}
            ListEmptyComponent={ListEmpty}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={true}
            // Performance tuning for large lists:
            initialNumToRender={20}
            maxToRenderPerBatch={20}
            windowSize={5}
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
            getItemLayout={(data, index) => ({
              length: 54,
              offset: 54 * index,
              index,
            })}
          />
        </View>
      </Modal>
    </>
  );
};

// ─── Picker Styles ────────────────────────────────────────────────────────────
const pickerStyles = StyleSheet.create({
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
  },
  pickerTriggerText: { flex: 1, fontSize: 16, marginRight: 8 },
  disabledTrigger: { opacity: 0.5 },
  lightDropdown: { backgroundColor: "#fafafa", borderColor: "#ddd" },
  darkDropdown: { backgroundColor: "#2d2d3d", borderColor: "#444" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
  modalSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.82,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  lightModal: { backgroundColor: "#fff" },
  darkModal: { backgroundColor: "#1E1A2E" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 17, fontWeight: "700" },
  modalSearchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
    borderWidth: 1,
  },
  lightModalSearch: { backgroundColor: "#F7F3FF", borderColor: "#e0e0e0" },
  darkModalSearch: { backgroundColor: "#2A2333", borderColor: "#444" },
  modalSearchInput: { flex: 1, fontSize: 15 },
  resultCount: { fontSize: 12, paddingHorizontal: 20, paddingVertical: 6 },
  clearSelectionBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  lightClearBtn: { backgroundColor: "#F3E8FF" },
  darkClearBtn: { backgroundColor: "#2D2240" },
  clearSelectionText: { color: "#8A63D2", fontWeight: "600", fontSize: 14 },
  // List item — FIXED height (54px) MUST match getItemLayout
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 54,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  lightOption: { backgroundColor: "transparent" },
  darkOption: { backgroundColor: "transparent" },
  lightSelectedOption: { backgroundColor: "#F3E8FF" },
  darkSelectedOption: { backgroundColor: "#2D2240" },
  optionText: { flex: 1, fontSize: 14, marginRight: 8 },
  selectedOptionText: { color: "#8A63D2", fontWeight: "600" },
  noResultsWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 10,
  },
  noResultsLabel: { fontSize: 14 },
  lightText: { color: "#333" },
  darkText: { color: "#fff" },
});

// ─── EditClothPost Component ──────────────────────────────────────────────────
const EditClothPost = () => {
  const route = useRoute();
  const { id } = route.params || {};

  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const currentUser = useStore((state) => state.userId);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    collegeId: "",
    genderId: "",
    categoryId: "",
    subcategoryId: "",
    description: "",
    price: "",
    phone_number: "",
    rate: 0,
    images: [] // existing images or newly picked images
  });

  // Dropdown data
  const [colleges, setColleges] = useState([]);
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    fetchInitialDropdowns();
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchInitialDropdowns = async () => {
    try {
      const [colRes, genRes] = await Promise.all([
        axios.get(`${baseURL}/dropdown/colleges`),
        axios.get(`${baseURL}/dropdown/genders`)
      ]);
      setColleges(colRes.data.map(c => ({ label: c.name, value: c.id })));
      setGenders(genRes.data.map(g => ({ label: g.name, value: g.id })));
    } catch (error) {
      console.error("Error fetching initial dropdowns", error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${baseURL}/cloth/clothpostsbyid/${id}`);
      const post = response.data;

      // Redirect if not the owner
      if (parseInt(post.user_id) !== parseInt(currentUser)) {
        Alert.alert("Unauthorized", "You are not authorized to edit this post");
        navigation.goBack();
        return;
      }

      setFormData({
        collegeId: post.college_id,
        genderId: post.gender_id,
        categoryId: post.category_id,
        subcategoryId: post.subcategory_id,
        description: post.description || "",
        price: post.price ? post.price.toString() : "",
        phone_number: post.phone_number || "",
        rate: post.rate || 0,
        images: Array.isArray(post.images)
          ? post.images
          : (typeof post.images === 'string' ? JSON.parse(post.images) : [])
      });

      // Fetch dependent dropdowns
      if (post.gender_id) fetchCategories(post.gender_id);
      if (post.category_id) fetchSubcategories(post.category_id);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      Alert.alert("Error", "Could not load post data.");
      navigation.goBack();
    }
  };

  const fetchCategories = async (genderId) => {
    if (!genderId) return;
    try {
      const response = await axios.get(`${baseURL}/dropdown/categories/${genderId}`);
      setCategories(response.data.map(c => ({ label: c.name, value: c.id })));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    if (!categoryId) return;
    try {
      const response = await axios.get(`${baseURL}/dropdown/subcategories/${categoryId}`);
      setSubcategories(response.data.map(sc => ({ label: sc.name, value: sc.id })));
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'genderId') {
      fetchCategories(value);
      setFormData(prev => ({ ...prev, genderId: value, categoryId: '', subcategoryId: '' }));
      setCategories([]);
      setSubcategories([]);
    }
    if (name === 'categoryId') {
      fetchSubcategories(value);
      setFormData(prev => ({ ...prev, categoryId: value, subcategoryId: '' }));
      setSubcategories([]);
    }
  };

  // ── Image picker — same approach as UploadForm.jsx ────────────────────────
  const handlePickImages = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera roll permissions required!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => ({
          uri: asset.uri,
          type: asset.mimeType || 'image/jpeg',
          name: asset.fileName || `image_${Date.now()}.jpg`,
          width: asset.width,
          height: asset.height,
          isNew: true,
        }));
        // Replace existing images with new ones (same logic as original)
        setFormData(prev => ({ ...prev, images: newImages }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const validateForm = () => {
    if (!formData.collegeId) return "College is required.";
    if (!formData.genderId) return "Gender is required.";
    if (!formData.categoryId) return "Category is required.";
    if (!formData.subcategoryId) return "Subcategory is required.";
    if (!formData.description?.trim()) return "Description is required.";
    if (!formData.price?.trim()) return "Price is required.";
    if (!formData.rate) return "Rate is required.";
    return null;
  };

  // ── Submit — uses axiosInstance, image handling mirrors UploadForm.jsx ─────
  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      Alert.alert("Validation Error", errorMsg);
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("college_id", String(formData.collegeId));
      formDataToSend.append("gender_id", String(formData.genderId));
      formDataToSend.append("category_id", String(formData.categoryId));
      formDataToSend.append("subcategory_id", String(formData.subcategoryId));
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", String(formData.price));
      formDataToSend.append("phone_number", formData.phone_number || "");
      formDataToSend.append("rate", formData.rate.toString());

      const hasNewImages = formData.images.length > 0 && formData.images[0].isNew;

      if (hasNewImages) {
        if (Platform.OS === 'web') {
          // Web: fetch blob URI and convert to actual File object
          for (let i = 0; i < formData.images.length; i++) {
            const img = formData.images[i];
            const fetchRes = await fetch(img.uri);
            const blob = await fetchRes.blob();
            const file = new File([blob], img.name || `image_${i}.jpg`, { type: img.type || 'image/jpeg' });
            formDataToSend.append("images", file);
          }
        } else {
          // Mobile: append directly with uri/type/name object
          formData.images.forEach((img, index) => {
            const uri = Platform.OS === "ios" ? img.uri.replace("file://", "") : img.uri;
            formDataToSend.append("images", {
              uri,
              type: img.type || "image/jpeg",
              name: img.name || `image_${index}.jpg`,
            });
          });
        }
      } else {
        // Send existing image filenames as JSON string
        formDataToSend.append("images", JSON.stringify(formData.images));
      }

      await axiosInstance.put(`${baseURL}/cloth/editclothposts/${id}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
        transformRequest: (data) => data,
      });

      Alert.alert("Success", "Clothing post updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating cloth post:", error);
      Alert.alert("Error", error.response?.data?.message || "Error updating post");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleChange("rate", i)}>
          <Icon
            name={i <= formData.rate ? "star" : "star-border"}
            size={36}
            color={i <= formData.rate ? "#FFD700" : (isDark ? "#555" : "#ccc")}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
        <ActivityIndicator size="large" color="#9370DB" />
        <Text style={{ color: isDark ? "#fff" : "#333", marginTop: 10 }}>Loading post data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>Edit Clothing Post</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={[styles.formCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>

            {/* College Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>College</Text>
              <SearchablePicker
                label="College"
                placeholder="Select College"
                items={colleges}
                value={formData.collegeId || null}
                onChange={(val) => handleChange("collegeId", val)}
                isDark={isDark}
              />
            </View>

            {/* Gender Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Gender</Text>
              <SearchablePicker
                label="Gender"
                placeholder="Select Gender"
                items={genders}
                value={formData.genderId || null}
                onChange={(val) => handleChange("genderId", val)}
                isDark={isDark}
              />
            </View>

            {/* Category Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Category</Text>
              <SearchablePicker
                label="Category"
                placeholder={categories.length > 0 ? "Select Category" : "Select Gender First"}
                items={categories}
                value={formData.categoryId || null}
                onChange={(val) => handleChange("categoryId", val)}
                isDark={isDark}
                disabled={categories.length === 0}
              />
            </View>

            {/* Subcategory Picker */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Subcategory</Text>
              <SearchablePicker
                label="Subcategory"
                placeholder={subcategories.length > 0 ? "Select Subcategory" : "Select Category First"}
                items={subcategories}
                value={formData.subcategoryId || null}
                onChange={(val) => handleChange("subcategoryId", val)}
                isDark={isDark}
                disabled={subcategories.length === 0}
              />
            </View>

            {/* Form Fields */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Price (₹)</Text>
              <TextInput
                style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                value={formData.price}
                onChangeText={(text) => handleChange("price", text)}
                placeholder="Enter price"
                placeholderTextColor={isDark ? "#888" : "#999"}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                value={formData.description}
                onChangeText={(text) => handleChange("description", text)}
                placeholder="Enter clothing details, size, brand etc."
                placeholderTextColor={isDark ? "#888" : "#999"}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Phone Number (Optional)</Text>
              <TextInput
                style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                value={formData.phone_number}
                onChangeText={(text) => handleChange("phone_number", text)}
                placeholder="Phone number"
                placeholderTextColor={isDark ? "#888" : "#999"}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Condition Rating</Text>
              {renderStars()}
            </View>

            {/* Images */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Images</Text>
              <View style={styles.imagesContainer}>
                {formData.images.map((img, idx) => (
                  <View key={idx} style={styles.imageWrapper}>
                    <Image
                      source={{ uri: img.isNew ? img.uri : `${baseURL}/uploads/${img}` }}
                      style={styles.postImage}
                    />
                  </View>
                ))}
                <TouchableOpacity
                  style={[styles.addImageBtn, { borderColor: isDark ? "#555" : "#ccc" }]}
                  onPress={handlePickImages}
                >
                  <Icon name="add-photo-alternate" size={32} color={isDark ? "#bbb" : "#666"} />
                  <Text style={{ color: isDark ? '#bbb' : '#666', fontSize: 12, marginTop: 4 }}>Pick</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && { opacity: 0.7 }]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Update Post</Text>
              )}
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 16, paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  formCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  inputGroup: { marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },
  starsContainer: { flexDirection: 'row', gap: 8 },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  imageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postImage: { width: '100%', height: '100%' },
  addImageBtn: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  submitButton: {
    backgroundColor: '#8a2be2',
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: "#8a2be2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default EditClothPost;