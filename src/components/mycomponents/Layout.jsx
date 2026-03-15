import React, { useState } from 'react';
import { View, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 992; // Tablet/Desktop breakpoint
  
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sidebar (Only visible on large screens or when explicitly opened on mobile) */}
        {(isLargeScreen || sidebarOpen) && (
           <Sidebar 
              isMobile={!isLargeScreen} 
              onClose={() => setSidebarOpen(false)} 
           />
        )}

        <View style={styles.contentWrapper}>
          {/* Header (Visible on mobile, toggles sidebar) */}
          {!isLargeScreen && <Header toggleSidebar={toggleSidebar} />}
          
          {/* Main Content Area */}
          <View style={styles.mainContent}>
            {children}
          </View>

          {/* Footer (Mobile Bottom Navigation) */}
          {!isLargeScreen && <Footer />}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', // Match React context theme base
  },
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    position: 'relative',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#f8f9fa', // Background color for content
  }
});

export default Layout;
