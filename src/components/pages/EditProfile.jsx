import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useStore } from '../../../src/zustand/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';



const EditProfile = () => {
  const [name, setName] = useState("");
  const [picture, setPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchUserProfile();
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to upload an image.');
      }
    }
  };

  const fetchUserProfile = async () => {
    setFetching(true);
    try {
      const response = await axios.get(`${baseURL}/api/my-posts`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = response.data;
      
      if (response.status === 200) {
        setName(data.user.name || "");
        if (data.user.picture) {
          setPreview(data.user.picture.startsWith('http') ? data.user.picture : `${baseURL}/uploads/${data.user.picture}`);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setFetching(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setPreview(selectedAsset.uri);
      
      // Keep track of the file to upload
      setPicture({
        uri: selectedAsset.uri,
        name: selectedAsset.fileName || `profile_${Date.now()}.jpg`,
        type: selectedAsset.mimeType || 'image/jpeg',
      });
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    
    if (picture) {
      formData.append("picture", {
        uri: picture.uri,
        name: picture.name,
        type: picture.type
      });
    }

    try {
      const response = await axios.put(`${baseURL}/api/updateProfile`, formData, {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert("Success", response.data.message || "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
        <ActivityIndicator size="large" color="#9370DB" />
        <Text style={{ color: isDark ? "#fff" : "#333", marginTop: 10 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "rgba(138,43,226,0.1)" }]}>
            
            <View style={styles.header}>
              <Text style={[styles.title, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>Edit Profile</Text>
              <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#666" }]}>
                Update your personal information
              </Text>
            </View>

            <View style={styles.avatarSection}>
              <View style={styles.avatarWrapper}>
                {preview ? (
                  <Image source={{ uri: preview }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.placeholderAvatar, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
                    <Icon name="person" size={60} color={isDark ? '#666' : '#ccc'} />
                  </View>
                )}
                <TouchableOpacity style={styles.editAvatarBtn} onPress={pickImage}>
                  <Icon name="camera-alt" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.avatarHint, { color: isDark ? "#888" : "#999" }]}>Tap the camera icon to change your picture</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Icon name="person" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                  placeholder="Full Name"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Update Profile</Text>
                    <Icon name="save" size={20} color="#fff" style={{ marginLeft: 8 }} />
                  </>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#9370DB',
  },
  placeholderAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8a2be2',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarHint: {
    fontSize: 12,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderBottomWidth: 1.5,
    paddingLeft: 40,
    paddingRight: 10,
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#8a2be2',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: "#8a2be2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default EditProfile;




