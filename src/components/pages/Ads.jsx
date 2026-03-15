import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useStore } from '../../../src/zustand/store';



const AdminAdsManager = () => {
  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [mediaType, setMediaType] = useState("image");
  const [mediaFile, setMediaFile] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState("");

  // Dropdown States
  const [openMediaType, setOpenMediaType] = useState(false);
  const [mediaTypesItems, setMediaTypesItems] = useState([
    { label: "Image", value: "image" },
    { label: "Video", value: "video" },
  ]);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/getads`);
      setAds(res.data);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      // Alert.alert("Error", "Could not load ads.");
    } finally {
      setLoading(false);
    }
  };

  const handlePickMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "Sorry, we need media library permissions to make this work!");
      return;
    }

    const options = {
      mediaTypes: mediaType === "image" ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: mediaType === "image",
      quality: 0.8,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setMediaFile({
        uri: asset.uri,
        name: asset.fileName || `${mediaType}_${Date.now()}.${mediaType === 'image' ? 'jpg' : 'mp4'}`,
        type: asset.mimeType || (mediaType === "image" ? "image/jpeg" : "video/mp4"),
      });
    }
  };

  const handleAddAd = async () => {
    if (!mediaFile || !redirectUrl.trim()) {
      Alert.alert("Validation", "Please provide a media file and a redirect URL.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("media", {
      uri: mediaFile.uri,
      name: mediaFile.name,
      type: mediaFile.type,
    });
    formData.append("media_type", mediaType);
    formData.append("redirect_url", redirectUrl);

    try {
      await axios.post(`${baseURL}/api/uploadads`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Alert.alert("Success", "Ad uploaded successfully");
      setMediaFile(null);
      setRedirectUrl("");
      fetchAds();
    } catch (err) {
      console.error("Error adding ad:", err);
      Alert.alert("Error", "Failed to add ad.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAd = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this ad?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${baseURL}/api/removeads/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              fetchAds();
            } catch (err) {
              console.error("Error deleting ad:", err);
              Alert.alert("Error", "Failed to delete ad.");
            }
          },
        },
      ]
    );
  };

  const renderAdItem = ({ item }) => (
    <View style={[styles.adCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>
      {item.media_type === "image" ? (
        <Image 
          source={{ uri: `${baseURL}/uploads/${item.media_url}` }} 
          style={styles.adMediaImage} 
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.adMediaVideo, { backgroundColor: isDark ? "#2a2a3a" : "#eee" }]}>
          <Icon name="play-circle-outline" size={60} color={isDark ? "#bbb" : "#666"} />
          <Text style={{ color: isDark ? "#bbb" : "#666", marginTop: 10 }}>Video Ad</Text>
        </View>
      )}
      <View style={styles.adDetails}>
        <Text style={[styles.adUrlText, { color: isDark ? "#ccc" : "#555" }]} numberOfLines={2}>
          URL: {item.redirect_url}
        </Text>
        <TouchableOpacity 
          style={styles.deleteBtn}
          onPress={() => handleDeleteAd(item.id)}
        >
          <Icon name="delete" size={20} color="#fff" />
          <Text style={styles.deleteBtnText}>Delete</Text>
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
        <Text style={[styles.headerTitle, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>Admin Ad Manager</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={ads}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAdItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            <View style={[styles.formCard, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "#e0e0e0" }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}>Add New Advertisement</Text>

              <View style={{ zIndex: 3000, marginBottom: 16 }}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Media Type</Text>
                <DropDownPicker
                  open={openMediaType}
                  value={mediaType}
                  items={mediaTypesItems}
                  setOpen={setOpenMediaType}
                  setValue={setMediaType}
                  setItems={setMediaTypesItems}
                  style={[styles.dropdown, { backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                  textStyle={{ color: isDark ? "#fff" : "#333" }}
                  dropDownContainerStyle={{ backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }}
                  zIndex={3000}
                  zIndexInverse={1000}
                />
              </View>

              <View style={[styles.inputGroup, { zIndex: 1000 }]}>
                 <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Media File</Text>
                 <TouchableOpacity 
                    style={[styles.uploadBtn, { borderColor: isDark ? "#555" : "#ccc", backgroundColor: isDark ? "#2d2d3d" : "#fafafa" }]}
                    onPress={handlePickMedia}
                 >
                    <Icon name={mediaType === "image" ? "image" : "videocam"} size={32} color={isDark ? "#bbb" : "#666"} />
                    <Text style={[styles.uploadBtnText, { color: isDark ? "#bbb" : "#666" }]}>
                       {mediaFile ? mediaFile.name : `Select ${mediaType === 'image' ? 'Image' : 'Video'}`}
                    </Text>
                 </TouchableOpacity>
              </View>

              <View style={[styles.inputGroup, { zIndex: 1000 }]}>
                <Text style={[styles.label, { color: isDark ? "#ccc" : "#555" }]}>Redirect URL</Text>
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", backgroundColor: isDark ? "#2d2d3d" : "#fafafa", borderColor: isDark ? "#444" : "#ddd" }]}
                  value={redirectUrl}
                  onChangeText={setRedirectUrl}
                  placeholder="https://example.com"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>

              <TouchableOpacity 
                style={[styles.submitButton, submitting && { opacity: 0.7 }]}
                onPress={handleAddAd}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Upload Advertisement</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.adsHeader}>
               <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333", marginBottom: 0 }]}>All Ads</Text>
               {loading && <ActivityIndicator size="small" color="#6A1B9A" />}
            </View>
          </>
        }
        ListEmptyComponent={
          !loading ? (
             <View style={styles.emptyContainer}>
                <Text style={{ color: isDark ? '#ccc' : '#666' }}>No ads found.</Text>
             </View>
          ) : null
        }
      />
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
  listContent: { padding: 16, paddingBottom: 40 },
  formCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  dropdown: { borderRadius: 12, borderWidth: 1, minHeight: 50 },
  inputGroup: { marginBottom: 16 },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
  uploadBtn: {
    borderWidth: 1, borderStyle: 'dashed', borderRadius: 12,
    padding: 20, alignItems: 'center', justifyContent: 'center'
  },
  uploadBtnText: { marginTop: 10, fontSize: 14, textAlign: 'center' },
  submitButton: {
    backgroundColor: '#6A1B9A',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  adsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  adCard: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  adMediaImage: { width: '100%', height: 200 },
  adMediaVideo: { width: '100%', height: 200, alignItems: 'center', justifyContent: 'center' },
  adDetails: { padding: 12 },
  adUrlText: { fontSize: 14, marginBottom: 12 },
  deleteBtn: {
    backgroundColor: '#F44336',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  deleteBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
});

export default AdminAdsManager;




