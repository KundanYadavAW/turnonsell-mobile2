import React from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useStore } from '../../../src/zustand/store';



// Import our newly ported display components
import GetBookPost from './GetBookPost';
import GetClothPost from './GetClothPost';
import GetStationaryPost from './GetStationaryPost';
import GetFootwearPost from './GetFootwearPost';

const GetData = () => {
  const darkMode = useStore((state) => state.darkMode);
  const isDark = darkMode === true || darkMode === "true";

  return (
    <SafeAreaView style={[styles.safeArea, isDark ? styles.darkContainer : styles.lightContainer]}>
      {/* Configure StatusBar based on theme */}
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={isDark ? "#1a1a2e" : "#f5f7fa"}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <GetBookPost />
        <GetClothPost />
        <GetStationaryPost />
        <GetFootwearPost />
        
        {/* Bottom padding to ensure last item is scrollable above navigation/tab bars */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  lightContainer: { backgroundColor: "#f5f7fa" },
  darkContainer: { backgroundColor: "#1a1a2e" },
  scrollContainer: {
    paddingVertical: 10,
  }
});

export default GetData;




