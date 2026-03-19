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
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// // import { useStore } from "";
// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import DropDownPicker from "react-native-dropdown-picker";

// import { useStore } from '../../../src/zustand/store';

// const { width } = Dimensions.get("window");

// const SearchPost = () => {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Dropdown states
//   const [colleges, setColleges] = useState([]);
//   const [degrees, setDegrees] = useState([]);
//   const [years, setYears] = useState([]);

//   // Picker Open States
//   const [collegeOpen, setCollegeOpen] = useState(false);
//   const [degreeOpen, setDegreeOpen] = useState(false);
//   const [yearOpen, setYearOpen] = useState(false);

//   // Selected Values
//   const [selectedCollege, setSelectedCollege] = useState(null);
//   const [selectedDegree, setSelectedDegree] = useState(null);
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const baseURL = useStore((state) => state.baseURL);
//   const darkMode = useStore((state) => state.darkMode);
//   const navigation = useNavigation();
//   const isDark = darkMode === true || darkMode === "true";

//   useEffect(() => {
//     fetchDropdownData();
//     fetchPosts();
//   }, []);

//   useEffect(() => {
//     applyFilters();
//   }, [selectedCollege, selectedDegree, selectedYear, searchQuery, posts]);

//   const fetchDropdownData = async () => {
//     try {
//       const [collegesRes, degreesRes, yearsRes] = await Promise.all([
//         axios.get(`${baseURL}/dropdown/colleges`),
//         axios.get(`${baseURL}/dropdown/degrees`),
//         axios.get(`${baseURL}/dropdown/years`),
//       ]);

//       setColleges(collegesRes.data.map(c => ({ label: c.name, value: c.name })));
//       setDegrees(degreesRes.data.map(d => ({ label: d.name, value: d.name })));
//       setYears(yearsRes.data.map(y => ({ label: y.year_name, value: y.year_name })));
//     } catch (err) {
//       console.error("Error fetching dropdowns:", err);
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${baseURL}/api/users`);
//       // Shuffle posts
//       const shuffled = response.data.sort(() => Math.random() - 0.5).slice(0, 100);
//       setPosts(shuffled);
//       setFilteredPosts(shuffled);
//     } catch (err) {
//       setError("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = posts;

//     if (selectedCollege) {
//       filtered = filtered.filter(p => p.college_name === selectedCollege);
//     }
//     if (selectedDegree) {
//       filtered = filtered.filter(p => p.degree_name === selectedDegree);
//     }
//     if (selectedYear) {
//       filtered = filtered.filter(p => p.year === selectedYear);
//     }
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(p => p.book_name.toLowerCase().includes(query));
//     }

//     setFilteredPosts(filtered.slice(0, 100));
//   };

//   const clearFilters = () => {
//     setSelectedCollege(null);
//     setSelectedDegree(null);
//     setSelectedYear(null);
//     setSearchQuery("");
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
//         onPress={() => navigation.navigate("BookPostDetails", { id: item.id })}
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
//               <Ionicons name="image-outline" size={40} color={isDark ? "#aaa" : "#555"} />
//             </View>
//           )}
//           <View style={styles.priceTag}>
//             <Text style={styles.priceText}>₹{item.price}</Text>
//           </View>
//         </View>

//         <View style={styles.cardBody}>
//           <Text style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]} numberOfLines={2}>
//             {item.book_name}
//           </Text>

//           <View style={styles.infoRow}>
//             <Ionicons name="book-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
//               {item.degree_name} • {item.year}
//             </Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Ionicons name="location-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
//               {item.college_name}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const hasFilters = selectedCollege || selectedDegree || selectedYear || searchQuery;

//   return (
//     <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
//       {/* Search Header */}
//       <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
//           Find Books
//         </Text>
//         {hasFilters && (
//           <TouchableOpacity onPress={clearFilters}>
//             <Text style={styles.clearText}>Clear</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Filters Section */}
//       <View style={[styles.filtersContainer, { zIndex: 1000 }]}>
//         <View style={styles.searchBarContainer}>
//           <Ionicons name="search" size={20} color={isDark ? "#aaa" : "#666"} style={styles.searchIcon} />
//           <TextInput
//             style={[styles.searchInput, isDark ? styles.darkInput : styles.lightInput]}
//             placeholder="Search Book Name"
//             placeholderTextColor={isDark ? "#aaa" : "#666"}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>

//         <View style={[styles.dropdownRow, { zIndex: 3000 }]}>
//           {/* <DropDownPicker
//             open={collegeOpen}
//             value={selectedCollege}
//             items={colleges}
//             setOpen={setCollegeOpen}
//             setValue={setSelectedCollege}
//             setItems={setColleges}
//             placeholder="College"
//             style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//             textStyle={isDark ? styles.darkText : styles.lightText}
//             dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//             containerStyle={styles.dropdownWrapper}
//             zIndex={3000}
//             zIndexInverse={1000}
//             searchable={true}
//             searchPlaceholder="Search..."
//             listMode="SCROLLVIEW"
//             theme={isDark ? "DARK" : "LIGHT"}
//           /> */}

//           <DropDownPicker
//             open={collegeOpen}
//             value={selectedCollege}
//             items={colleges}
//             setOpen={(open) => {
//               setCollegeOpen(open);
//               if (open) { setDegreeOpen(false); setYearOpen(false); }
//             }}
//             setValue={setSelectedCollege}
//             setItems={setColleges}
//             placeholder="College"
//             style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//             textStyle={isDark ? styles.darkText : styles.lightText}
//             dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//             containerStyle={styles.dropdownWrapper}
//             zIndex={3000}
//             zIndexInverse={1000}
//             searchable={true}
//             searchPlaceholder="Search..."
//             listMode="MODAL"
//             theme={isDark ? "DARK" : "LIGHT"}
//           />
//         </View>

//         <View style={styles.dropdownRowSides}>
//           <View style={[styles.halfDropdownWrapper, { zIndex: 2000 }]}>
//             {/* <DropDownPicker
//               open={degreeOpen}
//               value={selectedDegree}
//               items={degrees}
//               setOpen={setDegreeOpen}
//               setValue={setSelectedDegree}
//               setItems={setDegrees}
//               placeholder="Degree"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={2000}
//               zIndexInverse={2000}
//               searchable={true}
//               searchPlaceholder="Search..."
//               listMode="SCROLLVIEW"
//               theme={isDark ? "DARK" : "LIGHT"}
//             /> */}
//             <DropDownPicker
//               open={degreeOpen}
//               value={selectedDegree}
//               items={degrees}
//               setOpen={(open) => {
//                 setDegreeOpen(open);
//                 if (open) { setCollegeOpen(false); setYearOpen(false); }
//               }}
//               setValue={setSelectedDegree}
//               setItems={setDegrees}
//               placeholder="Degree"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={2000}
//               zIndexInverse={2000}
//               searchable={true}
//               searchPlaceholder="Search..."
//               listMode="MODAL"
//               theme={isDark ? "DARK" : "LIGHT"}
//             />
//           </View>
//           <View style={[styles.halfDropdownWrapper, { zIndex: 1000 }]}>
//             {/* <DropDownPicker
//               open={yearOpen}
//               value={selectedYear}
//               items={years}
//               setOpen={setYearOpen}
//               setValue={setSelectedYear}
//               setItems={setYears}
//               placeholder="Year"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={1000}
//               zIndexInverse={3000}
//               listMode="SCROLLVIEW"
//               theme={isDark ? "DARK" : "LIGHT"}
//             /> */}
//             <DropDownPicker
//               open={yearOpen}
//               value={selectedYear}
//               items={years}
//               setOpen={(open) => {
//                 setYearOpen(open);
//                 if (open) { setCollegeOpen(false); setDegreeOpen(false); }
//               }}
//               setValue={setSelectedYear}
//               setItems={setYears}
//               placeholder="Year"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={isDark ? styles.darkText : styles.lightText}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={1000}
//               zIndexInverse={3000}
//               listMode="MODAL"
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
//           <ActivityIndicator size="large" color="#8A63D2" />
//         </View>
//       ) : error ? (
//         <View style={styles.centerContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : filteredPosts.length === 0 ? (
//         <View style={styles.centerContainer}>
//           <Ionicons name="search-outline" size={64} color={isDark ? "#555" : "#ccc"} />
//           <Text style={[styles.noResultsText, isDark ? styles.darkText : styles.lightText]}>
//             No books found
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
//     backgroundColor: "#F7F3FF",
//   },
//   darkContainer: {
//     backgroundColor: "#1A1625",
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
//     backgroundColor: "#2A2333",
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
//     color: "#8A63D2",
//     fontWeight: "600",
//   },
//   filtersContainer: {
//     padding: 16,
//     paddingBottom: 0,
//   },
//   searchBarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     marginBottom: 12,
//     height: 48,
//   },
//   lightInput: {
//     backgroundColor: "#fff",
//     borderColor: "#e0e0e0",
//     borderWidth: 1,
//     flex: 1,
//     height: "100%",
//     color: "#000",
//     marginLeft: 8,
//   },
//   darkInput: {
//     backgroundColor: "#2A2333",
//     borderColor: "#444",
//     borderWidth: 1,
//     flex: 1,
//     height: "100%",
//     color: "#fff",
//     marginLeft: 8,
//   },
//   searchInput: {
//     borderWidth: 0, // override
//     backgroundColor: "transparent",
//   },
//   searchIcon: {
//     marginRight: 4,
//   },
//   dropdownRow: {
//     marginBottom: 12,
//   },
//   dropdownRowSides: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   dropdownWrapper: {
//     width: "100%",
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
//     backgroundColor: "#2A2333",
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
//     backgroundColor: "#2A2333",
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
//     backgroundColor: "#8A63D2", // lavender primary
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
//     height: 38, // Fix height for 2 lines
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

// export default SearchPost;









// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   Image,
//   Modal,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View
// } from "react-native";
// import { useStore } from '../../../src/zustand/store';

// const { width, height } = Dimensions.get("window");

// // ─── Reusable Searchable Picker Modal ────────────────────────────────────────
// const SearchablePicker = ({
//   label,
//   placeholder,
//   items,        // [{ label, value }]
//   value,        // currently selected value (string | null)
//   onChange,     // (value: string | null) => void
//   isDark,
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [search, setSearch] = useState("");

//   const filtered = search.trim()
//     ? items.filter((item) =>
//         item.label.toLowerCase().includes(search.toLowerCase())
//       )
//     : items;

//   const selectedLabel = value
//     ? items.find((i) => i.value === value)?.label ?? placeholder
//     : placeholder;

//   const handleSelect = (item) => {
//     onChange(item.value);
//     setModalVisible(false);
//     setSearch("");
//   };

//   const handleClear = () => {
//     onChange(null);
//     setModalVisible(false);
//     setSearch("");
//   };

//   return (
//     <>
//       {/* Trigger button */}
//       <TouchableOpacity
//         style={[
//           styles.pickerTrigger,
//           isDark ? styles.darkDropdown : styles.lightDropdown,
//         ]}
//         onPress={() => setModalVisible(true)}
//         activeOpacity={0.8}
//       >
//         <Text
//           style={[
//             styles.pickerTriggerText,
//             { color: value ? (isDark ? "#fff" : "#333") : (isDark ? "#aaa" : "#999") },
//           ]}
//           numberOfLines={1}
//         >
//           {selectedLabel}
//         </Text>
//         <Ionicons
//           name={value ? "close-circle" : "chevron-down"}
//           size={18}
//           color={isDark ? "#aaa" : "#888"}
//           onPress={value ? handleClear : undefined}
//         />
//       </TouchableOpacity>

//       {/* Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={() => { setModalVisible(false); setSearch(""); }}
//       >
//         <TouchableWithoutFeedback onPress={() => { setModalVisible(false); setSearch(""); }}>
//           <View style={styles.modalOverlay} />
//         </TouchableWithoutFeedback>

//         <View style={[styles.modalSheet, isDark ? styles.darkModal : styles.lightModal]}>
//           {/* Modal header */}
//           <View style={styles.modalHeader}>
//             <Text style={[styles.modalTitle, isDark ? styles.darkText : styles.lightText]}>
//               {label}
//             </Text>
//             <TouchableOpacity onPress={() => { setModalVisible(false); setSearch(""); }}>
//               <Ionicons name="close" size={24} color={isDark ? "#fff" : "#333"} />
//             </TouchableOpacity>
//           </View>

//           {/* Search input inside modal */}
//           <View style={[styles.modalSearch, isDark ? styles.darkModalSearch : styles.lightModalSearch]}>
//             <Ionicons name="search" size={18} color={isDark ? "#aaa" : "#888"} />
//             <TextInput
//               style={[styles.modalSearchInput, { color: isDark ? "#fff" : "#333" }]}
//               placeholder={`Search ${label}...`}
//               placeholderTextColor={isDark ? "#666" : "#aaa"}
//               value={search}
//               onChangeText={setSearch}
//               autoFocus
//             />
//             {search.length > 0 && (
//               <TouchableOpacity onPress={() => setSearch("")}>
//                 <Ionicons name="close-circle" size={18} color={isDark ? "#aaa" : "#888"} />
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Clear selection option */}
//           {value && (
//             <TouchableOpacity
//               style={[styles.clearOption, isDark ? styles.darkClearOption : styles.lightClearOption]}
//               onPress={handleClear}
//             >
//               <Ionicons name="close-circle-outline" size={16} color="#8A63D2" />
//               <Text style={styles.clearOptionText}>Clear Selection</Text>
//             </TouchableOpacity>
//           )}

//           {/* List */}
//           {filtered.length === 0 ? (
//             <View style={styles.noResults}>
//               <Ionicons name="search-outline" size={40} color={isDark ? "#555" : "#ccc"} />
//               <Text style={[styles.noResultsText, { color: isDark ? "#aaa" : "#888" }]}>
//                 No results for "{search}"
//               </Text>
//             </View>
//           ) : (
//             <FlatList
//               data={filtered}
//               keyExtractor={(item) => item.value}
//               keyboardShouldPersistTaps="handled"
//               showsVerticalScrollIndicator={true}
//               renderItem={({ item }) => {
//                 const isSelected = item.value === value;
//                 return (
//                   <TouchableOpacity
//                     style={[
//                       styles.optionItem,
//                       isSelected && styles.selectedOption,
//                       isDark
//                         ? isSelected
//                           ? styles.darkSelectedOption
//                           : styles.darkOption
//                         : isSelected
//                         ? styles.lightSelectedOption
//                         : styles.lightOption,
//                     ]}
//                     onPress={() => handleSelect(item)}
//                   >
//                     <Text
//                       style={[
//                         styles.optionText,
//                         isSelected
//                           ? styles.selectedOptionText
//                           : isDark
//                           ? styles.darkText
//                           : styles.lightText,
//                       ]}
//                       numberOfLines={2}
//                     >
//                       {item.label}
//                     </Text>
//                     {isSelected && (
//                       <Ionicons name="checkmark-circle" size={20} color="#8A63D2" />
//                     )}
//                   </TouchableOpacity>
//                 );
//               }}
//             />
//           )}
//         </View>
//       </Modal>
//     </>
//   );
// };

// // ─── Main SearchPost Component ────────────────────────────────────────────────
// const SearchPost = () => {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Dropdown data
//   const [colleges, setColleges] = useState([]);
//   const [degrees, setDegrees] = useState([]);
//   const [years, setYears] = useState([]);

//   // Single filters object — mirrors web version exactly
//   const [filters, setFilters] = useState({
//     college: "",
//     degree: "",
//     year: "",
//     bookName: "",
//   });

//   const baseURL = useStore((state) => state.baseURL);
//   const darkMode = useStore((state) => state.darkMode);
//   const navigation = useNavigation();
//   const isDark = darkMode === true || darkMode === "true";

//   useEffect(() => {
//     fetchDropdownData();
//     fetchPosts();
//   }, []);

//   const fetchDropdownData = async () => {
//     try {
//       const [collegesRes, degreesRes, yearsRes] = await Promise.all([
//         axios.get(`${baseURL}/dropdown/colleges`),
//         axios.get(`${baseURL}/dropdown/degrees`),
//         axios.get(`${baseURL}/dropdown/years`),
//       ]);
//       setColleges(collegesRes.data.map((c) => ({ label: c.name, value: c.name })));
//       setDegrees(degreesRes.data.map((d) => ({ label: d.name, value: d.name })));
//       setYears(yearsRes.data.map((y) => ({ label: y.year_name, value: y.year_name })));
//     } catch (err) {
//       console.error("Error fetching dropdowns:", err);
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${baseURL}/api/users`);
//       const shuffled = response.data.sort(() => Math.random() - 0.5).slice(0, 100);
//       setPosts(shuffled);
//       setFilteredPosts(shuffled);
//     } catch (err) {
//       setError("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Sequential filter logic — exact mirror of web handleFilterChange ────────
//   const handleFilterChange = (field, value) => {
//     // Save new filter value
//     const newFilters = { ...filters, [field]: value ?? "" };
//     setFilters(newFilters);

//     // Apply all filters sequentially against the full posts list
//     let filtered = posts;

//     if (newFilters.college) {
//       filtered = filtered.filter((p) => p.college_name === newFilters.college);
//     }
//     if (newFilters.degree) {
//       filtered = filtered.filter((p) => p.degree_name === newFilters.degree);
//     }
//     if (newFilters.year) {
//       filtered = filtered.filter((p) => p.year === newFilters.year);
//     }
//     if (newFilters.bookName) {
//       filtered = filtered.filter((p) =>
//         p.book_name.toLowerCase().includes(newFilters.bookName.toLowerCase())
//       );
//     }

//     setFilteredPosts(filtered.slice(0, 100));
//   };

//   // ── Clear all filters ──────────────────────────────────────────────────────
//   const clearFilters = () => {
//     setFilters({ college: "", degree: "", year: "", bookName: "" });
//     setFilteredPosts(posts);
//   };

//   const hasFilters =
//     filters.college || filters.degree || filters.year || filters.bookName;

//   // ── Render card ────────────────────────────────────────────────────────────
//   const renderItem = ({ item }) => {
//     const profilePic = item.picture
//       ? item.picture.startsWith("http")
//         ? item.picture
//         : `${baseURL}/uploads/${item.picture}`
//       : null;

//     const postImage =
//       item.images && item.images.length > 0
//         ? `${baseURL}/uploads/${item.images[0]}`
//         : null;

//     return (
//       <TouchableOpacity
//         style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
//         onPress={() => navigation.navigate("BookPostDetails", { id: item.id })}
//       >
//         {/* Avatar + username */}
//         <View style={styles.cardHeader}>
//           {profilePic ? (
//             <Image source={{ uri: profilePic }} style={styles.avatar} />
//           ) : (
//             <View
//               style={[
//                 styles.avatar,
//                 styles.placeholderAvatar,
//                 isDark ? styles.darkPlaceholder : styles.lightPlaceholder,
//               ]}
//             >
//               <Ionicons name="person" size={16} color={isDark ? "#aaa" : "#555"} />
//             </View>
//           )}
//           <Text
//             style={[styles.userName, isDark ? styles.darkText : styles.lightText]}
//             numberOfLines={1}
//           >
//             {item.user_name}
//           </Text>
//         </View>

//         {/* Image + price */}
//         <View style={styles.imageContainer}>
//           {postImage ? (
//             <Image source={{ uri: postImage }} style={styles.postImage} />
//           ) : (
//             <View
//               style={[
//                 styles.postImage,
//                 styles.placeholderImage,
//                 isDark ? styles.darkPlaceholder : styles.lightPlaceholder,
//               ]}
//             >
//               <Ionicons name="image-outline" size={40} color={isDark ? "#aaa" : "#555"} />
//             </View>
//           )}
//           <View style={styles.priceTag}>
//             <Text style={styles.priceText}>₹{item.price}</Text>
//           </View>
//         </View>

//         {/* Body */}
//         <View style={styles.cardBody}>
//           <Text
//             style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]}
//             numberOfLines={2}
//           >
//             {item.book_name}
//           </Text>

//           <View style={styles.infoRow}>
//             <Ionicons name="book-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text
//               style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}
//               numberOfLines={1}
//             >
//               {item.degree_name} • {item.year}
//             </Text>
//           </View>

//           <View style={styles.infoRow}>
//             <Ionicons name="location-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text
//               style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]}
//               numberOfLines={1}
//             >
//               {item.college_name}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // ── UI ─────────────────────────────────────────────────────────────────────
//   return (
//     <SafeAreaView
//       style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}
//     >
//       {/* Header */}
//       <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
//           Find Books
//         </Text>
//         {hasFilters ? (
//           <TouchableOpacity onPress={clearFilters}>
//             <Text style={styles.clearText}>Clear</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={{ width: 40 }} />
//         )}
//       </View>

//       {/* Filters */}
//       <View style={styles.filtersContainer}>

//         {/* Book name search */}
//         <View style={[styles.searchBarContainer, isDark ? styles.darkDropdown : styles.lightDropdown]}>
//           <Ionicons name="search" size={20} color={isDark ? "#aaa" : "#888"} />
//           <TextInput
//             style={[styles.searchInput, { color: isDark ? "#fff" : "#333" }]}
//             placeholder="Search Book Name"
//             placeholderTextColor={isDark ? "#666" : "#aaa"}
//             value={filters.bookName}
//             onChangeText={(text) => handleFilterChange("bookName", text)}
//           />
//           {filters.bookName.length > 0 && (
//             <TouchableOpacity onPress={() => handleFilterChange("bookName", "")}>
//               <Ionicons name="close-circle" size={18} color={isDark ? "#aaa" : "#888"} />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* College picker */}
//         <SearchablePicker
//           label="College"
//           placeholder="Select College"
//           items={colleges}
//           value={filters.college || null}
//           onChange={(val) => handleFilterChange("college", val)}
//           isDark={isDark}
//         />

//         {/* Degree + Year side by side */}
//         <View style={styles.dropdownRowSides}>
//           <View style={styles.halfWrapper}>
//             <SearchablePicker
//               label="Degree"
//               placeholder="Select Degree"
//               items={degrees}
//               value={filters.degree || null}
//               onChange={(val) => handleFilterChange("degree", val)}
//               isDark={isDark}
//             />
//           </View>
//           <View style={styles.halfWrapper}>
//             <SearchablePicker
//               label="Year"
//               placeholder="Select Year"
//               items={years}
//               value={filters.year || null}
//               onChange={(val) => handleFilterChange("year", val)}
//               isDark={isDark}
//             />
//           </View>
//         </View>
//       </View>

//       {/* Results count */}
//       <View style={styles.resultsHeader}>
//         <Text style={[styles.resultsText, isDark ? styles.darkText : styles.lightText]}>
//           {loading ? "Loading..." : `${filteredPosts.length} Results`}
//         </Text>
//       </View>

//       {/* Body */}
//       {loading ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#8A63D2" />
//         </View>
//       ) : error ? (
//         <View style={styles.centerContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : filteredPosts.length === 0 ? (
//         <View style={styles.centerContainer}>
//           <Ionicons name="search-outline" size={64} color={isDark ? "#555" : "#ccc"} />
//           <Text style={[styles.noResultsText, isDark ? styles.darkText : styles.lightText]}>
//             No books found
//           </Text>
//           <Text style={styles.noResultsSub}>Try adjusting your filters</Text>
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
//           keyboardShouldPersistTaps="handled"
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   // Layout
//   container: { flex: 1 },
//   lightContainer: { backgroundColor: "#F7F3FF" },
//   darkContainer: { backgroundColor: "#1A1625" },

//   // Header
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   lightHeader: { backgroundColor: "#fff", borderBottomColor: "#eee" },
//   darkHeader: { backgroundColor: "#2A2333", borderBottomColor: "#333" },
//   backButton: { padding: 4 },
//   headerTitle: { fontSize: 20, fontWeight: "bold" },
//   clearText: { color: "#8A63D2", fontWeight: "600", fontSize: 15 },

//   // Filters container
//   filtersContainer: { padding: 16, paddingBottom: 8, gap: 10 },

//   // Book name search bar
//   searchBarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 48,
//     gap: 8,
//     borderWidth: 1,
//   },
//   searchInput: { flex: 1, fontSize: 15, height: "100%" },

//   // Picker trigger button
//   pickerTrigger: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//     borderWidth: 1,
//   },
//   pickerTriggerText: { flex: 1, fontSize: 15, marginRight: 8 },

//   // Shared dropdown theme styles
//   lightDropdown: { backgroundColor: "#fff", borderColor: "#e0e0e0" },
//   darkDropdown: { backgroundColor: "#2A2333", borderColor: "#444" },

//   // Side-by-side row
//   dropdownRowSides: { flexDirection: "row", gap: 10 },
//   halfWrapper: { flex: 1 },

//   // Modal overlay
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//   },

//   // Modal bottom sheet
//   modalSheet: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: height * 0.75,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     paddingBottom: 30,
//   },
//   lightModal: { backgroundColor: "#fff" },
//   darkModal: { backgroundColor: "#1E1A2E" },

//   // Modal header
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "rgba(150,150,150,0.15)",
//   },
//   modalTitle: { fontSize: 18, fontWeight: "700" },

//   // Modal search
//   modalSearch: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginVertical: 12,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 48,
//     gap: 8,
//     borderWidth: 1,
//   },
//   lightModalSearch: { backgroundColor: "#F7F3FF", borderColor: "#e0e0e0" },
//   darkModalSearch: { backgroundColor: "#2A2333", borderColor: "#444" },
//   modalSearchInput: { flex: 1, fontSize: 15 },

//   // Clear selection
//   clearOption: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 16,
//     marginBottom: 8,
//     padding: 10,
//     borderRadius: 10,
//     gap: 8,
//   },
//   lightClearOption: { backgroundColor: "#F3E8FF" },
//   darkClearOption: { backgroundColor: "#2D2240" },
//   clearOptionText: { color: "#8A63D2", fontWeight: "600", fontSize: 14 },

//   // No results inside modal
//   noResults: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
//   noResultsText: { fontSize: 15 },

//   // Option items in list
//   optionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "rgba(150,150,150,0.1)",
//   },
//   lightOption: { backgroundColor: "transparent" },
//   darkOption: { backgroundColor: "transparent" },
//   lightSelectedOption: { backgroundColor: "#F3E8FF" },
//   darkSelectedOption: { backgroundColor: "#2D2240" },
//   optionText: { flex: 1, fontSize: 15, marginRight: 8 },
//   selectedOptionText: { color: "#8A63D2", fontWeight: "600" },

//   // Results header
//   resultsHeader: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
//   resultsText: { fontSize: 16, fontWeight: "600" },

//   // Center container (loading / error / empty)
//   centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   errorText: { color: "#d32f2f" },
//   noResultsText: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
//   noResultsSub: { color: "#888", marginTop: 8 },

//   // List
//   listContainer: { padding: 12, paddingBottom: 30 },
//   columnWrapper: { justifyContent: "space-between" },

//   // Card
//   card: { width: (width - 36) / 2, marginBottom: 12, borderRadius: 12, overflow: "hidden", elevation: 3 },
//   lightCard: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
//   darkCard: { backgroundColor: "#2d3748", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
//   cardHeader: { flexDirection: "row", alignItems: "center", padding: 8, borderBottomWidth: 1, borderBottomColor: "rgba(150,150,150,0.1)" },
//   avatar: { width: 24, height: 24, borderRadius: 12, marginRight: 6 },
//   placeholderAvatar: { alignItems: "center", justifyContent: "center" },
//   lightPlaceholder: { backgroundColor: "#e0e0e0" },
//   darkPlaceholder: { backgroundColor: "#4a5568" },
//   userName: { fontSize: 12, fontWeight: "500", flex: 1 },
//   imageContainer: { position: "relative" },
//   postImage: { width: "100%", height: 140, resizeMode: "cover" },
//   placeholderImage: { alignItems: "center", justifyContent: "center" },
//   priceTag: { position: "absolute", bottom: 8, right: 8, backgroundColor: "#8A63D2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   priceText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
//   cardBody: { padding: 10 },
//   title: { fontSize: 14, fontWeight: "bold", marginBottom: 6, height: 38 },
//   darkTitle: { color: "#fff" },
//   lightTitle: { color: "#222" },
//   infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
//   subtitle: { fontSize: 11, marginLeft: 4, flex: 1 },
//   darkSubtitle: { color: "#aaa" },
//   lightSubtitle: { color: "#666" },

//   // Text theme
//   lightText: { color: "#333" },
//   darkText: { color: "#fff" },
// });

// export default SearchPost;






// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { useCallback, useEffect, useMemo, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Dimensions,
//   FlatList,
//   Image,
//   Modal,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   View,
// } from "react-native";
// import DropDownPicker from "react-native-dropdown-picker";
// import { useStore } from '../../../src/zustand/store';

// const { width, height } = Dimensions.get("window");

// // ─── High-performance Searchable Picker (handles 4500+ items) ────────────────
// const SearchablePicker = ({
//   label,
//   placeholder,
//   items,
//   value,
//   onChange,
//   isDark,
//   maxVisible = 30, // only render this many items at a time
// }) => {
//   const [modalVisible, setModalVisible] = useState(false);
//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const debounceTimer = useRef(null);
//   const inputRef = useRef(null);

//   // Debounce search so we don't filter 4.5k items on every keystroke
//   const handleSearchChange = useCallback((text) => {
//     setSearch(text);
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//     debounceTimer.current = setTimeout(() => {
//       setDebouncedSearch(text);
//     }, 200); // 200ms debounce
//   }, []);

//   // useMemo so we only re-filter when debouncedSearch or items change
//   const filteredItems = useMemo(() => {
//     if (!debouncedSearch.trim()) {
//       // No search: show all but FlatList will window them
//       return items;
//     }
//     const q = debouncedSearch.toLowerCase().trim();
//     // Prioritize: starts-with first, then contains
//     const startsWith = [];
//     const contains = [];
//     for (const item of items) {
//       const label = item.label.toLowerCase();
//       if (label.startsWith(q)) startsWith.push(item);
//       else if (label.includes(q)) contains.push(item);
//     }
//     return [...startsWith, ...contains];
//   }, [debouncedSearch, items]);

//   const selectedLabel = value
//     ? items.find((i) => i.value === value)?.label ?? placeholder
//     : placeholder;

//   const openModal = useCallback(() => {
//     setSearch("");
//     setDebouncedSearch("");
//     setModalVisible(true);
//   }, []);

//   const closeModal = useCallback(() => {
//     setModalVisible(false);
//     setSearch("");
//     setDebouncedSearch("");
//     if (debounceTimer.current) clearTimeout(debounceTimer.current);
//   }, []);

//   const handleSelect = useCallback((item) => {
//     onChange(item.value);
//     closeModal();
//   }, [onChange, closeModal]);

//   const handleClearInline = useCallback((e) => {
//     e.stopPropagation();
//     onChange(null);
//   }, [onChange]);

//   const handleClearModal = useCallback(() => {
//     onChange(null);
//     closeModal();
//   }, [onChange, closeModal]);

//   // Memoized renderItem — critical for FlatList performance with large lists
//   const renderItem = useCallback(({ item }) => {
//     const isSelected = item.value === value;
//     return (
//       <TouchableOpacity
//         style={[
//           styles.optionItem,
//           isDark ? styles.darkOption : styles.lightOption,
//           isSelected && (isDark ? styles.darkSelectedOption : styles.lightSelectedOption),
//         ]}
//         onPress={() => handleSelect(item)}
//         activeOpacity={0.7}
//       >
//         <Text
//           style={[
//             styles.optionText,
//             isDark ? styles.darkText : styles.lightText,
//             isSelected && styles.selectedOptionText,
//           ]}
//           numberOfLines={2}
//         >
//           {item.label}
//         </Text>
//         {isSelected && (
//           <Ionicons name="checkmark-circle" size={18} color="#8A63D2" />
//         )}
//       </TouchableOpacity>
//     );
//   }, [value, isDark, handleSelect]);

//   // Key extractor memoized outside render
//   const keyExtractor = useCallback((item) => item.value, []);

//   // Empty component
//   const ListEmpty = useMemo(() => (
//     <View style={styles.noResults}>
//       <Ionicons name="search-outline" size={36} color={isDark ? "#555" : "#ccc"} />
//       <Text style={[styles.noResultsLabel, { color: isDark ? "#aaa" : "#888" }]}>
//         No results for "{debouncedSearch}"
//       </Text>
//     </View>
//   ), [debouncedSearch, isDark]);

//   // Result count header
//   const ListHeader = useMemo(() => {
//     if (!debouncedSearch.trim() || filteredItems.length === 0) return null;
//     return (
//       <Text style={[styles.resultCount, { color: isDark ? "#888" : "#aaa" }]}>
//         {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
//       </Text>
//     );
//   }, [debouncedSearch, filteredItems.length, isDark]);

//   return (
//     <>
//       {/* ── Trigger button ── */}
//       <TouchableOpacity
//         style={[
//           styles.pickerTrigger,
//           isDark ? styles.darkDropdown : styles.lightDropdown,
//         ]}
//         onPress={openModal}
//         activeOpacity={0.8}
//       >
//         <Text
//           style={[
//             styles.pickerTriggerText,
//             { color: value ? (isDark ? "#fff" : "#333") : (isDark ? "#666" : "#aaa") },
//           ]}
//           numberOfLines={1}
//         >
//           {selectedLabel}
//         </Text>
//         {value ? (
//           <TouchableOpacity onPress={handleClearInline} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//             <Ionicons name="close-circle" size={18} color={isDark ? "#888" : "#aaa"} />
//           </TouchableOpacity>
//         ) : (
//           <Ionicons name="chevron-down" size={18} color={isDark ? "#888" : "#aaa"} />
//         )}
//       </TouchableOpacity>

//       {/* ── Modal ── */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="slide"
//         onRequestClose={closeModal}
//         statusBarTranslucent
//       >
//         <TouchableWithoutFeedback onPress={closeModal}>
//           <View style={styles.modalOverlay} />
//         </TouchableWithoutFeedback>

//         <View style={[styles.modalSheet, isDark ? styles.darkModal : styles.lightModal]}>

//           {/* Modal header */}
//           <View style={[styles.modalHeader, { borderBottomColor: isDark ? "#2D2540" : "#eee" }]}>
//             <Text style={[styles.modalTitle, isDark ? styles.darkText : styles.lightText]}>
//               {label}
//             </Text>
//             <TouchableOpacity onPress={closeModal} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Ionicons name="close" size={22} color={isDark ? "#fff" : "#333"} />
//             </TouchableOpacity>
//           </View>

//           {/* Search bar inside modal */}
//           <View style={[styles.modalSearchWrap, isDark ? styles.darkModalSearch : styles.lightModalSearch]}>
//             <Ionicons name="search" size={17} color={isDark ? "#888" : "#aaa"} />
//             <TextInput
//               ref={inputRef}
//               style={[styles.modalSearchInput, { color: isDark ? "#fff" : "#333" }]}
//               placeholder={`Search ${label.toLowerCase()}...`}
//               placeholderTextColor={isDark ? "#555" : "#bbb"}
//               value={search}
//               onChangeText={handleSearchChange}
//               autoFocus
//               clearButtonMode="while-editing"
//               returnKeyType="search"
//             />
//             {search.length > 0 && (
//               <TouchableOpacity
//                 onPress={() => { setSearch(""); setDebouncedSearch(""); }}
//                 hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
//               >
//                 <Ionicons name="close-circle" size={17} color={isDark ? "#888" : "#aaa"} />
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Clear current selection */}
//           {value && (
//             <TouchableOpacity
//               style={[styles.clearSelectionBtn, isDark ? styles.darkClearBtn : styles.lightClearBtn]}
//               onPress={handleClearModal}
//             >
//               <Ionicons name="close-circle-outline" size={15} color="#8A63D2" />
//               <Text style={styles.clearSelectionText}>Clear selection</Text>
//             </TouchableOpacity>
//           )}

//           {/* The high-performance list */}
//           <FlatList
//             data={filteredItems}
//             keyExtractor={keyExtractor}
//             renderItem={renderItem}
//             ListHeaderComponent={ListHeader}
//             ListEmptyComponent={ListEmpty}
//             keyboardShouldPersistTaps="handled"
//             keyboardDismissMode="on-drag"
//             showsVerticalScrollIndicator={true}
//             // Performance tuning for 4500+ items:
//             initialNumToRender={20}       // only render 20 on open
//             maxToRenderPerBatch={20}      // render 20 more per scroll batch
//             windowSize={5}               // keep 5 "screens" of items in memory
//             removeClippedSubviews={true} // unmount off-screen items (Android)
//             updateCellsBatchingPeriod={50}
//             getItemLayout={(data, index) => ({
//               length: 54,   // fixed item height — critical for fast scrolling
//               offset: 54 * index,
//               index,
//             })}
//           />
//         </View>
//       </Modal>
//     </>
//   );
// };

// // ─── Main SearchPost Component ────────────────────────────────────────────────
// const SearchPost = () => {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [colleges, setColleges] = useState([]);
//   const [degrees, setDegrees] = useState([]);
//   const [years, setYears] = useState([]);

//   // Picker open states (for DropDownPicker — degree & year only)
//   const [degreeOpen, setDegreeOpen] = useState(false);
//   const [yearOpen, setYearOpen] = useState(false);

//   // Single filters object — mirrors web version exactly
//   const [filters, setFilters] = useState({
//     college: "",
//     degree: "",
//     year: "",
//     bookName: "",
//   });

//   const baseURL = useStore((state) => state.baseURL);
//   const darkMode = useStore((state) => state.darkMode);
//   const navigation = useNavigation();
//   const isDark = darkMode === true || darkMode === "true";

//   useEffect(() => {
//     fetchDropdownData();
//     fetchPosts();
//   }, []);

//   const fetchDropdownData = async () => {
//     try {
//       const [collegesRes, degreesRes, yearsRes] = await Promise.all([
//         axios.get(`${baseURL}/dropdown/colleges`),
//         axios.get(`${baseURL}/dropdown/degrees`),
//         axios.get(`${baseURL}/dropdown/years`),
//       ]);
//       setColleges(collegesRes.data.map((c) => ({ label: c.name, value: c.name })));
//       setDegrees(degreesRes.data.map((d) => ({ label: d.name, value: d.name })));
//       setYears(yearsRes.data.map((y) => ({ label: y.year_name, value: y.year_name })));
//     } catch (err) {
//       console.error("Error fetching dropdowns:", err);
//     }
//   };

//   const fetchPosts = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`${baseURL}/api/users`);
//       const shuffled = response.data.sort(() => Math.random() - 0.5).slice(0, 100);
//       setPosts(shuffled);
//       setFilteredPosts(shuffled);
//     } catch (err) {
//       setError("Failed to load posts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Sequential filter logic (exact mirror of web) ─────────────────────────
//   const handleFilterChange = useCallback((field, value) => {
//     const newFilters = { ...filters, [field]: value ?? "" };
//     setFilters(newFilters);

//     let filtered = posts;

//     if (newFilters.college) {
//       filtered = filtered.filter((p) => p.college_name === newFilters.college);
//     }
//     if (newFilters.degree) {
//       filtered = filtered.filter((p) => p.degree_name === newFilters.degree);
//     }
//     if (newFilters.year) {
//       filtered = filtered.filter((p) => p.year === newFilters.year);
//     }
//     if (newFilters.bookName) {
//       filtered = filtered.filter((p) =>
//         p.book_name.toLowerCase().includes(newFilters.bookName.toLowerCase())
//       );
//     }

//     setFilteredPosts(filtered.slice(0, 100));
//   }, [filters, posts]);

//   const clearFilters = useCallback(() => {
//     setFilters({ college: "", degree: "", year: "", bookName: "" });
//     setFilteredPosts(posts);
//   }, [posts]);

//   const hasFilters =
//     filters.college || filters.degree || filters.year || filters.bookName;

//   // ── Render post card ───────────────────────────────────────────────────────
//   const renderItem = useCallback(({ item }) => {
//     const profilePic = item.picture
//       ? item.picture.startsWith("http")
//         ? item.picture
//         : `${baseURL}/uploads/${item.picture}`
//       : null;

//     const postImage =
//       item.images && item.images.length > 0
//         ? `${baseURL}/uploads/${item.images[0]}`
//         : null;

//     return (
//       <TouchableOpacity
//         style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}
//         onPress={() => navigation.navigate("BookPostDetails", { id: item.id })}
//         activeOpacity={0.85}
//       >
//         {/* Avatar + username */}
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

//         {/* Image + price */}
//         <View style={styles.imageContainer}>
//           {postImage ? (
//             <Image source={{ uri: postImage }} style={styles.postImage} />
//           ) : (
//             <View style={[styles.postImage, styles.placeholderImage, isDark ? styles.darkPlaceholder : styles.lightPlaceholder]}>
//               <Ionicons name="image-outline" size={40} color={isDark ? "#aaa" : "#555"} />
//             </View>
//           )}
//           <View style={styles.priceTag}>
//             <Text style={styles.priceText}>₹{item.price}</Text>
//           </View>
//         </View>

//         {/* Body */}
//         <View style={styles.cardBody}>
//           <Text style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]} numberOfLines={2}>
//             {item.book_name}
//           </Text>
//           <View style={styles.infoRow}>
//             <Ionicons name="book-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
//               {item.degree_name} • {item.year}
//             </Text>
//           </View>
//           <View style={styles.infoRow}>
//             <Ionicons name="location-outline" size={14} color={isDark ? "#aaa" : "#666"} />
//             <Text style={[styles.subtitle, isDark ? styles.darkSubtitle : styles.lightSubtitle]} numberOfLines={1}>
//               {item.college_name}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   }, [isDark, baseURL, navigation]);

//   const postKeyExtractor = useCallback((item) => item.id.toString(), []);

//   // ── UI ─────────────────────────────────────────────────────────────────────
//   return (
//     <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>

//       {/* Header */}
//       <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
//           Find Books
//         </Text>
//         {hasFilters ? (
//           <TouchableOpacity onPress={clearFilters} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//             <Text style={styles.clearText}>Clear</Text>
//           </TouchableOpacity>
//         ) : (
//           <View style={{ width: 44 }} />
//         )}
//       </View>

//       {/* Filters */}
//       <View style={styles.filtersContainer}>

//         {/* Book name search */}
//         <View style={[styles.searchBarContainer, isDark ? styles.darkDropdown : styles.lightDropdown]}>
//           <Ionicons name="search" size={19} color={isDark ? "#888" : "#aaa"} />
//           <TextInput
//             style={[styles.searchInput, { color: isDark ? "#fff" : "#333" }]}
//             placeholder="Search book name"
//             placeholderTextColor={isDark ? "#555" : "#bbb"}
//             value={filters.bookName}
//             onChangeText={(text) => handleFilterChange("bookName", text)}
//           />
//           {filters.bookName.length > 0 && (
//             <TouchableOpacity onPress={() => handleFilterChange("bookName", "")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
//               <Ionicons name="close-circle" size={17} color={isDark ? "#888" : "#aaa"} />
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* College — uses high-performance SearchablePicker */}
//         <SearchablePicker
//           label="College"
//           placeholder="Select College"
//           items={colleges}
//           value={filters.college || null}
//           onChange={(val) => handleFilterChange("college", val)}
//           isDark={isDark}
//         />

//         {/* Degree + Year side by side — small lists, DropDownPicker is fine */}
//         <View style={styles.dropdownRowSides}>
//           <View style={[styles.halfWrapper, { zIndex: 2000 }]}>
//             <DropDownPicker
//               open={degreeOpen}
//               value={filters.degree || null}
//               items={degrees}
//               setOpen={(open) => {
//                 setDegreeOpen(open);
//                 if (open) setYearOpen(false);
//               }}
//               setValue={(callback) => {
//                 const newVal = typeof callback === "function"
//                   ? callback(filters.degree || null)
//                   : callback;
//                 handleFilterChange("degree", newVal ?? "");
//               }}
//               setItems={setDegrees}
//               placeholder="Degree"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={[styles.dropdownText, isDark ? styles.darkText : styles.lightText]}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={2000}
//               zIndexInverse={1000}
//               searchable
//               searchPlaceholder="Search..."
//               listMode="MODAL"
//               theme={isDark ? "DARK" : "LIGHT"}
//             />
//           </View>
//           <View style={[styles.halfWrapper, { zIndex: 1000 }]}>
//             <DropDownPicker
//               open={yearOpen}
//               value={filters.year || null}
//               items={years}
//               setOpen={(open) => {
//                 setYearOpen(open);
//                 if (open) setDegreeOpen(false);
//               }}
//               setValue={(callback) => {
//                 const newVal = typeof callback === "function"
//                   ? callback(filters.year || null)
//                   : callback;
//                 handleFilterChange("year", newVal ?? "");
//               }}
//               setItems={setYears}
//               placeholder="Year"
//               style={[styles.dropdown, isDark ? styles.darkDropdown : styles.lightDropdown]}
//               textStyle={[styles.dropdownText, isDark ? styles.darkText : styles.lightText]}
//               dropDownContainerStyle={[styles.dropdownContainer, isDark ? styles.darkDropdownContainer : styles.lightDropdownContainer]}
//               zIndex={1000}
//               zIndexInverse={2000}
//               listMode="MODAL"
//               theme={isDark ? "DARK" : "LIGHT"}
//             />
//           </View>
//         </View>
//       </View>

//       {/* Results count */}
//       <View style={styles.resultsHeader}>
//         <Text style={[styles.resultsText, isDark ? styles.darkText : styles.lightText]}>
//           {loading ? "Loading..." : `${filteredPosts.length} Results`}
//         </Text>
//       </View>

//       {/* Body */}
//       {loading ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#8A63D2" />
//         </View>
//       ) : error ? (
//         <View style={styles.centerContainer}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : filteredPosts.length === 0 ? (
//         <View style={styles.centerContainer}>
//           <Ionicons name="search-outline" size={64} color={isDark ? "#555" : "#ccc"} />
//           <Text style={[styles.noResultsText, isDark ? styles.darkText : styles.lightText]}>
//             No books found
//           </Text>
//           <Text style={styles.noResultsSub}>Try adjusting your filters</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredPosts}
//           keyExtractor={postKeyExtractor}
//           renderItem={renderItem}
//           numColumns={2}
//           contentContainerStyle={styles.listContainer}
//           columnWrapperStyle={styles.columnWrapper}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         />
//       )}
//     </SafeAreaView>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   lightContainer: { backgroundColor: "#F7F3FF" },
//   darkContainer: { backgroundColor: "#1A1625" },

//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//   },
//   lightHeader: { backgroundColor: "#fff", borderBottomColor: "#eee" },
//   darkHeader: { backgroundColor: "#2A2333", borderBottomColor: "#333" },
//   backButton: { padding: 4 },
//   headerTitle: { fontSize: 20, fontWeight: "bold" },
//   clearText: { color: "#8A63D2", fontWeight: "600", fontSize: 15 },

//   filtersContainer: { padding: 16, paddingBottom: 8, gap: 10 },

//   // Book name search bar
//   searchBarContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 48,
//     gap: 8,
//     borderWidth: 1,
//   },
//   searchInput: { flex: 1, fontSize: 15, height: "100%" },

//   // Picker trigger (college)
//   pickerTrigger: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     borderRadius: 12,
//     paddingHorizontal: 14,
//     height: 48,
//     borderWidth: 1,
//   },
//   pickerTriggerText: { flex: 1, fontSize: 15, marginRight: 8 },

//   // Shared dropdown theme
//   lightDropdown: { backgroundColor: "#fff", borderColor: "#e0e0e0" },
//   darkDropdown: { backgroundColor: "#2A2333", borderColor: "#444" },
//   dropdownText: { fontSize: 14 },

//   // Side-by-side row
//   dropdownRowSides: { flexDirection: "row", gap: 10 },
//   halfWrapper: { flex: 1 },
//   dropdown: { borderRadius: 12, borderWidth: 1, minHeight: 48 },
//   dropdownContainer: { borderWidth: 1, borderRadius: 12, marginTop: 4 },
//   lightDropdownContainer: { backgroundColor: "#fff", borderColor: "#e0e0e0" },
//   darkDropdownContainer: { backgroundColor: "#2A2333", borderColor: "#444" },

//   // Modal
//   modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)" },
//   modalSheet: {
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: height * 0.82,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//   },
//   lightModal: { backgroundColor: "#fff" },
//   darkModal: { backgroundColor: "#1E1A2E" },

//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 20,
//     paddingTop: 16,
//     paddingBottom: 14,
//     borderBottomWidth: 1,
//   },
//   modalTitle: { fontSize: 17, fontWeight: "700" },

//   // Modal search bar
//   modalSearchWrap: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 14,
//     marginTop: 12,
//     marginBottom: 6,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 46,
//     gap: 8,
//     borderWidth: 1,
//   },
//   lightModalSearch: { backgroundColor: "#F7F3FF", borderColor: "#e0e0e0" },
//   darkModalSearch: { backgroundColor: "#2A2333", borderColor: "#444" },
//   modalSearchInput: { flex: 1, fontSize: 15 },

//   // Result count header
//   resultCount: {
//     fontSize: 12,
//     paddingHorizontal: 20,
//     paddingVertical: 6,
//   },

//   // Clear selection button
//   clearSelectionBtn: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 14,
//     marginBottom: 6,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     borderRadius: 10,
//     gap: 8,
//   },
//   lightClearBtn: { backgroundColor: "#F3E8FF" },
//   darkClearBtn: { backgroundColor: "#2D2240" },
//   clearSelectionText: { color: "#8A63D2", fontWeight: "600", fontSize: 14 },

//   // List item — FIXED height (54px) matches getItemLayout
//   optionItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     height: 54,
//     paddingHorizontal: 20,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "rgba(150,150,150,0.1)",
//   },
//   lightOption: { backgroundColor: "transparent" },
//   darkOption: { backgroundColor: "transparent" },
//   lightSelectedOption: { backgroundColor: "#F3E8FF" },
//   darkSelectedOption: { backgroundColor: "#2D2240" },
//   optionText: { flex: 1, fontSize: 14, marginRight: 8 },
//   selectedOptionText: { color: "#8A63D2", fontWeight: "600" },

//   // No results
//   noResults: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 60, gap: 10 },
//   noResultsLabel: { fontSize: 14 },

//   // Results header
//   resultsHeader: { paddingHorizontal: 16, paddingTop: 6, paddingBottom: 8 },
//   resultsText: { fontSize: 16, fontWeight: "600" },

//   // Center container
//   centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
//   errorText: { color: "#d32f2f" },
//   noResultsText: { fontSize: 18, fontWeight: "bold", marginTop: 16 },
//   noResultsSub: { color: "#888", marginTop: 8 },

//   // Post list
//   listContainer: { padding: 12, paddingBottom: 30 },
//   columnWrapper: { justifyContent: "space-between" },

//   // Post card
//   card: { width: (width - 36) / 2, marginBottom: 12, borderRadius: 12, overflow: "hidden", elevation: 3 },
//   lightCard: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
//   darkCard: { backgroundColor: "#2d3748", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
//   cardHeader: { flexDirection: "row", alignItems: "center", padding: 8, borderBottomWidth: 1, borderBottomColor: "rgba(150,150,150,0.1)" },
//   avatar: { width: 24, height: 24, borderRadius: 12, marginRight: 6 },
//   placeholderAvatar: { alignItems: "center", justifyContent: "center" },
//   lightPlaceholder: { backgroundColor: "#e0e0e0" },
//   darkPlaceholder: { backgroundColor: "#4a5568" },
//   userName: { fontSize: 12, fontWeight: "500", flex: 1 },
//   imageContainer: { position: "relative" },
//   postImage: { width: "100%", height: 140, resizeMode: "cover" },
//   placeholderImage: { alignItems: "center", justifyContent: "center" },
//   priceTag: { position: "absolute", bottom: 8, right: 8, backgroundColor: "#8A63D2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
//   priceText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
//   cardBody: { padding: 10 },
//   title: { fontSize: 14, fontWeight: "bold", marginBottom: 6, height: 38 },
//   darkTitle: { color: "#fff" },
//   lightTitle: { color: "#222" },
//   infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
//   subtitle: { fontSize: 11, marginLeft: 4, flex: 1 },
//   darkSubtitle: { color: "#aaa" },
//   lightSubtitle: { color: "#666" },
//   lightText: { color: "#333" },
//   darkText: { color: "#fff" },
// });

// export default SearchPost;










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
    setSearch("");
    setDebouncedSearch("");
    setModalVisible(true);
  }, []);

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
          <Ionicons name="checkmark-circle" size={18} color="#8A63D2" />
        )}
      </TouchableOpacity>
    );
  }, [value, isDark, handleSelect]);

  const keyExtractor = useCallback((item) => item.value, []);

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
        ]}
        onPress={openModal}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.pickerTriggerText,
            { color: value ? (isDark ? "#fff" : "#333") : (isDark ? "#666" : "#aaa") },
          ]}
          numberOfLines={1}
        >
          {selectedLabel}
        </Text>
        {value ? (
          <TouchableOpacity
            onPress={handleClearInline}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color={isDark ? "#888" : "#aaa"} />
          </TouchableOpacity>
        ) : (
          <Ionicons name="chevron-down" size={18} color={isDark ? "#888" : "#aaa"} />
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
              <Ionicons name="close-circle-outline" size={15} color="#8A63D2" />
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

// ─── Main SearchPost Component ────────────────────────────────────────────────
const SearchPost = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [colleges, setColleges] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [years, setYears] = useState([]);

  // Single filters object — mirrors web version exactly
  const [filters, setFilters] = useState({
    college: "",
    degree: "",
    year: "",
    bookName: "",
  });

  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();
  const isDark = darkMode === true || darkMode === "true";

  useEffect(() => {
    fetchDropdownData();
    fetchPosts();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [collegesRes, degreesRes, yearsRes] = await Promise.all([
        axios.get(`${baseURL}/dropdown/colleges`),
        axios.get(`${baseURL}/dropdown/degrees`),
        axios.get(`${baseURL}/dropdown/years`),
      ]);
      setColleges(collegesRes.data.map((c) => ({ label: c.name, value: c.name })));
      setDegrees(degreesRes.data.map((d) => ({ label: d.name, value: d.name })));
      setYears(yearsRes.data.map((y) => ({ label: y.year_name, value: y.year_name })));
    } catch (err) {
      console.error("Error fetching dropdowns:", err);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseURL}/api/users`);
      const shuffled = response.data.sort(() => Math.random() - 0.5).slice(0, 100);
      setPosts(shuffled);
      setFilteredPosts(shuffled);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  // ── Sequential filter logic (exact mirror of web) ─────────────────────────
  const handleFilterChange = useCallback((field, value) => {
    const newFilters = { ...filters, [field]: value ?? "" };
    setFilters(newFilters);

    let filtered = posts;

    if (newFilters.college) {
      filtered = filtered.filter((p) => p.college_name === newFilters.college);
    }
    if (newFilters.degree) {
      filtered = filtered.filter((p) => p.degree_name === newFilters.degree);
    }
    if (newFilters.year) {
      filtered = filtered.filter((p) => p.year === newFilters.year);
    }
    if (newFilters.bookName) {
      filtered = filtered.filter((p) =>
        p.book_name.toLowerCase().includes(newFilters.bookName.toLowerCase())
      );
    }

    setFilteredPosts(filtered.slice(0, 100));
  }, [filters, posts]);

  const clearFilters = useCallback(() => {
    setFilters({ college: "", degree: "", year: "", bookName: "" });
    setFilteredPosts(posts);
  }, [posts]);

  const hasFilters =
    filters.college || filters.degree || filters.year || filters.bookName;

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
        onPress={() => navigation.navigate("BookPostDetails", { id: item.id })}
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
              <Ionicons name="image-outline" size={40} color={isDark ? "#aaa" : "#555"} />
            </View>
          )}
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>₹{item.price}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.cardBody}>
          <Text style={[styles.title, isDark ? styles.darkTitle : styles.lightTitle]} numberOfLines={2}>
            {item.book_name}
          </Text>
          <View style={styles.infoRow}>
            <Ionicons name="book-outline" size={14} color={isDark ? "#aaa" : "#666"} />
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
          Find Books
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

        {/* Book name search */}
        <View style={[styles.searchBarContainer, isDark ? styles.darkDropdown : styles.lightDropdown]}>
          <Ionicons name="search" size={19} color={isDark ? "#888" : "#aaa"} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? "#fff" : "#333" }]}
            placeholder="Search book name"
            placeholderTextColor={isDark ? "#555" : "#bbb"}
            value={filters.bookName}
            onChangeText={(text) => handleFilterChange("bookName", text)}
          />
          {filters.bookName.length > 0 && (
            <TouchableOpacity
              onPress={() => handleFilterChange("bookName", "")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={17} color={isDark ? "#888" : "#aaa"} />
            </TouchableOpacity>
          )}
        </View>

        {/* College — SearchablePicker */}
        <SearchablePicker
          label="College"
          placeholder="Select College"
          items={colleges}
          value={filters.college || null}
          onChange={(val) => handleFilterChange("college", val)}
          isDark={isDark}
        />

        {/* Degree + Year side by side — both now use SearchablePicker */}
        <View style={styles.dropdownRowSides}>
          <View style={styles.halfWrapper}>
            <SearchablePicker
              label="Degree"
              placeholder="Select Degree"
              items={degrees}
              value={filters.degree || null}
              onChange={(val) => handleFilterChange("degree", val)}
              isDark={isDark}
            />
          </View>
          <View style={styles.halfWrapper}>
            <SearchablePicker
              label="Year"
              placeholder="Select Year"
              items={years}
              value={filters.year || null}
              onChange={(val) => handleFilterChange("year", val)}
              isDark={isDark}
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
          <ActivityIndicator size="large" color="#8A63D2" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : filteredPosts.length === 0 ? (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color={isDark ? "#555" : "#ccc"} />
          <Text style={[styles.noResultsText, isDark ? styles.darkText : styles.lightText]}>
            No books found
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
  lightContainer: { backgroundColor: "#F7F3FF" },
  darkContainer: { backgroundColor: "#1A1625" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lightHeader: { backgroundColor: "#fff", borderBottomColor: "#eee" },
  darkHeader: { backgroundColor: "#2A2333", borderBottomColor: "#333" },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  clearText: { color: "#8A63D2", fontWeight: "600", fontSize: 15 },

  filtersContainer: { padding: 16, paddingBottom: 8, gap: 10 },

  // Book name search bar
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, height: "100%" },

  // Picker trigger — used by all three pickers
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
  },
  pickerTriggerText: { flex: 1, fontSize: 15, marginRight: 8 },

  // Shared dropdown theme
  lightDropdown: { backgroundColor: "#fff", borderColor: "#e0e0e0" },
  darkDropdown: { backgroundColor: "#2A2333", borderColor: "#444" },

  // Side-by-side row (degree + year)
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
  lightModalSearch: { backgroundColor: "#F7F3FF", borderColor: "#e0e0e0" },
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

  // Center container (loading / error / empty state)
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
  priceTag: { position: "absolute", bottom: 8, right: 8, backgroundColor: "#8A63D2", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  priceText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  cardBody: { padding: 10 },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 6, height: 38 },
  darkTitle: { color: "#fff" },
  lightTitle: { color: "#222" },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  subtitle: { fontSize: 11, marginLeft: 4, flex: 1 },
  darkSubtitle: { color: "#aaa" },
  lightSubtitle: { color: "#666" },
  lightText: { color: "#333" },
  darkText: { color: "#fff" },
});

export default SearchPost;