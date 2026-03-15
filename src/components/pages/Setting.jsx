import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStore } from '../../../src/zustand/store';
import Icon from 'react-native-vector-icons/MaterialIcons';



const Setting = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigation();

  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const setIsLoggedin = useStore((state) => state.isLoggedin);

  const isDark = darkMode === true || darkMode === "true";

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you absolutely sure you want to delete your account?\n\nThis action cannot be undone! All your posts and data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Delete Forever",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              const response = await axios.delete(`${baseURL}/api/deleteaccount`, {
                headers: { Authorization: `Bearer ${accessToken}` },
              });

              Alert.alert("Success", response.data.message || "Account deleted successfully.");
              
              // Clear auth tokens
              await AsyncStorage.removeItem("token");
              await AsyncStorage.clear();
              setIsLoggedin(false);
              
              // Navigate to login
              navigate.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              const errMsg = error.response?.data?.message || "Something went wrong!";
              Alert.alert("Error", errMsg);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.card, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "rgba(138,43,226,0.1)" }]}>
          
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Icon name="settings" size={40} color="#fff" />
            </View>
            <Text style={[styles.title, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>Account Settings</Text>
            <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#666" }]}>
              Manage your account security and preferences
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? "#333" : "rgba(138,43,226,0.1)" }]} />

          {/* Security Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Icon name="security" size={24} color={isDark ? "#bb86fc" : "#6A1B9A"} />
              <Text style={[styles.sectionTitle, { color: isDark ? "#fff" : "#333" }]}> Security</Text>
            </View>

            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={() => navigate.navigate("ChangePassword")}
            >
              <Icon name="lock" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.primaryButtonText}>Change Password</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionDesc, { color: isDark ? "#aaa" : "#666" }]}>
              Update your password to keep your account secure
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: isDark ? "#333" : "rgba(138,43,226,0.1)" }]} />

          {/* Danger Zone */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Icon name="warning" size={24} color="#ff4757" />
              <Text style={[styles.sectionTitle, { color: "#ff4757" }]}> Danger Zone</Text>
            </View>

            <View style={[styles.warningBox, { backgroundColor: isDark ? "rgba(255,193,7,0.1)" : "rgba(255,193,7,0.05)", borderColor: "rgba(255,193,7,0.3)" }]}>
              <View style={styles.warningTitleContainer}>
                <Icon name="warning" size={18} color="#ffc107" />
                <Text style={styles.warningBoxTitle}> Account Deletion Warning</Text>
              </View>
              <Text style={[styles.warningBoxText, { color: isDark ? "#ccc" : "#444" }]}>
                Deleting your account is permanent and cannot be undone. All your posts, data, and personal information will be permanently removed.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.dangerButton}
              onPress={handleDeleteAccount}
              disabled={loading}
            >
              <Icon name="delete" size={20} color="#fff" style={styles.btnIcon} />
              <Text style={styles.dangerButtonText}>{loading ? "Processing..." : "Delete My Account"}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#9370DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: "#8a2be2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 24,
  },
  sectionContainer: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#8a2be2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 12,
    shadowColor: "#8a2be2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: 8,
  },
  sectionDesc: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 8,
  },
  dangerButton: {
    backgroundColor: '#ff4757',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: "#ff4757",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  warningBox: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  warningTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  warningBoxTitle: {
    color: '#ffc107',
    fontWeight: 'bold',
    fontSize: 14,
  },
  warningBoxText: {
    fontSize: 13,
    lineHeight: 18,
  }
});

export default Setting;




