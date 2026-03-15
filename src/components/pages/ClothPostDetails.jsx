import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Swiper from "react-native-swiper";
import { useStore } from '../../../src/zustand/store';


const { width } = Dimensions.get("window");

const ClothPostDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [postedTime, setPostedTime] = useState("Recently");

  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchData();
  }, [id, baseURL]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const postResponse = await axios.get(`${baseURL}/cloth/clothpostsbyid/${id}`);
      setPost(postResponse.data);

      if (postResponse.data.created_at) {
        const postDate = new Date(postResponse.data.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - postDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
          setPostedTime("Today");
        } else if (diffDays === 1) {
          setPostedTime("Yesterday");
        } else if (diffDays < 7) {
          setPostedTime(`${diffDays} days ago`);
        } else if (diffDays < 30) {
          setPostedTime(`${Math.floor(diffDays / 7)} weeks ago`);
        } else {
          setPostedTime(`${Math.floor(diffDays / 30)} months ago`);
        }
      }
    } catch (error) {
      console.error("Error fetching cloth post details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendNumber = async () => {
    if (!phoneNumber) {
      alert("Please enter your phone number.");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/sendPhoneNumbercloth`, {
        postId: post.id,
        phoneNumber,
      });
      alert("Phone number sent successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error sending phone number:", error);
      alert("Failed to send phone number.");
    }
  };

  const handleWhatsAppContact = () => {
    if (post && post.phone_number) {
      const whatsappUrl = `whatsapp://send?phone=${post.phone_number}&text=Hi, I'm interested in your clothing item listing.`;
      Linking.openURL(whatsappUrl).catch(() => {
         alert("Make sure WhatsApp is installed on your device.");
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, isDark ? styles.darkBg : styles.lightBg]}>
        <ActivityIndicator size="large" color="#7e57c2" />
        <Text style={[styles.loadingText, isDark ? styles.darkText : styles.lightText]}>Loading item details...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.centerContainer, isDark ? styles.darkBg : styles.lightBg]}>
        <Text style={[styles.errorText, isDark ? styles.darkText : styles.lightText]}>Post not found.</Text>
      </View>
    );
  }

  const imagesArray = Array.isArray(post.images)
    ? post.images
    : typeof post.images === "string"
        ? post.images.split(",")
        : [];

  return (
    <View style={[styles.container, isDark ? styles.darkBg : styles.lightBg]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Images Swiper */}
        {imagesArray.length > 0 ? (
          <View style={styles.imageContainer}>
            <Swiper 
              style={styles.wrapper} 
              showsButtons={false}
              loop={false}
              activeDotColor="#7e57c2"
              dotColor="rgba(255,255,255,0.5)"
            >
              {imagesArray.map((img, index) => (
                <View key={index} style={[styles.slide, isDark ? styles.darkSlide : styles.lightSlide]}>
                  <Image
                    source={{ uri: `${baseURL}/uploads/${img.trim()}` }}
                    style={styles.postImage}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </Swiper>
            
            {/* Overlay Price Tag */}
            <View style={styles.priceOverlay}>
              <Ionicons name="pricetag" size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.overlayPriceText}>₹{post.price || "N/A"}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.noImageContainer, isDark ? styles.darkSlide : styles.lightSlide]}>
            <Ionicons name="image-outline" size={60} color={isDark ? "#aaa" : "#ccc"} />
            <Text style={isDark ? styles.darkText : styles.lightText}>No images available</Text>
          </View>
        )}

        <View style={styles.contentPadding}>
          {/* Title & Time */}
          <View style={styles.titleSection}>
            <Text style={[styles.mainTitle, isDark ? styles.darkTitle : styles.lightTitle]}>
              {post.description}
            </Text>
            <View style={styles.timeRow}>
              <Ionicons name="time-outline" size={14} color={isDark ? "#aaa" : "#666"} />
              <Text style={[styles.timeText, isDark ? styles.darkSubText : styles.lightSubText]}>
                Posted {postedTime}
              </Text>
            </View>
          </View>

          {/* User Profile Banner */}
          <View style={[styles.profileBanner, isDark ? styles.darkCard : styles.lightCard]}>
            <View style={[styles.avatarLarge, styles.placeholderAvatar, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
              <Ionicons name="person" size={30} color={isDark ? "#aaa" : "#555"} />
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={[styles.profileName, isDark ? styles.darkText : styles.lightText]}>
                  {post.user_name}
                </Text>
                <Ionicons name="checkmark-circle" size={16} color="#2196F3" style={{ marginLeft: 4 }} />
              </View>
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={14} color={isDark ? "#aaa" : "#666"} />
                <Text style={[styles.locationText, isDark ? styles.darkSubText : styles.lightSubText]} numberOfLines={1}>
                  {post.college}
                </Text>
              </View>
            </View>
          </View>

          {/* Details Grid */}
          <View style={[styles.detailsCard, isDark ? styles.darkCard : styles.lightCard]}>
            <View style={styles.detailsGrid}>
              
              <View style={styles.gridItem}>
                <View style={styles.gridLabelRow}>
                  <Ionicons name="male-female-outline" size={16} color={isDark ? "#aaa" : "#666"} />
                  <Text style={[styles.gridLabel, isDark ? styles.darkSubText : styles.lightSubText]}>Gender</Text>
                </View>
                <Text style={[styles.gridValue, isDark ? styles.darkText : styles.lightText]}>{post.gender}</Text>
              </View>
              
              <View style={styles.gridItem}>
                <View style={styles.gridLabelRow}>
                  <Ionicons name="shirt-outline" size={16} color={isDark ? "#aaa" : "#666"} />
                  <Text style={[styles.gridLabel, isDark ? styles.darkSubText : styles.lightSubText]}>Category</Text>
                </View>
                <Text style={[styles.gridValue, isDark ? styles.darkText : styles.lightText]}>{post.category}</Text>
              </View>

              <View style={styles.gridItem}>
                <View style={styles.gridLabelRow}>
                  <Ionicons name="pricetags-outline" size={16} color={isDark ? "#aaa" : "#666"} />
                  <Text style={[styles.gridLabel, isDark ? styles.darkSubText : styles.lightSubText]}>Subcategory</Text>
                </View>
                <Text style={[styles.gridValue, isDark ? styles.darkText : styles.lightText]}>{post.subcategory}</Text>
              </View>
              
              <View style={styles.gridItem}>
                <View style={styles.gridLabelRow}>
                  <Ionicons name="star-outline" size={16} color={isDark ? "#aaa" : "#666"} />
                  <Text style={[styles.gridLabel, isDark ? styles.darkSubText : styles.lightSubText]}>Condition</Text>
                </View>
                <Text style={[styles.gridValue, isDark ? styles.darkText : styles.lightText]}>
                  {post.rate === 1 ? "Poor" :
                   post.rate === 2 ? "Fair" :
                   post.rate === 3 ? "Good" :
                   post.rate === 4 ? "Very Good" :
                   post.rate === 5 ? "Excellent" : "N/A"}
                </Text>
              </View>

            </View>

            <View style={styles.divider} />

            <View style={styles.descriptionSection}>
              <View style={styles.gridLabelRow}>
                <Ionicons name="information-circle-outline" size={16} color={isDark ? "#aaa" : "#666"} />
                <Text style={[styles.gridLabel, isDark ? styles.darkSubText : styles.lightSubText]}>Description</Text>
              </View>
              <Text style={[styles.descriptionText, isDark ? styles.darkText : styles.lightText]}>
                {post.description || "No description provided."}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.contactInfo}>
              <View style={styles.gridLabelRow}>
                <Ionicons name="call-outline" size={16} color={isDark ? "#aaa" : "#666"} />
                <Text style={[styles.gridLabel, isDark ? styles.darkSubText : styles.lightSubText]}>Contact</Text>
              </View>
              <Text style={[styles.contactText, isDark ? styles.darkText : styles.lightText]}>
                {post.phone_number && post.phone_number !== "null" && post.phone_number.trim() !== ""
                  ? post.phone_number
                  : 'Click "Contact Owner" to send your number.'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Bottom padding to scroll past the fixed footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Action Footer */}
      <View style={[styles.footer, isDark ? styles.darkFooter : styles.lightFooter]}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.primaryButton]}
          onPress={() => setShowModal(true)}
        >
          <Ionicons name="mail-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Contact Owner</Text>
        </TouchableOpacity>

        {post.phone_number && post.phone_number !== "null" && post.phone_number.trim() !== "" && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.whatsappButton]}
            onPress={handleWhatsAppContact}
          >
            <Ionicons name="logo-whatsapp" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonText}>WhatsApp</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Contact Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDark ? styles.darkCard : styles.lightCard]}>
            <Text style={[styles.modalTitle, isDark ? styles.darkText : styles.lightText]}>Enter Your Phone Number</Text>
            <Text style={[styles.modalSubtitle, isDark ? styles.darkSubText : styles.lightSubText]}>
              The owner will be notified to contact you.
            </Text>
            
            <TextInput
              style={[styles.input, isDark ? styles.darkInput : styles.lightInput, isDark ? styles.darkText : styles.lightText]}
              placeholder="Phone number"
              placeholderTextColor={isDark ? "#888" : "#999"}
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.sendButton]} 
                onPress={handleSendNumber}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lightBg: { backgroundColor: "#f5f7fa" },
  darkBg: { backgroundColor: "#121212" },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  imageContainer: {
    height: 350,
    width: "100%",
    position: "relative",
  },
  wrapper: {},
  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lightSlide: { backgroundColor: "#e9ecef" },
  darkSlide: { backgroundColor: "#1e1e1e" },
  postImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  priceOverlay: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(126, 87, 194, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 5,
  },
  overlayPriceText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  contentPadding: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  lightTitle: { color: "#2d1b69" },
  darkTitle: { color: "#b39ddb" },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    marginLeft: 6,
    fontSize: 14,
  },
  profileBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
  },
  lightCard: {
    backgroundColor: "#fff",
    borderColor: "#e3f2fd",
    borderWidth: 1,
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
    borderColor: "#333",
    borderWidth: 1,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  placeholderAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  lightPlaceholder: { backgroundColor: "#e0e0e0" },
  darkPlaceholder: { backgroundColor: "#4a5568" },
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
  },
  detailsCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
  gridLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  gridLabel: {
    marginLeft: 6,
    fontSize: 14,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  lightText: { color: "#333" },
  darkText: { color: "#fff" },
  lightSubText: { color: "#666" },
  darkSubText: { color: "#aaa" },
  divider: {
    height: 1,
    backgroundColor: "rgba(150,150,150,0.2)",
    marginVertical: 16,
  },
  descriptionSection: {},
  descriptionText: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  contactInfo: {},
  contactText: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    padding: 16,
    elevation: 10,
    borderTopWidth: 1,
  },
  lightFooter: {
    backgroundColor: "#fff",
    borderTopColor: "#eee",
  },
  darkFooter: {
    backgroundColor: "#1e1e1e",
    borderTopColor: "#333",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: "#7e57c2",
  },
  whatsappButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    padding: 24,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
  },
  lightInput: {
    borderColor: "#ccc",
    backgroundColor: "#fafafa",
  },
  darkInput: {
    borderColor: "#555",
    backgroundColor: "#2a2a2a",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    color: "#7e57c2",
    fontSize: 16,
    fontWeight: "bold",
  },
  sendButton: {
    backgroundColor: "#7e57c2",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClothPostDetails;




