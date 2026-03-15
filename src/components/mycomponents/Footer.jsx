import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useStore } from '../../../src/zustand/store';

const Footer = () => {
  const navigation = useNavigation();
  const darkMode = useStore((state) => state.darkMode);
  const loggedIn = useStore((state) => state.isLoggedin);
  
  const [showOptions, setShowOptions] = useState(false);
  const isDark = darkMode === true || darkMode === "true";

  // Common Nav Handler
  const navigateTo = (screenName) => {
    navigation.navigate(screenName);
    setShowOptions(false);
  };

  const requireAuthNavigate = (screenName) => {
    if (loggedIn) {
      navigateTo(screenName);
    } else {
      alert("You need to login to perform this action.");
    }
  };

  return (
    <>
      <View style={[styles.footerContainer, isDark ? styles.darkBg : styles.lightBg]}>
        
        {/* Home Button */}
        <TouchableOpacity style={styles.tabButton} onPress={() => navigateTo('Main')}>
          <Ionicons name="home" size={24} color={isDark ? "#fff" : "#495057"} />
          <Text style={[styles.tabLabel, isDark ? styles.darkText : styles.lightText]}>Home</Text>
        </TouchableOpacity>

        {/* Upload/Add Button */}
        <TouchableOpacity style={styles.tabButton} onPress={() => setShowOptions(true)}>
          <View style={[styles.addButton, isDark ? styles.darkAdd : styles.lightAdd]}>
            <Ionicons name="add" size={32} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Profile Button */}
        <TouchableOpacity style={styles.tabButton} onPress={() => requireAuthNavigate('Profile')}>
          <Ionicons name="person" size={24} color={isDark ? "#fff" : "#495057"} />
          <Text style={[styles.tabLabel, isDark ? styles.darkText : styles.lightText]}>Profile</Text>
        </TouchableOpacity>

      </View>

      {/* Upload Options Modal Overlay */}
      <Modal visible={showOptions} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowOptions(false)}>
          <View style={[styles.optionsContainer, isDark ? styles.darkOptions : styles.lightOptions]}>
            <Text style={[styles.optionsTitle, isDark ? styles.darkText : styles.lightText]}>Upload Category</Text>
            
            <View style={styles.optionsGrid}>
               <TouchableOpacity style={styles.optionButton} onPress={() => requireAuthNavigate("UploadForm")}>
                 <Ionicons name="book" size={28} color="#4caf50" />
                 <Text style={[styles.optionLabel, isDark ? styles.darkText : styles.lightText]}>Books</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.optionButton} onPress={() => requireAuthNavigate("UploadClothForm")}>
                 <Ionicons name="shirt" size={28} color="#ff9800" />
                 <Text style={[styles.optionLabel, isDark ? styles.darkText : styles.lightText]}>Fashion</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.optionButton} onPress={() => requireAuthNavigate("UploadStationaryForm")}>
                 <MaterialIcons name="category" size={28} color="#9c27b0" />
                 <Text style={[styles.optionLabel, isDark ? styles.darkText : styles.lightText]}>Electronics</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.optionButton} onPress={() => requireAuthNavigate("UploadFootwearForm")}>
                 <Ionicons name="footsteps" size={28} color="#e91e63" />
                 <Text style={[styles.optionLabel, isDark ? styles.darkText : styles.lightText]}>Footwears</Text>
               </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowOptions(false)}>
                <Text style={styles.closeModalText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 24, // Safe area padding
    paddingTop: 10,
    borderTopWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  lightBg: {
    backgroundColor: '#ffffff',
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  darkBg: {
    backgroundColor: '#1E1E1E',
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  lightText: {
    color: '#495057',
  },
  darkText: {
    color: '#fff',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20, // Push it up slightly above the bar
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  lightAdd: {
    backgroundColor: '#6366f1', // Indigo color for primary
  },
  darkAdd: {
    backgroundColor: '#4f46e5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  optionsContainer: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
  },
  lightOptions: {
    backgroundColor: '#ffffff',
  },
  darkOptions: {
    backgroundColor: '#1E1E1E',
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(150,150,150,0.1)',
    marginBottom: 16,
  },
  optionLabel: {
    marginTop: 8,
    fontWeight: '600',
  },
  closeModalButton: {
    marginTop: 10,
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255,0,0,0.1)',
    borderRadius: 12,
  },
  closeModalText: {
    color: '#f44336',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Footer;
