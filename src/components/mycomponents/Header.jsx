import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStore } from '../../../src/zustand/store';

const mainLogo = require('../../../assets/images/logo.png');

const Header = ({ toggleSidebar }) => {
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  
  const isDark = darkMode === true || darkMode === "true";

  return (
    <View style={[styles.headerContainer, isDark ? styles.darkBg : styles.lightBg]}>
      {/* Brand logo and text */}
      <View style={styles.brandContainer}>
        <Image source={mainLogo} style={styles.logo} />
        <Text style={[styles.brandText, isDark ? styles.darkText : styles.lightText]}>TurnOnSell</Text>
      </View>

      <View style={styles.actionsContainer}>
        {/* Dark Mode Toggle */}
        <TouchableOpacity style={styles.iconButton} onPress={() => setDarkMode(!darkMode)}>
          <Ionicons name={isDark ? "sunny" : "moon"} size={24} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
        
        {/* Mobile Menu Toggle */}
        <TouchableOpacity style={styles.iconButton} onPress={toggleSidebar}>
          <Ionicons name="menu" size={28} color={isDark ? "#fff" : "#333"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 10,
  },
  lightBg: {
    backgroundColor: '#ffffff',
  },
  darkBg: {
    backgroundColor: '#1E1E1E',
  },
  lightText: {
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  }
});

export default Header;
