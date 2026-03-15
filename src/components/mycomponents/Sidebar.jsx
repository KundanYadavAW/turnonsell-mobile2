import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView, 
  useWindowDimensions 
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../../src/zustand/store';

// We require logo image safely
const mainLogo = require('../../../assets/logo.png');

const Sidebar = ({ isMobile, onClose }) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  
  // Zustand State
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const loggedIn = useStore((state) => state.isLoggedin);
  const logOut = useStore((state) => state.logOut);
  const userType = useStore((state) => state.userType);

  const [searchExpanded, setSearchExpanded] = useState(false);
  const [uploadExpanded, setUploadExpanded] = useState(false);

  // Common Nav Handler
  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
    if (isMobile && onClose) onClose();
  };

  // Auth Guards
  const requireAuthNavigate = (screenName) => {
    if (loggedIn) {
      navigateTo(screenName);
    } else {
      alert("You need to login to perform this action.");
    }
  };

  const handleLogout = async () => {
    await logOut();
    alert("You have been logged out.");
    navigateTo("Login");
  };

  const isDark = darkMode === true || darkMode === "true";

  return (
    <View style={[styles.sidebarContainer, isDark ? styles.darkBg : styles.lightBg, isMobile && styles.mobileAbsolute]}>
      {/* Header / Logo */}
      <View style={styles.header}>
        <Image source={mainLogo} style={styles.logo} />
        <Text style={[styles.brandText, isDark ? styles.darkText : styles.lightText]}>TurnOnSell</Text>
        {isMobile && (
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.menuContainer}>
        {/* Home */}
        <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo('Main')}>
          <Ionicons name="home" size={22} color={isDark ? "#fff" : "#1976d2"} />
          <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>Home</Text>
        </TouchableOpacity>

        {/* Search Collapsible */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setSearchExpanded(!searchExpanded)}>
          <Ionicons name="search" size={22} color={isDark ? "#fff" : "#0288d1"} />
          <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>Search</Text>
          <Ionicons name={searchExpanded ? "chevron-up" : "chevron-down"} size={20} color={isDark ? "#ccc" : "#666"} />
        </TouchableOpacity>
        
        {searchExpanded && (
          <View style={styles.subMenuGroup}>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => navigateTo("SearchPost")}>
               <Ionicons name="book" size={20} color={isDark ? "#fff" : "#4caf50"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Books</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => navigateTo("SearchClothPost")}>
               <Ionicons name="shirt" size={20} color={isDark ? "#fff" : "#ff9800"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Fashion</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => navigateTo("SearchStationaryPost")}>
               <MaterialIcons name="category" size={20} color={isDark ? "#fff" : "#9c27b0"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Electronics</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => navigateTo("SearchFootwearPost")}>
               <Ionicons name="footsteps" size={20} color={isDark ? "#fff" : "#e91e63"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Footwears</Text>
             </TouchableOpacity>
          </View>
        )}

        {/* Upload Collapsible */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setUploadExpanded(!uploadExpanded)}>
          <Ionicons name="add-circle" size={22} color={isDark ? "#fff" : "#ff5722"} />
          <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>Upload</Text>
          <Ionicons name={uploadExpanded ? "chevron-up" : "chevron-down"} size={20} color={isDark ? "#ccc" : "#666"} />
        </TouchableOpacity>

        {uploadExpanded && (
          <View style={styles.subMenuGroup}>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => requireAuthNavigate("UploadForm")}>
               <Ionicons name="book" size={20} color={isDark ? "#fff" : "#4caf50"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Books</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => requireAuthNavigate("UploadClothForm")}>
               <Ionicons name="shirt" size={20} color={isDark ? "#fff" : "#ff9800"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Fashion</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => requireAuthNavigate("UploadStationaryForm")}>
               <MaterialIcons name="category" size={20} color={isDark ? "#fff" : "#9c27b0"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Electronics</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.subMenuItem} onPress={() => requireAuthNavigate("UploadFootwearForm")}>
               <Ionicons name="footsteps" size={20} color={isDark ? "#fff" : "#e91e63"} />
               <Text style={[styles.subMenuText, isDark ? styles.darkText : styles.lightText]}>Footwears</Text>
             </TouchableOpacity>
          </View>
        )}

        {/* Profile */}
        <TouchableOpacity style={styles.menuItem} onPress={() => requireAuthNavigate("Profile")}>
          <Ionicons name="person" size={22} color={isDark ? "#fff" : "#4caf50"} />
          <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>Profile</Text>
        </TouchableOpacity>

        {/* Admin Access */}
        {userType === "superadmin" && (
           <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("GetAllData")}>
             <MaterialIcons name="dashboard" size={22} color={isDark ? "#fff" : "#f44336"} />
             <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>User Dashboard</Text>
           </TouchableOpacity>
        )}
      </ScrollView>

      {/* Footer / Settings items */}
      <View style={styles.footerSection}>
         <TouchableOpacity style={styles.menuItem} onPress={() => setDarkMode(!darkMode)}>
            <Ionicons name={isDark ? "sunny" : "moon"} size={22} color={isDark ? "#fff" : "#9e9e9e"} />
            <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>
               {isDark ? "Light Mode" : "Dark Mode"}
            </Text>
         </TouchableOpacity>

         {loggedIn ? (
            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons name="log-out" size={22} color={isDark ? "#fff" : "#f44336"} />
              <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>Logout</Text>
            </TouchableOpacity>
         ) : (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("Login")}>
                <Ionicons name="log-in" size={22} color={isDark ? "#fff" : "#2196f3"} />
                <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("SignUp")}>
                <MaterialIcons name="app-registration" size={22} color={isDark ? "#fff" : "#ff9800"} />
                <Text style={[styles.menuText, isDark ? styles.darkText : styles.lightText]}>Signup</Text>
              </TouchableOpacity>
            </>
         )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    width: 260,
    height: '100%',
    borderRightWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
  },
  mobileAbsolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  lightBg: {
    backgroundColor: '#ffffff',
    borderRightColor: '#e0e0e0',
  },
  darkBg: {
    backgroundColor: '#1E1E1E',
    borderRightColor: '#333333',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
    fontWeight: '500',
  },
  subMenuGroup: {
    paddingLeft: 46,
    marginBottom: 8,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  subMenuText: {
    fontSize: 14,
    marginLeft: 12,
    fontWeight: '400',
  },
  footerSection: {
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 10,
  }
});

export default Sidebar;
