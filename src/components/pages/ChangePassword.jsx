import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useStore } from '../../../src/zustand/store';
import Icon from 'react-native-vector-icons/MaterialIcons';



const ChangePassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const accessToken = useStore((state) => state.accessToken);
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      Alert.alert("Error", "New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${baseURL}/api/changePassword`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      Alert.alert("Success", response.data.message || "Password changed successfully!");
      
      setFormData({
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      
      navigation.goBack();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f7fa" }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>

          <View style={[styles.card, { backgroundColor: isDark ? "#1e1e2e" : "#fff", borderColor: isDark ? "#333" : "rgba(138,43,226,0.1)" }]}>
            <View style={styles.header}>
              <View style={styles.iconCircle}>
                <Icon name="lock" size={32} color="#fff" />
              </View>
              <Text style={[styles.title, { color: isDark ? "#bb86fc" : "#6A1B9A" }]}>Secure Your Account</Text>
              <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#666" }]}>
                Update your password to keep your account secure
              </Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Icon name="email" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                  placeholder="Email"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Icon name="lock-outline" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                  placeholder="Old Password"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  secureTextEntry={!showOldPassword}
                  value={formData.oldPassword}
                  onChangeText={(text) => handleChange('oldPassword', text)}
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeIcon}>
                  <Icon name={showOldPassword ? "visibility-off" : "visibility"} size={20} color={isDark ? "#bbb" : "#666"} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Icon name="vpn-key" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                  placeholder="New Password"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  secureTextEntry={!showNewPassword}
                  value={formData.newPassword}
                  onChangeText={(text) => handleChange('newPassword', text)}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
                  <Icon name={showNewPassword ? "visibility-off" : "visibility"} size={20} color={isDark ? "#bbb" : "#666"} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Icon name="vpn-key" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                  placeholder="Confirm New Password"
                  placeholderTextColor={isDark ? "#888" : "#999"}
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmNewPassword}
                  onChangeText={(text) => handleChange('confirmNewPassword', text)}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Icon name={showConfirmPassword ? "visibility-off" : "visibility"} size={20} color={isDark ? "#bbb" : "#666"} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Change Password</Text>
                    <Icon name="check-circle" size={20} color="#fff" style={{ marginLeft: 8 }} />
                  </>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    marginTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 10,
    zIndex: 1,
  },
  input: {
    flex: 1,
    height: 50,
    borderBottomWidth: 1.5,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    padding: 5,
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#8a2be2',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: "#8a2be2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default ChangePassword;




