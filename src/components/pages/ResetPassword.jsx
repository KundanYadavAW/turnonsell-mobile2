import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useStore } from '../../../src/zustand/store';
import Icon from 'react-native-vector-icons/MaterialIcons';



const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Password, 4: Success
  const [loading, setLoading] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const isDark = darkMode === true || darkMode === "true";

  const requestOtp = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email");
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/requestPasswordReset`, { email });
      Alert.alert("Success", response.data.message || "OTP sent to your email");
      setStep(2);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return Alert.alert("Error", "Please enter the OTP");
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/verifyResetOtp`, { email, otp });
      Alert.alert("Success", response.data.message || "OTP verified");
      setStep(3);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!newPassword || !confirmNewPassword) return Alert.alert("Error", "Please fill in all fields");
    if (newPassword !== confirmNewPassword) return Alert.alert("Error", "Passwords do not match");
    
    setLoading(true);
    try {
      const response = await axios.put(`${baseURL}/api/resetPassword`, { email, newPassword, confirmNewPassword });
      setStep(4);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  const renderStepIcon = () => {
    switch(step) {
      case 1: return <Icon name="email" size={40} color="#fff" />;
      case 2: return <Icon name="security" size={40} color="#fff" />;
      case 3: return <Icon name="vpn-key" size={40} color="#fff" />;
      case 4: return <Icon name="check-circle" size={50} color="#fff" />;
      default: return <Icon name="email" size={40} color="#fff" />;
    }
  };

  const renderStepTitle = () => {
    switch(step) {
      case 1: return "Enter Your Email";
      case 2: return "Verify OTP Code";
      case 3: return "Create New Password";
      case 4: return "Success!";
      default: return "Reset Password";
    }
  };

  const renderStepDesc = () => {
    switch(step) {
      case 1: return "We'll send you a verification code";
      case 2: return "Check your email for the OTP code";
      case 3: return "Choose a strong, secure password";
      case 4: return "Password reset successfully! You can now log in.";
      default: return "";
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
              <View style={[styles.iconCircle, step === 4 && { backgroundColor: '#4caf50' }]}>
                {renderStepIcon()}
              </View>
              <Text style={[styles.title, { color: step === 4 ? '#4caf50' : (isDark ? "#bb86fc" : "#6A1B9A") }]}>
                {renderStepTitle()}
              </Text>
              <Text style={[styles.subtitle, { color: isDark ? "#aaa" : "#666" }]}>
                {renderStepDesc()}
              </Text>
            </View>

            {step !== 4 && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: isDark ? "#333" : "#e0e0e0" }]}>
                  <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
                </View>
                <Text style={[styles.stepText, { color: isDark ? "#bbb" : "#666" }]}>Step {step} of 3</Text>
              </View>
            )}

            <View style={styles.formContainer}>
              
              {step === 1 && (
                <>
                  <View style={styles.inputGroup}>
                    <Icon name="email" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                      placeholder="Email Address"
                      placeholderTextColor={isDark ? "#888" : "#999"}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                  <TouchableOpacity style={styles.submitButton} onPress={requestOtp} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : (
                      <>
                        <Text style={styles.submitButtonText}>Request OTP</Text>
                        <Icon name="send" size={20} color="#fff" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {step === 2 && (
                <>
                  <View style={styles.inputGroup}>
                    <Icon name="security" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                      placeholder="Enter 6-digit OTP"
                      placeholderTextColor={isDark ? "#888" : "#999"}
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                    />
                  </View>
                  <TouchableOpacity style={styles.submitButton} onPress={verifyOtp} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : (
                      <>
                        <Text style={styles.submitButtonText}>Verify OTP</Text>
                        <Icon name="verified" size={20} color="#fff" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setStep(1)} style={styles.textBtn}>
                    <Text style={{ color: isDark ? '#bb86fc' : '#8a2be2', textAlign: 'center', marginTop: 16 }}>Back to Email</Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && (
                <>
                  <View style={styles.inputGroup}>
                    <Icon name="lock-outline" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                      placeholder="New Password"
                      placeholderTextColor={isDark ? "#888" : "#999"}
                      secureTextEntry={!showPassword}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                      <Icon name={showPassword ? "visibility-off" : "visibility"} size={20} color={isDark ? "#bbb" : "#666"} />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Icon name="vpn-key" size={20} color={isDark ? "#bbb" : "#666"} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: isDark ? "#fff" : "#333", borderBottomColor: isDark ? "#555" : "#ddd" }]}
                      placeholder="Confirm New Password"
                      placeholderTextColor={isDark ? "#888" : "#999"}
                      secureTextEntry={!showConfirmPassword}
                      value={confirmNewPassword}
                      onChangeText={setConfirmNewPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                      <Icon name={showConfirmPassword ? "visibility-off" : "visibility"} size={20} color={isDark ? "#bbb" : "#666"} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.submitButton} onPress={resetPassword} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : (
                      <Text style={styles.submitButtonText}>Reset Password</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}

              {step === 4 && (
                <TouchableOpacity 
                  style={[styles.submitButton, { backgroundColor: '#4caf50' }]}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.submitButtonText}>Go to Login</Text>
                </TouchableOpacity>
              )}

            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
    marginBottom: 20,
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  progressContainer: { mb: 20 },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8a2be2',
  },
  stepText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  formContainer: { width: '100%', marginTop: 20 },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  inputIcon: { position: 'absolute', left: 10, zIndex: 1 },
  input: {
    flex: 1,
    height: 50,
    borderBottomWidth: 1.5,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 16,
  },
  eyeIcon: { position: 'absolute', right: 10, padding: 5 },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#8a2be2',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: "#8a2be2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  textBtn: { padding: 10 }
});

export default ResetPassword;




