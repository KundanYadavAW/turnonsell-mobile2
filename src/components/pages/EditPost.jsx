import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, 
  SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, 
  ActivityIndicator, Image 
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { useStore } from '../../../src/zustand/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';



const EditPost = () => {
  const route = useRoute();
  const { id:postId } = route.params || {};
  
  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const currentUser = useStore((state) => state.userId);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [postOwnerId, setPostOwnerId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    college_id: "",
    degree_id: "",
    year: "",
    book_name: "",
    price: "",
    message: "",
    phone_number: "",
    rate: 0,
    images: [] // existing images or newly picked images
  });

  // Dropdown States
  const [colleges, setColleges] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [years, setYears] = useState([]);

  // Dropdown Picker States
  const [openCollege, setOpenCollege] = useState(false);
  const [openDegree, setOpenDegree] = useState(false);
  const [openYear, setOpenYear] = useState(false);

  useEffect(() => {
    fetchDropdowns();
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchDropdowns = async () => {
    try {
      const [colRes, degRes, yearRes] = await Promise.all([
        axios.get(`${baseURL}/dropdown/colleges`),
        axios.get(`${baseURL}/dropdown/degrees`),
        axios.get(`${baseURL}/dropdown/years`)
      ]);
      
      setColleges(colRes.data.map(c => ({ label: c.name, value: c.id })));
      setDegrees(degRes.data.map(d => ({ label: d.name, value: d.id })));
      setYears(yearRes.data.map(y => ({ label: y.year_name, value: y.year_name })));
    } catch (error) {
      console.error("Error fetching dropdowns", error);
    }
  };

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/post/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      const post = response.data;
      setPostOwnerId(post.UserId);

      // Redirect if not the owner
      if (parseInt(post.UserId) !== parseInt(currentUser)) {
        Alert.alert("Unauthorized", "You are not authorized to edit this post");
        navigation.goBack();
        return;
      }

      setFormData({
        college_id: post.college_id,
        degree_id: post.degree_id,
        year: post.year,
        book_name: post.book_name,
        price: post.price ? post.price.toString() : "",
        message: post.message,
        phone_number: post.phone_number,
        rate: post.rate || 0,
        images: Array.isArray(post.images) ? post.images : (typeof post.images === 'string' ? JSON.parse(post.images) : [])
      });
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      Alert.alert("Error", "Could not load post data.");
      navigation.goBack();
    }
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload images.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      // Create file objects for new images
      const newImages = result.assets.map(asset => ({
        uri: asset.uri,
        name: asset.fileName || `post_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
        type: asset.mimeType || 'image/jpeg',
        isNew: true
      }));

      // In this simple implementation, mixing old and new is complex for the backend if it expects either entirely new files or old strings. 
      // Based on original logic, if array of files is sent, it appends them. 
      // Let's replace images completely if they pick new ones to make it simple and match common behavior.
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  const validateForm = () => {
    if (!formData.college_id) return "College is required.";
    if (!formData.degree_id) return "Degree is required.";
    if (!formData.year) return "Year is required.";
    if (!formData.book_name?.trim()) return "Book name is required.";
    if (!formData.price?.trim()) return "Price is required.";
    if (!formData.message?.trim()) return "Message is required.";
    if (!formData.rate) return "Rate is required.";
    return null;
  };

  const handleSubmit = async () => {
    const errorMsg = validateForm();
    if (errorMsg) {
      Alert.alert("Validation Error", errorMsg);
      return;
    }

    setSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("college_id", formData.college_id);
    formDataToSend.append("degree_id", formData.degree_id);
    formDataToSend.append("year", formData.year);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("book_name", formData.book_name);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("phone_number", formData.phone_number);
    formDataToSend.append("rate", formData.rate.toString());

    // Original logic check
    const hasNewImages = formData.images.length > 0 && formData.images[0].isNew;
    if (hasNewImages) {
      formData.images.forEach((img) => {
        formDataToSend.append("images", {
          uri: img.uri,
          name: img.name,
          type: img.type
        });
      });
    } else {
      // Send existing string JSON
      formDataToSend.append("images", JSON.stringify(formData.images));
    }

    try {
      await axios.put(`${baseURL}/api/update-post/${postId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      Alert.alert("Success", "Post updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating post:", error);
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
            <Text style={[styles.headerTitle, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>Edit Book Post</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={[styles.formCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>
            
            {/* Dropdowns */}
            <View style={{ zIndex: 3000, marginBottom: 16 }}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>College</Text>
              <DropDownPicker
                open={openCollege}
                value={formData.college_id}
                items={colleges}
                setOpen={setOpenCollege}
                setValue={(val) => handleChange("college_id", val())}
                style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                textStyle={{ color: isDark ? "#fff" : "#333" }}
                dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
                zIndex={3000}
                zIndexInverse={1000}
                listMode="SCROLLVIEW"
                searchable={true}
                placeholder="Select College"
              />
            </View>

            <View style={{ zIndex: 2000, marginBottom: 16 }}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Degree</Text>
              <DropDownPicker
                open={openDegree}
                value={formData.degree_id}
                items={degrees}
                setOpen={setOpenDegree}
                setValue={(val) => handleChange("degree_id", val())}
                style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                textStyle={{ color: isDark ? "#fff" : "#333" }}
                dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
                zIndex={2000}
                zIndexInverse={2000}
                listMode="SCROLLVIEW"
                searchable={true}
                placeholder="Select Degree"
              />
            </View>

            <View style={{ zIndex: 1000, marginBottom: 16 }}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Year</Text>
              <DropDownPicker
                open={openYear}
                value={formData.year}
                items={years}
                setOpen={setOpenYear}
                setValue={(val) => handleChange("year", val())}
                style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                textStyle={{ color: isDark ? "#fff" : "#333" }}
                dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
                zIndex={1000}
                zIndexInverse={3000}
                listMode="SCROLLVIEW"
                placeholder="Select Year"
              />
            </View>

            {/* Form Fields */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Book Name</Text>
              <TextInput
                style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                value={formData.book_name}
                onChangeText={(text) => handleChange("book_name", text)}
                placeholder="Enter book name"
                placeholderTextColor={isDark ? "#888" : "#999"}
              />
            </View>

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
              <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Message / Description</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                value={formData.message}
                onChangeText={(text) => handleChange("message", text)}
                placeholder="Enter item details"
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
                <TouchableOpacity style={[styles.addImageBtn, { borderColor: isDark ? "#555" : "#ccc" }]} onPress={handlePickImages}>
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
  dropdown: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 50,
  },
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
    width: 80, height: 80, borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#ddd'
  },
  postImage: { width: '100%', height: '100%' },
  addImageBtn: {
    width: 80, height: 80, borderRadius: 8, borderWidth: 2, borderStyle: 'dashed',
    alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent'
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
  submitButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default EditPost;




