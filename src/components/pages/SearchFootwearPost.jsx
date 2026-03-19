// import axios from "axios";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   Image,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// // import { useStore } from "";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import DropDownPicker from "react-native-dropdown-picker";

// import { useStore } from '../../../src/zustand/store';

// const { width } = Dimensions.get("window");

// const SearchFootwearPost = () => {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Dropdown states
//   const [colleges, setColleges] = useState([]);
//   const [genders, setGenders] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);

//   // Picker Open States
//   const [collegeOpen, setCollegeOpen] = useState(false);
//   const [genderOpen, setGenderOpen] = useState(false);
//   const [categoryOpen, setCategoryOpen] = useState(false);
//   const [subcategoryOpen, setSubcategoryOpen] = useState(false);

//   // Selected Values
//   const [selectedCollege, setSelectedCollege] = useState(null);
//   const [selectedGender, setSelectedGender] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);

//   const baseURL = useStore((state) => state.baseURL);
//   const darkMode = useStore((state) => state.darkMode);
//   const navigation = useNavigation();
//   const isDark = darkMode === true || darkMode === "true";

//   useEffect(() => {
//     fetchInitialDropdowns();
//     fetchPosts();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [selectedCollege, selectedGender, selectedCategory, selectedSubcategory, posts]);

//   // When Gender changes, fetch dependent Categories
//   useEffect(() => {
//     if (selectedGender) {
//       fetchCategories(selectedGender);
//       setSelectedCategory(null);
//       setSelectedSubcategory(null);
//       setSubcategories([]);
//     } else {
//       setCategories([]);
//       setSubcategories([]);
//       setSelectedCategory(null);
//       setSelectedSubcategory(null);
//     }
//   }, [selectedGender]);

//   // When Category changes, fetch dependent Subcategories
//   useEffect(() => {
//     if (selectedCategory) {
//       fetchSubcategories(selectedCategory);
//       setSelectedSubcategory(null);
//     } else {
//       setSubcategories([]);
//       setSelectedSubcategory(null);
//     }
//   }, [selectedCategory]);

//   const fetchInitialDropdowns = async () => {
//     try {
//       const [collegesRes, gendersRes] = await Promise.all([
//         axios.get(`${baseURL}/dropdown/colleges`),
//         axios.get(`${baseURL}/dropdown/genders`),
//       ]);

//       setColleges(collegesRes.data.map(c => ({ label: c.name, value: c.name })));
//       setGenders(gendersRes.data.map(g => ({ label: g.name, value: g.id }))); 
//     } catch (err) {
//       console.error("Error fetching initial dropdowns:", err);
//     }
//   };

//   const fetchCategories = async (genderId) => {
//     try {
//       const response = await axios.get(`${baseURL}/dropdown/categories/${genderId}`);
//       setCategories(response.data.map(c => ({ label: c.name, value: c.id })));
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   const fetchSubcategories = async (categoryId) => {
//     try {
//       const response = await axios.get(`${baseURL}/dropdown/subcategories/${categoryId}`);
//       setSubcategories(response.data.map(s => ({ label: s.name, value: s.name }))); 
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${baseURL}/footwear/footwearposts`);
      
//       // Parse images if they come as strings
//       const parsedData = response.data.map(post => ({
//           ...post,
//           images: typeof post.images === 'string' ? JSON.parse(post.images) : post.images
//       }));

//       // Shuffle posts
//       const shuffled = parsedData.sort(() => Math.random() - 0.5).slice(0, 100);
//       setPosts(shuffled);
//       setFilteredPosts(shuffled);
//     } catch (err) {
//       setError("Failed to load footwear posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = posts;

//     if (selectedCollege) {
//       filtered = filtered.filter(p => p.college === selectedCollege);
//     }
//     if (selectedGender) {
//       // Find gender name
//       const genderName = genders.find(g => g.value === selectedGender)?.label;
//       if (genderName) {
//          filtered = filtered.filter(p => p.gender === genderName);
//       }
//     }
//     if (selectedCategory) {
//       const categoryName = categories.find(c => c.value === selectedCategory)?.label;
//       if (categoryName) {
//          filtered = filtered.filter(p => p.category === categoryName);
//       }
//     }
//     if (selectedSubcategory) {
//       filtered = filtered.filter(p => p.subcategory === selectedSubcategory);
//     }

//     setFilteredPosts(filtered.slice(0, 100));
//   };

//   const clearFilters = () => {
//     setSelectedCollege(null);
//     setSelectedGender(null);
//     setSelectedCategory(null);
//     setSelectedSubcategory(null);
//   };

//   const renderItem = ({ item }) => {
//     const profilePic = item.picture
//       ? item.picture.startsWith("http")
//         ? item.picture
//         : `${baseURL}/uploads/${item.picture}`
//       : null;

//     const postImage = item.images && item.images.length > 0
//       ? `${baseURL}/uploads/${item.images[0]}`
//       : null;

//     return (
//       <TouchableOpacity
//         style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
//         onPress={() => navigation.navigate("FootwearPostDetails", { id: item.id })}
//       >
//         <View style={styles.cardHeader}>
//           {profilePic ? (
//             <Image source={{ uri: profilePic }} style={styles.avatar} />
//           ) : (
//             <View style={[styles.avatar, styles.placeholderAvatar, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
//               <Ionicons name="person" size={16} color={isDark ? "#aaa" : "#555"} />
//             </View>
//           )}
//           <Text style={[styles.userName, isDark ? styles.darkText : styles.lightText]} numberOfLines={1}>
//             {item.user_name}
//           </Text>
//         </View>

//         <View style={styles.imageContainer}>
//           {postImage ? (
//             <Image source={{ uri: postImage }} style={styles.postImage} />
//           ) : (
//             <View style={[styles.postImage, styles.placeholderImage, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
//               <Ionicons name="walk-outline" size={40} color={isDark ? "#aaa" : "#555"} />
//             </View>
//           )}
//           <View style={styles.priceTag}>
//             <Text style={styles.priceText}>₹{item.price}</Text>
//           </View>
//         </View>

//         <View style={styles.cardBody}>
//           <Text style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]} numberOfLines={1}>
//             {item.subcategory}
//           </Text>
          
//           <View style={styles.infoRow}>
//             <Ionicons name="pricetag-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
//               {item.category} • {item.gender}
//             </Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Ionicons name="resize-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
//                Size: {item.size}
//             </Text>
//           </View>
          
//           <View style={styles.infoRow}>
//             <Ionicons name="location-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
//               {item.college || "Not specified"}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const hasFilters = selectedCollege || selectedGender || selectedCategory || selectedSubcategory;

//   const onGenderOpen = () => {
//     setGenderOpen(true);
//     setCollegeOpen(false);
//     setCategoryOpen(false);
//     setSubcategoryOpen(false);
//   };

//   const onCollegeOpen = () => {
//     setCollegeOpen(true);
//     setGenderOpen(false);
//     setCategoryOpen(false);
//     setSubcategoryOpen(false);
//   };

//   const onCategoryOpen = () => {
//     setCategoryOpen(true);
//     setCollegeOpen(false);
//     setGenderOpen(false);
//     setSubcategoryOpen(false);
//   };

//   const onSubcategoryOpen = () => {
//     setSubcategoryOpen(true);
//     setCollegeOpen(false);
//     setGenderOpen(false);
//     setCategoryOpen(false);
//   };

//   return (
//     <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
//       {/* Header */}
//       <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
//           Find Footwear
//         </Text>
//         {hasFilters && (
//           <TouchableOpacity onPress={clearFilters}>
//             <Text style={styles.clearText}>Clear</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Filters Section */}
//       <View style={[styles.filtersContainer, { zIndex: 1000 }]}>
//         <View style={[styles.dropdownRowSides, { zIndex: 4000 }]}>
//           <View style={[styles.halfDropdownWrapper, { zIndex: 4000 }]}>
//             <DropDownPicker
//               open={collegeOpen}
//               value={selectedCollege}
//               items={colleges}
//               setOpen={onCollegeOpen}
//               setValue={setSelectedCollege}
//               setItems={setColleges}
//               placeholder="College"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={4000}
//               zIndexInverse={1000}
//               searchable={true}
//               searchPlaceholder="Search..."
//               listMode="SCROLLVIEW"
//               theme={isDark ? "DARK" : "LIGHT"}
//             />
//           </View>
//           <View style={[styles.halfDropdownWrapper, { zIndex: 3000 }]}>
//             <DropDownPicker
//               open={genderOpen}
//               value={selectedGender}
//               items={genders}
//               setOpen={onGenderOpen}
//               setValue={setSelectedGender}
//               setItems={setGenders}
//               placeholder="Gender"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={3000}
//               zIndexInverse={2000}
//               listMode="SCROLLVIEW"
//               theme={isDark ? "DARK" : "LIGHT"}
//             />
//           </View>
//         </View>

//         <View style={[styles.dropdownRowSides, { zIndex: 2000 }]}>
//           <View style={[styles.halfDropdownWrapper, { zIndex: 2000 }]}>
//             <DropDownPicker
//               open={categoryOpen}
//               value={selectedCategory}
//               items={categories}
//               setOpen={onCategoryOpen}
//               setValue={setSelectedCategory}
//               setItems={setCategories}
//               placeholder={selectedGender ? "Category" : "Select Gender First"}
//               disabled={!selectedGender}
//               style={[
//                 styles.dropdown, 
//                 isDark ? styles.darkDropdown : styles.lightDropdown,
//                 !selectedGender && { opacity: 0.6 }
//               ]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={2000}
//               zIndexInverse={3000}
//               listMode="SCROLLVIEW"
//               theme={isDark ? "DARK" : "LIGHT"}
//             />
//           </View>
//           <View style={[styles.halfDropdownWrapper, { zIndex: 1000 }]}>
//             <DropDownPicker
//               open={subcategoryOpen}
//               value={selectedSubcategory}
//               items={subcategories}
//               setOpen={onSubcategoryOpen}
//               setValue={setSelectedSubcategory}
//               setItems={setSubcategories}
//               placeholder={selectedCategory ? "Subcategory" : "Select Category First"}
//               disabled={!selectedCategory}
//               style={[
//                 styles.dropdown, 
//                 isDark ? styles.darkDropdown : styles.lightDropdown,
//                 !selectedCategory && { opacity: 0.6 }
//               ]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={1000}
//               zIndexInverse={4000}
//               listMode="SCROLLVIEW"
//               theme={isDark ? "DARK" : "LIGHT"}
//             />
//           </View>
//         </View>
//       </View>

//       {/* Results Section */}
//       <View style={styles.resultsHeader}>
//         <Text style={[styles.resultsText, isDark ? styles.darkText : styles.lightText]}>
//           {filteredPosts.length} Results
//         </Text>
//       </View>

//       {loading ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#E91E63" />
//         </View>
//       ) : error ? (
//         <View style={styles.centerContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : filteredPosts.length === 0 ? (
//         <View style={styles.centerContainer}>
//           <Ionicons name="walk-outline" size={64} color={isDark ? "#555" : "#ccc"} />
//           <Text style={[styles.noResultsText, isDark ? styles.darkText : styles.lightText]}>
//             No footwear found
//           </Text>
//           <Text style={styles.noResultsSub}>
//             Try adjusting your filters
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredPosts}
//           keyExtractor={(item) => item.id.toString()}
//           renderItem={renderItem}
//           numColumns={2}
//           contentContainerStyle={styles.listContainer}
//           columnWrapperStyle={styles.columnWrapper}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   lightContainer: {
//     backgroundColor: "#f5f7fa",
//   },
//   darkContainer: {
//     backgroundColor: "#1a1a2e",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   lightHeader: {
//     backgroundColor: "#fff",
//     borderBottomColor: "#eee",
//   },
//   darkHeader: {
//     backgroundColor: "#222",
//     borderBottomColor: "#333",
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   clearText: {
//     color: "#E91E63",
//     fontWeight: "600",
//   },
//   filtersContainer: {
//     padding: 16,
//     paddingBottom: 0,
//   },
//   dropdownRowSides: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   halfDropdownWrapper: {
//     width: "48%",
//   },
//   dropdown: {
//     borderRadius: 12,
//     borderWidth: 1,
//     minHeight: 48,
//   },
//   lightDropdown: {
//     backgroundColor: "#fff",
//     borderColor: "#e0e0e0",
//   },
//   darkDropdown: {
//     backgroundColor: "#2d3748",
//     borderColor: "#444",
//   },
//   dropdownContainer: {
//     borderWidth: 1,
//     borderRadius: 12,
//     marginTop: 4,
//   },
//   lightDropdownContainer: {
//     backgroundColor: "#fff",
//     borderColor: "#e0e0e0",
//   },
//   darkDropdownContainer: {
//     backgroundColor: "#2d3748",
//     borderColor: "#444",
//   },
//   lightText: {
//     color: "#333",
//   },
//   darkText: {
//     color: "#fff",
//   },
//   resultsHeader: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 8,
//     zIndex: -1,
//   },
//   resultsText: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: -1,
//   },
//   errorText: {
//     color: "#d32f2f",
//   },
//   noResultsText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 16,
//   },
//   noResultsSub: {
//     color: "#888",
//     marginTop: 8,
//   },
//   listContainer: {
//     padding: 12,
//     paddingBottom: 30,
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//   },
//   card: {
//     width: (width - 36) / 2, // 2 columns with padding
//     marginBottom: 12,
//     borderRadius: 12,
//     overflow: "hidden",
//     elevation: 3,
//   },
//   lightCard: {
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   darkCard: {
//     backgroundColor: "#2d3748",
//     shadowColor: "#000",
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(150,150,150,0.1)",
//   },
//   avatar: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     marginRight: 6,
//   },
//   placeholderAvatar: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   lightPlaceholder: { backgroundColor: "#e0e0e0" },
//   darkPlaceholder: { backgroundColor: "#4a5568" },
//   userName: {
//     fontSize: 12,
//     fontWeight: "500",
//     flex: 1,
//   },
//   imageContainer: {
//     position: "relative",
//   },
//   postImage: {
//     width: "100%",
//     height: 140,
//     resizeMode: "cover",
//   },
//   placeholderImage: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   priceTag: {
//     position: "absolute",
//     bottom: 8,
//     right: 8,
//     backgroundColor: "#E91E63", // Pink for footwear
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   priceText: {
//     color: "#fff",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
//   cardBody: {
//     padding: 10,
//   },
//   title: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 6,
//   },
//   darkTitle: { color: "#fff" },
//   lightTitle: { color: "#222" },
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   subtitle: {
//     fontSize: 11,
//     marginLeft: 4,
//     flex: 1,
//   },
//   darkSubtitle: { color: "#aaa" },
//   lightSubtitle: { color: "#666" },
// });

// export default SearchFootwearPost;




import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useStore } from '../../../src/zustand/store';

const { width, height } = Dimensions.get("window");

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
          styles.optionItem,
          isDark ? styles.darkOption : styles.lightOption,
          isSelected && (isDark ? styles.darkSelectedOption : styles.lightSelectedOption),
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.optionText,
            isDark ? styles.darkText : styles.lightText,
            isSelected && styles.selectedOptionText,
          ]}
          numberOfLines={2}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark-circle" size={18} color="#E91E63" />
        )}
      </TouchableOpacity>
    );
  }, [value, isDark, handleSelect]);

  const keyExtractor = useCallback((item) => String(item.value), []);

  // Empty component
  const ListEmpty = useMemo(() => (
    <View style={styles.noResultsWrap}>
      <Ionicons name="search-outline" size={36} color={isDark ? "#555" : "#ccc"} />
      <Text style={[styles.noResultsLabel, { color: isDark ? "#aaa" : "#888" }]}>
        No results for "{debouncedSearch}"
      </Text>
    </View>
  ), [debouncedSearch, isDark]);

  // Result count header
  const ListHeader = useMemo(() => {
    if (!debouncedSearch.trim() || filteredItems.length === 0) return null;
    return (
      <Text style={[styles.resultCount, { color: isDark ? "#888" : "#aaa" }]}>
        {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
      </Text>
    );
  }, [debouncedSearch, filteredItems.length, isDark]);

  return (
    <>
      {/* ── Trigger button ── */}
      <TouchableOpacity
        style={[
          styles.pickerTrigger,
          isDark ? styles.darkDropdown : styles.lightDropdown,
          disabled && styles.pickerDisabled,
        ]}
        onPress={openModal}
        activeOpacity={disabled ? 1 : 0.8}
      >
        <Text
          style={[
            styles.pickerTriggerText,
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
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={[styles.modalSheet, isDark ? styles.darkModal : styles.lightModal]}>

          {/* Modal header */}
          <View style={[styles.modalHeader, { borderBottomColor: isDark ? "#2D2540" : "#eee" }]}>
            <Text style={[styles.modalTitle, isDark ? styles.darkText : styles.lightText]}>
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
          <View style={[styles.modalSearchWrap, isDark ? styles.darkModalSearch : styles.lightModalSearch]}>
            <Ionicons name="search" size={17} color={isDark ? "#888" : "#aaa"} />
            <TextInput
              ref={inputRef}
              style={[styles.modalSearchInput, { color: isDark ? "#fff" : "#333" }]}
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
              style={[styles.clearSelectionBtn, isDark ? styles.darkClearBtn : styles.lightClearBtn]}
              onPress={handleClearModal}
            >
              <Ionicons name="close-circle-outline" size={15} color="#E91E63" />
              <Text style={styles.clearSelectionText}>Clear selection</Text>
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

// ─── Main SearchFootwearPost Component ───────────────────────────────────────
const SearchFootwearPost = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Dropdown data
  const [colleges, setColleges] = useState([]);
  const [genders, setGenders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Single filters object
  const [filters, setFilters] = useState({
    college: "",
    gender: "",       // stores gender ID (for dependent fetches)
    genderName: "",   // stores gender name (for filtering posts)
    category: "",     // stores category ID (for dependent fetches)
    categoryName: "", // stores category name (for filtering posts)
    subcategory: "",
  });

  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();
  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchInitialDropdowns();
    fetchPosts();
  }, []);

  const fetchInitialDropdowns = async () => {
    try {
      const [collegesRes, gendersRes] = await Promise.all([
        axios.get(`${baseURL}/dropdown/colleges`),
        axios.get(`${baseURL}/dropdown/genders`),
      ]);
      setColleges(collegesRes.data.map((c) => ({ label: c.name, value: c.name })));
      setGenders(gendersRes.data.map((g) => ({ label: g.name, value: g.id })));
    } catch (err) {
      console.error("Error fetching initial dropdowns:", err);
    }
  };

  const fetchCategories = async (genderId) => {
    try {
      const response = await axios.get(`${baseURL}/dropdown/categories/${genderId}`);
      setCategories(response.data.map((c) => ({ label: c.name, value: c.id })));
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const response = await axios.get(`${baseURL}/dropdown/subcategories/${categoryId}`);
      setSubcategories(response.data.map((s) => ({ label: s.name, value: s.name })));
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/footwear/footwearposts`);
      // Parse images if they come as strings
      const parsedData = response.data.map((post) => ({
        ...post,
        images: typeof post.images === "string" ? JSON.parse(post.images) : post.images,
      }));
      const shuffled = parsedData.sort(() => Math.random() - 0.5).slice(0, 100);
      setPosts(shuffled);
      setFilteredPosts(shuffled);
    } catch (err) {
      setError("Failed to load footwear posts");
    } finally {
      setLoading(false);
    }
  };

  // ── Sequential filter logic ────────────────────────────────────────────────
  const applyAllFilters = useCallback((newFilters, allPosts) => {
    let filtered = allPosts;

    if (newFilters.college) {
      filtered = filtered.filter((p) => p.college === newFilters.college);
    }
    if (newFilters.genderName) {
      filtered = filtered.filter((p) => p.gender === newFilters.genderName);
    }
    if (newFilters.categoryName) {
      filtered = filtered.filter((p) => p.category === newFilters.categoryName);
    }
    if (newFilters.subcategory) {
      filtered = filtered.filter((p) => p.subcategory === newFilters.subcategory);
    }

    setFilteredPosts(filtered.slice(0, 100));
  }, []);

  // ── Handler: College ───────────────────────────────────────────────────────
  const handleCollegeChange = useCallback((val) => {
    const newFilters = { ...filters, college: val ?? "" };
    setFilters(newFilters);
    applyAllFilters(newFilters, posts);
  }, [filters, posts, applyAllFilters]);

  // ── Handler: Gender ────────────────────────────────────────────────────────
  // Changing gender resets category + subcategory and fetches new categories
  const handleGenderChange = useCallback((val) => {
    const genderLabel = val ? genders.find((g) => g.value === val)?.label ?? "" : "";
    const newFilters = {
      ...filters,
      gender: val ?? "",
      genderName: genderLabel,
      category: "",
      categoryName: "",
      subcategory: "",
    };
    setFilters(newFilters);
    setCategories([]);
    setSubcategories([]);

    if (val) {
      fetchCategories(val);
    }

    applyAllFilters(newFilters, posts);
  }, [filters, posts, genders, applyAllFilters]);

  // ── Handler: Category ──────────────────────────────────────────────────────
  // Changing category resets subcategory and fetches new subcategories
  const handleCategoryChange = useCallback((val) => {
    const categoryLabel = val ? categories.find((c) => c.value === val)?.label ?? "" : "";
    const newFilters = {
      ...filters,
      category: val ?? "",
      categoryName: categoryLabel,
      subcategory: "",
    };
    setFilters(newFilters);
    setSubcategories([]);

    if (val) {
      fetchSubcategories(val);
    }

    applyAllFilters(newFilters, posts);
  }, [filters, posts, categories, applyAllFilters]);

  // ── Handler: Subcategory ───────────────────────────────────────────────────
  const handleSubcategoryChange = useCallback((val) => {
    const newFilters = { ...filters, subcategory: val ?? "" };
    setFilters(newFilters);
    applyAllFilters(newFilters, posts);
  }, [filters, posts, applyAllFilters]);

  // ── Clear all filters ──────────────────────────────────────────────────────
  const clearFilters = useCallback(() => {
    setFilters({
      college: "",
      gender: "",
      genderName: "",
      category: "",
      categoryName: "",
      subcategory: "",
    });
    setCategories([]);
    setSubcategories([]);
    setFilteredPosts(posts);
  }, [posts]);

  const hasFilters =
    filters.college ||
    filters.gender ||
    filters.category ||
    filters.subcategory;

  // ── Render post card ───────────────────────────────────────────────────────
  const renderItem = useCallback(({ item }) => {
    const profilePic = item.picture
      ? item.picture.startsWith("http")
        ? item.picture
        : `${baseURL}/uploads/${item.picture}`
      : null;

    const postImage =
      item.images && item.images.length > 0
        ? `${baseURL}/uploads/${item.images[0]}`
        : null;

    return (
      <TouchableOpacity
        style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
        onPress={() => navigation.navigate("FootwearPostDetails", { id: item.id })}
        activeOpacity={0.85}
      >
        {/* Avatar + username */}
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

        {/* Image + price */}
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

        {/* Body */}
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
  }, [isDark, baseURL, navigation]);

  const postKeyExtractor = useCallback((item) => item.id.toString(), []);

  // ── UI ─────────────────────────────────────────────────────────────────────
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
        {hasFilters ? (
          <TouchableOpacity onPress={clearFilters} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 44 }} />
        )}
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>

        {/* Row 1: College + Gender */}
        <View style={styles.dropdownRowSides}>
          <View style={styles.halfWrapper}>
            <SearchablePicker
              label="College"
              placeholder="College"
              items={colleges}
              value={filters.college || null}
              onChange={handleCollegeChange}
              isDark={isDark}
            />
          </View>
          <View style={styles.halfWrapper}>
            <SearchablePicker
              label="Gender"
              placeholder="Gender"
              items={genders}
              value={filters.gender || null}
              onChange={handleGenderChange}
              isDark={isDark}
            />
          </View>
        </View>

        {/* Row 2: Category + Subcategory (dependent) */}
        <View style={styles.dropdownRowSides}>
          <View style={styles.halfWrapper}>
            <SearchablePicker
              label="Category"
              placeholder={filters.gender ? "Category" : "Select Gender First"}
              items={categories}
              value={filters.category || null}
              onChange={handleCategoryChange}
              isDark={isDark}
              disabled={!filters.gender}
            />
          </View>
          <View style={styles.halfWrapper}>
            <SearchablePicker
              label="Subcategory"
              placeholder={filters.category ? "Subcategory" : "Select Category First"}
              items={subcategories}
              value={filters.subcategory || null}
              onChange={handleSubcategoryChange}
              isDark={isDark}
              disabled={!filters.category}
            />
          </View>
        </View>
      </View>

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={[styles.resultsText, isDark ? styles.darkText : styles.lightText]}>
          {loading ? "Loading..." : `${filteredPosts.length} Results`}
        </Text>
      </View>

      {/* Body */}
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
          <Text style={styles.noResultsSub}>Try adjusting your filters</Text>
        </View>
      ) : (
        <FlatList
          data={filteredPosts}
          keyExtractor={postKeyExtractor}
          renderItem={renderItem}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: "#f5f7fa" },
  darkContainer: { backgroundColor: "#1a1a2e" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lightHeader: { backgroundColor: "#fff", borderBottomColor: "#eee" },
  darkHeader: { backgroundColor: "#222", borderBottomColor: "#333" },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  clearText: { color: "#E91E63", fontWeight: "600", fontSize: 15 },

  filtersContainer: { padding: 16, paddingBottom: 8, gap: 10 },

  // Picker trigger — used by all four pickers
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
  },
  pickerTriggerText: { flex: 1, fontSize: 14, marginRight: 6 },
  pickerDisabled: { opacity: 0.5 },

  // Shared dropdown theme
  lightDropdown: { backgroundColor: "#fff", borderColor: "#e0e0e0" },
  darkDropdown: { backgroundColor: "#2d3748", borderColor: "#444" },

  // Side-by-side rows
  dropdownRowSides: { flexDirection: "row", gap: 10 },
  halfWrapper: { flex: 1 },

  // Modal overlay
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },

  // Modal bottom sheet
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

  // Modal header
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

  // Modal search bar
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
  lightModalSearch: { backgroundColor: "#fdf4f7", borderColor: "#e0e0e0" },
  darkModalSearch: { backgroundColor: "#2A2333", borderColor: "#444" },
  modalSearchInput: { flex: 1, fontSize: 15 },

  // Result count header inside modal list
  resultCount: {
    fontSize: 12,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },

  // Clear selection button
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
  lightClearBtn: { backgroundColor: "#FCE4EC" },
  darkClearBtn: { backgroundColor: "#2A1020" },
  clearSelectionText: { color: "#E91E63", fontWeight: "600", fontSize: 14 },

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
  lightSelectedOption: { backgroundColor: "#FCE4EC" },
  darkSelectedOption: { backgroundColor: "#2A1020" },
  optionText: { flex: 1, fontSize: 14, marginRight: 8 },
  selectedOptionText: { color: "#E91E63", fontWeight: "600" },

  // No results inside modal
  noResultsWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    gap: 10,
  },
  noResultsLabel: { fontSize: 14 },

  // Results header (post list)
  resultsHeader: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 },
  resultsText: { fontSize: 16, fontWeight: "600" },

  // Center container
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#d32f2f" },
  noResultsText: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
  noResultsSub: { color: "#888", marginTop: 8 },

  // Post list
  listContainer: { padding: 12, paddingBottom: 30 },
  columnWrapper: { justifyContent: "space-between" },

  // Post card
  card: { width: (width - 36) / 2, marginBottom: 12, borderRadius: 12, overflow: "hidden", elevation: 3 },
  lightCard: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  darkCard: { backgroundColor: "#2d3748", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  cardHeader: { flexDirection: "row", alignItems: "center", padding: 8, borderBottomWidth: 1, borderBottomColor: "rgba(150,150,150,0.1)" },
  avatar: { width: 24, height: 24, borderRadius: 12, marginRight: 6 },
  placeholderAvatar: { alignItems: "center", justifyContent: "center" },
  lightPlaceholder: { backgroundColor: "#e0e0e0" },
  darkPlaceholder: { backgroundColor: "#4a5568" },
  userName: { fontSize: 12, fontWeight: "500", flex: 1 },
  imageContainer: { position: "relative" },
  postImage: { width: "100%", height: 140, resizeMode: "cover" },
  placeholderImage: { alignItems: "center", justifyContent: "center" },
  priceTag: { position: "absolute", bottom: 8, right: 8, backgroundColor: "#E91E63", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priceText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  cardBody: { padding: 10 },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 6 },
  darkTitle: { color: "#fff" },
  lightTitle: { color: "#222" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  subtitle: { fontSize: 11, marginLeft: 4, flex: 1 },
  darkSubtitle: { color: "#aaa" },
  lightSubtitle: { color: "#666" },
  lightText: { color: "#333" },
  darkText: { color: "#fff" },
});

export default SearchFootwearPost;