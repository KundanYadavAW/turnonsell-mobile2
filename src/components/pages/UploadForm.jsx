import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import { useStore } from "";

const UploadForm = () => {
  const [collegeId, setCollegeId] = useState(null);
  const [degreeId, setDegreeId] = useState(null);
  const [year, setYear] = useState(null);
  const [images, setImages] = useState([]);
  
  const [colleges, setColleges] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [years, setYears] = useState([]);

  // Picker Open States
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [degreeOpen, setDegreeOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");
  const [book_name, setBook_name] = useState("");
  const [phone_number, setPhone_number] = useState("");
  const [rating, setRating] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [collegesRes, degreesRes, yearsRes] = await Promise.all([
        axios.get(`${baseURL}/dropdown/colleges`),
        axios.get(`${baseURL}/dropdown/degrees`),
        axios.get(`${baseURL}/dropdown/years`),
      ]);

      setColleges(collegesRes.data.map(c => ({ label: c.name, value: c.id })));
      setDegrees(degreesRes.data.map(d => ({ label: d.name, value: d.id })));
      setYears(yearsRes.data.map(y => ({ label: y.year_name, value: y.year_name })));
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
      Alert.alert("Error", "Failed to load dropdown data");
    }
  };

  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true, // Requires Expo SDK 46+
        quality: 0.8,
      });

      if (!result.canceled) {
        // If multiple selection is allowed, result.assets is an array
        if (result.assets) {
             const newImages = result.assets.map(asset => ({
                 uri: asset.uri,
                 type: asset.mimeType || 'image/jpeg',
                 name: asset.uri.split('/').pop() || 'image.jpg',
             }));
             setImages([...images, ...newImages]);
        }
      }
    } catch (error) {
       console.error("Error picking image:", error);
       Alert.alert("Error", "Failed to pick image");
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async () => {
    if (!collegeId || !degreeId || !year || images.length === 0 || !book_name || !price || !message) {
      Alert.alert("Validation Error", "All fields marked with * are required, including at least one image.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("college_id", collegeId);
    formData.append("degree_id", degreeId);
    formData.append("year", year);
    formData.append("price", price);
    formData.append("book_name", book_name);
    formData.append("message", message);
    if (phone_number) formData.append("phone_number", phone_number);
    formData.append("rate", rating);
    
    images.forEach((img) => {
      formData.append("image", {
        uri: Platform.OS === 'android' ? img.uri : img.uri.replace('file://', ''),
        type: img.type,
        name: img.name,
      });
    });

    try {
      const response = await axios.post(`${baseURL}/api/post`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        },
      });

      Alert.alert("Success", response.data.message || "Book listed successfully!");
      navigation.goBack(); 
    } catch (error) {
      const errorMsg = error.response ? error.response.data.message : error.message;
      Alert.alert("Error", `Failed to create listing: ${errorMsg}`);
      console.error("Error submitting post:", error.response ? error.response.data : error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color={star <= rating ? "#FFD700" : (isDark ? "#555" : "#ccc")}
            />
          </TouchableOpacity>
        ))}
        <Text style={[styles.ratingText, isDark ? styles.darkText : styles.lightText]}>
              {rating === 0 ? "Select rating" :
                rating === 1 ? "Poor" :
                rating === 2 ? "Fair" :
                rating === 3 ? "Good" :
                rating === 4 ? "Very Good" : "Excellent"}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <ScrollView 
            style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
        >
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
            Create Book Listing
            </Text>
            <View style={{ width: 24 }} />
        </View>

        <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
            
            <Text style={styles.sectionTitle}>Educational Information</Text>

            <View style={[styles.inputGroup, { zIndex: 3000 }]}>
                 <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>College *</Text>
                 <DropDownPicker
                    open={collegeOpen}
                    value={collegeId}
                    items={colleges}
                    setOpen={setCollegeOpen}
                    setValue={setCollegeId}
                    setItems={setColleges}
                    placeholder="Select your college"
                    style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
                    textStyle={isDark ? styles.darkText : styles.lightText}
                    dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
                    searchable={true}
                    searchPlaceholder="Search..."
                    listMode="MODAL"
                    modalProps={{ animationType: "slide" }}
                    theme={isDark ? "DARK" : "LIGHT"}
                    zIndex={3000}
                    zIndexInverse={1000}
                />
            </View>

            <View style={[styles.inputGroup, { zIndex: 2000 }]}>
                 <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Degree *</Text>
                 <DropDownPicker
                    open={degreeOpen}
                    value={degreeId}
                    items={degrees}
                    setOpen={setDegreeOpen}
                    setValue={setDegreeId}
                    setItems={setDegrees}
                    placeholder="Select your degree"
                    style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
                    textStyle={isDark ? styles.darkText : styles.lightText}
                    dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
                    searchable={true}
                    searchPlaceholder="Search..."
                    listMode="MODAL"
                    modalProps={{ animationType: "slide" }}
                    theme={isDark ? "DARK" : "LIGHT"}
                    zIndex={2000}
                    zIndexInverse={2000}
                />
            </View>

            <View style={[styles.inputGroup, { zIndex: 1000 }]}>
                 <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Year *</Text>
                 <DropDownPicker
                    open={yearOpen}
                    value={year}
                    items={years}
                    setOpen={setYearOpen}
                    setValue={setYear}
                    setItems={setYears}
                    placeholder="Select academic year"
                    style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
                    textStyle={isDark ? styles.darkText : styles.lightText}
                    dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
                    listMode="MODAL"
                    modalProps={{ animationType: "slide" }}
                    theme={isDark ? "DARK" : "LIGHT"}
                    zIndex={1000}
                    zIndexInverse={3000}
                />
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Book Information</Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Book Name *</Text>
                <TextInput
                    style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
                    placeholder="Enter book name"
                    placeholderTextColor={isDark ? "#aaa" : "#888"}
                    value={book_name}
                    onChangeText={setBook_name}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Price (₹) *</Text>
                <TextInput
                    style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
                    placeholder="Enter price"
                    placeholderTextColor={isDark ? "#aaa" : "#888"}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Phone Number (Optional)</Text>
                <TextInput
                    style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
                    placeholder="Enter phone number"
                    placeholderTextColor={isDark ? "#aaa" : "#888"}
                    value={phone_number}
                    onChangeText={(text) => setPhone_number(text.replace(/[^0-9]/g, '').slice(0, 10))}
                    keyboardType="phone-pad"
                    maxLength={10}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Book Condition</Text>
                {renderStars()}
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Book Description *</Text>
                <TextInput
                    style={[styles.textArea, isDark ? styles.darkInput : styles.lightInput]}
                    placeholder="Describe the book condition, edition, etc."
                    placeholderTextColor={isDark ? "#aaa" : "#888"}
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </View>

            <View style={styles.inputGroup}>
                 <Text style={[styles.label, isDark ? styles.darkText : styles.lightText]}>Book Images *</Text>
                 <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                     <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
                     <Text style={styles.uploadButtonText}>Select Images</Text>
                 </TouchableOpacity>

                 {images.length > 0 && (
                     <View style={styles.imagePreviewContainer}>
                         {images.map((img, index) => (
                             <View key={index} style={styles.imageWrapper}>
                                 <Image source={{ uri: img.uri }} style={styles.previewImage} />
                                 <TouchableOpacity 
                                    style={styles.removeImageButton}
                                    onPress={() => removeImage(index)}
                                 >
                                     <Ionicons name="close-circle" size={24} color="red" />
                                 </TouchableOpacity>
                             </View>
                         ))}
                     </View>
                 )}
            </View>

            <TouchableOpacity 
                style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.submitButtonText}>Submit Listing</Text>
                )}
            </TouchableOpacity>

        </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoid: {
      flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  lightContainer: {
    backgroundColor: "#F7F3FF",
  },
  darkContainer: {
    backgroundColor: "#1A1625",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  card: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  lightCard: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  darkCard: {
    backgroundColor: "#2d3748",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6c757d",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  lightText: {
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
  },
  textArea: {
      borderRadius: 8,
      borderWidth: 1,
      paddingHorizontal: 12,
      paddingVertical: 12,
      minHeight: 100,
      fontSize: 16,
  },
  lightInput: {
    backgroundColor: "#fff",
    borderColor: "#ced4da",
    color: "#000",
  },
  darkInput: {
    backgroundColor: "#4a5568",
    borderColor: "#4a5568",
    color: "#fff",
  },
  dropdown: {
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 48,
  },
  lightDropdown: {
    backgroundColor: "#fff",
    borderColor: "#ced4da",
  },
  darkDropdown: {
    backgroundColor: "#4a5568",
    borderColor: "#4a5568",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
  },
  lightDropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#ced4da",
  },
  darkDropdownContainer: {
    backgroundColor: "#4a5568",
    borderColor: "#4a5568",
  },
  starsContainer: {
      flexDirection: "row",
      alignItems: "center",
  },
  ratingText: {
      marginLeft: 12,
      fontSize: 14,
  },
  uploadButton: {
      backgroundColor: "#28a745",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
      borderRadius: 8,
  },
  uploadButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
      marginLeft: 8,
  },
  imagePreviewContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 12,
  },
  imageWrapper: {
      position: "relative",
      marginRight: 8,
      marginBottom: 8,
  },
  previewImage: {
      width: 80,
      height: 80,
      borderRadius: 8,
  },
  removeImageButton: {
      position: "absolute",
      top: -8,
      right: -8,
      backgroundColor: "white",
      borderRadius: 12,
  },
  submitButton: {
      backgroundColor: "#8A63D2", // Primary Purple
      padding: 16,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 24,
  },
  submitButtonDisabled: {
      backgroundColor: "#b39cdb",
  },
  submitButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
  }
});

export default UploadForm;




