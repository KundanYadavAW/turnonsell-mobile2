import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
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

const SearchStationaryPost = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dropdown states
  const [colleges, setColleges] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [years, setYears] = useState([]);

  // Picker Open States
  const [collegeOpen, setCollegeOpen] = useState(false);
  const [degreeOpen, setDegreeOpen] = useState(false);
  const [yearOpen, setYearOpen] = useState(false);

  // Selected Values
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();
  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchDropdownData();
    fetchPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedCollege, selectedDegree, selectedYear, searchQuery, posts]);

  const fetchDropdownData = async () => {
    try {
      const [collegesRes, degreesRes, yearsRes] = await Promise.all([
        axios.get(`${baseURL}/dropdown/colleges`),
        axios.get(`${baseURL}/dropdown/degrees`),
        axios.get(`${baseURL}/dropdown/years`),
      ]);

      setColleges(collegesRes.data.map(c => ({ label: c.name, value: c.name })));
      setDegrees(degreesRes.data.map(d => ({ label: d.name, value: d.name })));
      setYears(yearsRes.data.map(y => ({ label: y.year_name, value: y.year_name })));
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/stationary/stationaryposts`);
      // Shuffle posts
      const shuffled = response.data.sort(() => Math.random() - 0.5).slice(0, 100);
      setPosts(shuffled);
      setFilteredPosts(shuffled);
    } catch (err) {
      setError("Failed to load electronics/stationary posts");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = posts;

    if (selectedCollege) {
      filtered = filtered.filter(p => p.college_name === selectedCollege);
    }
    if (selectedDegree) {
      filtered = filtered.filter(p => p.degree_name === selectedDegree);
    }
    if (selectedYear) {
      filtered = filtered.filter(p => p.year === selectedYear);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.stationary_name.toLowerCase().includes(query));
    }

    setFilteredPosts(filtered.slice(0, 100));
  };

  const clearFilters = () => {
    setSelectedCollege(null);
    setSelectedDegree(null);
    setSelectedYear(null);
    setSearchQuery("");
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
        onPress={() => navigation.navigate("DetailsStationary", { id: item.id })}
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
              <Ionicons name="laptop-outline" size={40} color={isDark ? "#aaa" : "#555"} />
            </View>
          )}
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]} numberOfLines={2}>
            {item.stationary_name}
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="school-outline" size={14} color={isDark ? "#aaa" : "#666"} />
            <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
              {item.degree_name} • {item.year}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={14} color={isDark ? "#aaa" : "#666"} />
            <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
              {item.college_name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const hasFilters = selectedCollege || selectedDegree || selectedYear || searchQuery;

  const onCollegeOpen = () => {
    setCollegeOpen(true);
    setDegreeOpen(false);
    setYearOpen(false);
  };

  const onDegreeOpen = () => {
    setDegreeOpen(true);
    setCollegeOpen(false);
    setYearOpen(false);
  };

  const onYearOpen = () => {
    setYearOpen(true);
    setCollegeOpen(false);
    setDegreeOpen(false);
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      {/* Search Header */}
      <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
          Find Electronics
        </Text>
        {hasFilters && (
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters Section */}
      <View style={[styles.filtersContainer, { zIndex: 1000 }]}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color={isDark ? "#aaa" : "#666"} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, isDark ? styles.darkInput : styles.lightInput]}
            placeholder="Search Product Name"
            placeholderTextColor={isDark ? "#aaa" : "#666"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={[styles.dropdownRow, { zIndex: 3000 }]}>
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
            containerStyle={styles.dropdownWrapper}
            zIndex={3000}
            zIndexInverse={1000}
            searchable={true}
            searchPlaceholder="Search..."
            listMode="SCROLLVIEW"
            theme={isDark ? "DARK" : "LIGHT"}
          />
        </View>

        <View style={styles.dropdownRowSides}>
          <View style={[styles.halfDropdownWrapper, { zIndex: 2000 }]}>
            <DropDownPicker
              open={degreeOpen}
              value={selectedDegree}
              items={degrees}
              setOpen={onDegreeOpen}
              setValue={setSelectedDegree}
              setItems={setDegrees}
              placeholder="Degree"
              style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
              textStyle={isDark ? styles.darkText : styles.lightText}
              dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
              zIndex={2000}
              zIndexInverse={2000}
              searchable={true}
              searchPlaceholder="Search..."
              listMode="SCROLLVIEW"
              theme={isDark ? "DARK" : "LIGHT"}
            />
          </View>
          <View style={[styles.halfDropdownWrapper, { zIndex: 1000 }]}>
            <DropDownPicker
              open={yearOpen}
              value={selectedYear}
              items={years}
              setOpen={onYearOpen}
              setValue={setSelectedYear}
              setItems={setYears}
              placeholder="Year"
              style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
              textStyle={isDark ? styles.darkText : styles.lightText}
              dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
              zIndex={1000}
              zIndexInverse={3000}
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
          <ActivityIndicator size="large" color="#FF9800" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="hardware-chip-outline" size={64} color={isDark ? "#555" : "#ccc"} />
          <Text style={[styles.noResultsText, isDark ? styles.darkText : styles.lightText]}>
            No items found
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
    backgroundColor: "#FDFDFD",
  },
  darkContainer: {
    backgroundColor: "#1A1625",
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
    backgroundColor: "#2A2333",
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
    color: "#FF9800",
    fontWeight: "600",
  },
  filtersContainer: {
    padding: 16,
    paddingBottom: 0,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    height: 48,
  },
  lightInput: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    flex: 1,
    height: "100%",
    color: "#000",
    marginLeft: 8,
  },
  darkInput: {
    backgroundColor: "#2A2333",
    borderColor: "#444",
    borderWidth: 1,
    flex: 1,
    height: "100%",
    color: "#fff",
    marginLeft: 8,
  },
  searchInput: {
    borderWidth: 0, // override
    backgroundColor: "transparent",
  },
  searchIcon: {
    marginRight: 4,
  },
  dropdownRow: {
    marginBottom: 12,
  },
  dropdownRowSides: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dropdownWrapper: {
    width: "100%",
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
    backgroundColor: "#2A2333",
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
    backgroundColor: "#2A2333",
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
    backgroundColor: "#FF9800", // Orange for electronics
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
    height: 38, // Fix height for 2 lines
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

export default SearchStationaryPost;




