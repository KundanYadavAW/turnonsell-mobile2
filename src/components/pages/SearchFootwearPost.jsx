import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  SafeAreaView
} from "react-native";
import axios from "axios";
import { useStore } from "";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

import { useStore } from "";

const { width } = Dimensions.get("window");

const SearchFootwearPost = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dropdown states
  const [colleges, setColleges] = useState([]);
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Picker Open States
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [subcategoryOpen, setSubcategoryOpen] = useState(false);

  // Selected Values
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();
  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchInitialDropdowns();
    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCollege, selectedGender, selectedCategory, selectedSubcategory, posts]);

  // When Gender changes, fetch dependent Categories
  useEffect(() => {
    if (selectedGender) {
      fetchCategories(selectedGender);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setSubcategories([]);
    } else {
      setCategories([]);
      setSubcategories([]);
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    }
  }, [selectedGender]);

  // When Category changes, fetch dependent Subcategories
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories(selectedCategory);
      setSelectedSubcategory(null);
    } else {
      setSubcategories([]);
      setSelectedSubcategory(null);
    }
  }, [selectedCategory]);

  const fetchInitialDropdowns = async () => {
    try {
      const [collegesRes, gendersRes] = await Promise.all([
        axios.get(`${baseURL}/dropdown/colleges`),
        axios.get(`${baseURL}/dropdown/genders`),
      ]);

      setColleges(collegesRes.data.map(c => ({ label: c.name, value: c.name })));
      setGenders(gendersRes.data.map(g => ({ label: g.name, value: g.id }))); 
    } catch (err) {
      console.error("Error fetching initial dropdowns:", err);
    }
  };

  const fetchCategories = async (genderId) => {
    try {
      const response = await axios.get(`${baseURL}/dropdown/categories/${genderId}`);
      setCategories(response.data.map(c => ({ label: c.name, value: c.id })));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${baseURL}/dropdown/subcategories/${categoryId}`);
      setSubcategories(response.data.map(s => ({ label: s.name, value: s.name }))); 
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/footwear/footwearposts`);
      
      // Parse images if they come as strings
      const parsedData = response.data.map(post => ({
          ...post,
          images: typeof post.images === 'string' ? JSON.parse(post.images) : post.images
      }));

      // Shuffle posts
      const shuffled = parsedData.sort(() => Math.random() - 0.5).slice(0, 100);
      setPosts(shuffled);
      setFilteredPosts(shuffled);
    } catch (err) {
      setError("Failed to load footwear posts");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = posts;

    if (selectedCollege) {
      filtered = filtered.filter(p => p.college === selectedCollege);
    }
    if (selectedGender) {
      // Find gender name
      const genderName = genders.find(g => g.value === selectedGender)?.label;
      if (genderName) {
         filtered = filtered.filter(p => p.gender === genderName);
      }
    }
    if (selectedCategory) {
      const categoryName = categories.find(c => c.value === selectedCategory)?.label;
      if (categoryName) {
         filtered = filtered.filter(p => p.category === categoryName);
      }
    }
    if (selectedSubcategory) {
      filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
    }

    setFilteredPosts(filtered.slice(0, 100));
  };

  const clearFilters = () => {
    setSelectedCollege(null);
    setSelectedGender(null);
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  const renderItem = ({ item }) => {
    const profilePic = item.picture
      ? item.picture.startsWith("http")
        ? item.picture
        : `${baseURL}/uploads/${item.picture}`
      : null;

    const postImage = item.images && item.images.length > 0
      ? `${baseURL}/uploads/${item.images[0]}`
      : null;

    return (
      <TouchableOpacity
        style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        onPress={() => navigation.navigate("FootwearPostDetails", { id: item.id })}
      >
        <View style={styles.cardHeader}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
              <Ionicons name="person" size={16} color={isDark ? "#aaa" : "#555"} />
            </View>
          )}
          <Text style={[styles.userName, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
            {item.user_name}
          </Text>
        </View>

        <View style={styles.imageContainer}>
          {postImage ? (
            <Image source={{ uri: postImage }} style={styles.postImage} />
          ) : (
            <View style={[styles.postImage, styles.placeholderImage, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
              <Ionicons name="walk-outline" size={40} color={isDark ? "#aaa" : "#555"} />
            </View>
          )}
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]} numberOfLines={1}>
            {item.subcategory}
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={14} color={isDark ? "#aaa" : "#666"} />
            <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
              {item.category} • {item.gender}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="resize-outline" size={14} color={isDark ? "#aaa" : "#666"} />
            <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
               Size: {item.size}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={isDark ? "#aaa" : "#666"} />
            <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
              {item.college || "Not specified"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const hasFilters = selectedCollege || selectedGender || selectedCategory || selectedSubcategory;

  const onGenderOpen = () => {
    setGenderOpen(true);
    setCollegeOpen(false);
    setCategoryOpen(false);
    setSubcategoryOpen(false);
  };

  const onCollegeOpen = () => {
    setCollegeOpen(true);
    setGenderOpen(false);
    setCategoryOpen(false);
    setSubcategoryOpen(false);
  };

  const onCategoryOpen = () => {
    setCategoryOpen(true);
    setCollegeOpen(false);
    setGenderOpen(false);
    setSubcategoryOpen(false);
  };

  const onSubcategoryOpen = () => {
    setSubcategoryOpen(true);
    setCollegeOpen(false);
    setGenderOpen(false);
    setCategoryOpen(false);
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
          Find Footwear
        </Text>
        {hasFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters Section */}
      <View style={[styles.filtersContainer, { zIndex: 1000 }]}>
        <View style={[styles.dropdownRowSides, { zIndex: 4000 }]}>
          <View style={[styles.halfDropdownWrapper, { zIndex: 4000 }]}>
            <DropDownPicker
              open={collegeOpen}
              value={selectedCollege}
              items={colleges}
              setOpen={onCollegeOpen}
              setValue={setSelectedCollege}
              setItems={setColleges}
              placeholder="College"
              style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
              textStyle={isDark ? styles.darkText : styles.lightText}
              dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
              zIndex={4000}
              zIndexInverse={1000}
              searchable={true}
              searchPlaceholder="Search..."
              listMode="SCROLLVIEW"
              theme={isDark ? "DARK" : "LIGHT"}
            />
          </View>
          <View style={[styles.halfDropdownWrapper, { zIndex: 3000 }]}>
            <DropDownPicker
              open={genderOpen}
              value={selectedGender}
              items={genders}
              setOpen={onGenderOpen}
              setValue={setSelectedGender}
              setItems={setGenders}
              placeholder="Gender"
              style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
              textStyle={isDark ? styles.darkText : styles.lightText}
              dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
              zIndex={3000}
              zIndexInverse={2000}
              listMode="SCROLLVIEW"
              theme={isDark ? "DARK" : "LIGHT"}
            />
          </View>
        </View>

        <View style={[styles.dropdownRowSides, { zIndex: 2000 }]}>
          <View style={[styles.halfDropdownWrapper, { zIndex: 2000 }]}>
            <DropDownPicker
              open={categoryOpen}
              value={selectedCategory}
              items={categories}
              setOpen={onCategoryOpen}
              setValue={setSelectedCategory}
              setItems={setCategories}
              placeholder={selectedGender ? "Category" : "Select Gender First"}
              disabled={!selectedGender}
              style={[
                styles.dropdown, 
                isDark ? styles.darkDropdown : styles.lightDropdown,
                !selectedGender && { opacity: 0.6 }
              ]}
              textStyle={isDark ? styles.darkText : styles.lightText}
              dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
              zIndex={2000}
              zIndexInverse={3000}
              listMode="SCROLLVIEW"
              theme={isDark ? "DARK" : "LIGHT"}
            />
          </View>
          <View style={[styles.halfDropdownWrapper, { zIndex: 1000 }]}>
            <DropDownPicker
              open={subcategoryOpen}
              value={selectedSubcategory}
              items={subcategories}
              setOpen={onSubcategoryOpen}
              setValue={setSelectedSubcategory}
              setItems={setSubcategories}
              placeholder={selectedCategory ? "Subcategory" : "Select Category First"}
              disabled={!selectedCategory}
              style={[
                styles.dropdown, 
                isDark ? styles.darkDropdown : styles.lightDropdown,
                !selectedCategory && { opacity: 0.6 }
              ]}
              textStyle={isDark ? styles.darkText : styles.lightText}
              dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
              zIndex={1000}
              zIndexInverse={4000}
              listMode="SCROLLVIEW"
              theme={isDark ? "DARK" : "LIGHT"}
            />
          </View>
        </View>
      </View>

      {/* Results Section */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, isDark ? styles.darkText : styles.lightText]}>
          {filteredPosts.length} Results
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="walk-outline" size={64} color={isDark ? "#555" : "#ccc"} />
          <Text style={[styles.noResultsText, isDark ? styles.darkText : styles.lightText]}>
            No footwear found
          </Text>
          <Text style={styles.noResultsSub}>
            Try adjusting your filters
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#f5f7fa",
  },
  darkContainer: {
    backgroundColor: "#1a1a2e",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lightHeader: {
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
  },
  darkHeader: {
    backgroundColor: "#222",
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  clearText: {
    color: "#E91E63",
    fontWeight: "600",
  },
  filtersContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  dropdownRowSides: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  halfDropdownWrapper: {
    width: "48%",
  },
  dropdown: {
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 48,
  },
  lightDropdown: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
  },
  darkDropdown: {
    backgroundColor: "#2d3748",
    borderColor: "#444",
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
  },
  lightDropdownContainer: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
  },
  darkDropdownContainer: {
    backgroundColor: "#2d3748",
    borderColor: "#444",
  },
  lightText: {
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  resultsHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    zIndex: -1,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: "600",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1,
  },
  errorText: {
    color: "#d32f2f",
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
  },
  noResultsSub: {
    color: "#888",
    marginTop: 8,
  },
  listContainer: {
    padding: 12,
    paddingBottom: 30,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  card: {
    width: (width - 36) / 2, // 2 columns with padding
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
  },
  lightCard: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  darkCard: {
    backgroundColor: "#2d3748",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 6,
  },
  placeholderAvatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  lightPlaceholder: { backgroundColor: "#e0e0e0" },
  darkPlaceholder: { backgroundColor: "#4a5568" },
  userName: {
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  imageContainer: {
    position: "relative",
  },
  postImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  placeholderImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  priceTag: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "#E91E63", // Pink for footwear
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  cardBody: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  darkTitle: { color: "#fff" },
  lightTitle: { color: "#222" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    marginLeft: 4,
    flex: 1,
  },
  darkSubtitle: { color: "#aaa" },
  lightSubtitle: { color: "#666" },
});

export default SearchFootwearPost;




