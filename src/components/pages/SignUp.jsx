import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useStore } from "";
import { Ionicons } from "@expo/vector-icons";

import { useStore } from "";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState("signup"); // 'signup' or 'otp'
  const [showPassword, setShowPassword] = useState(false);
  
  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSignupSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${baseURL}/signup`, formData);
      setSuccess(response.data.message || "OTP sent successfully!");
      setStep("otp");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${baseURL}/verify-otp`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        otp
      });
      
      setSuccess(response.data.message || "Signup successful! You can now login.");
      setTimeout(() => {
        navigation.navigate("Login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const isDark = darkMode === true || darkMode === "true";

  return (
    <KeyboardAvoidingView 
      style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
          
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
          </TouchableOpacity>

          <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
            {step === "signup" ? "Create Account" : "Verify OTP"}
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {success ? <Text style={styles.successText}>{success}</Text> : null}

          {step === "signup" && (
            <View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
                  placeholder="Full Name"
                  placeholderTextColor={isDark ? "#aaa" : "#888"}
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
                  placeholder="Email Address"
                  placeholderTextColor={isDark ? "#aaa" : "#888"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                />
              </View>

              <View style={[styles.inputContainer, styles.passwordContainer, isDark ? styles.darkInput : styles.lightInput]}>
                <TextInput
                  style={[styles.passwordInput, isDark ? styles.darkText : styles.lightText]}
                  placeholder="Password"
                  placeholderTextColor={isDark ? "#aaa" : "#888"}
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={isDark ? "#aaa" : "#888"} />
                </TouchableOpacity>
              </View>

              <View style={[styles.inputContainer, styles.passwordContainer, isDark ? styles.darkInput : styles.lightInput]}>
                <TextInput
                  style={[styles.passwordInput, isDark ? styles.darkText : styles.lightText]}
                  placeholder="Confirm Password"
                  placeholderTextColor={isDark ? "#aaa" : "#888"}
                  secureTextEntry={!showPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange("confirmPassword", text)}
                />
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSignupSubmit} 
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
              </TouchableOpacity>
              
              <View style={styles.footer}>
                <Text style={isDark ? styles.darkText : styles.lightText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.linkText}>Log In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === "otp" && (
            <View>
              <Text style={[styles.subtitle, isDark ? {color: "#ccc"} : {color: "#666"}]}>
                Please enter the OTP sent to {formData.email}
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
                  placeholder="Enter OTP"
                  placeholderTextColor={isDark ? "#aaa" : "#888"}
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                />
              </View>

              <TouchableOpacity 
                style={styles.button} 
                onPress={handleOtpSubmit} 
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
              </TouchableOpacity>
            </View>
          )}

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  lightContainer: { backgroundColor: "#f5f7fa" },
  darkContainer: { backgroundColor: "#1a1a2e" },
  
  card: { padding: 24, borderRadius: 16, elevation: 4 },
  lightCard: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  darkCard: { backgroundColor: "#16213e", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10 },

  backButton: { alignSelf: 'flex-start', marginBottom: 10 },
  
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
  lightText: { color: "#333" },
  darkText: { color: "#fff" },

  errorText: { color: "#d32f2f", backgroundColor: "#fdecea", padding: 10, borderRadius: 8, marginBottom: 16, textAlign: "center" },
  successText: { color: "#2e7d32", backgroundColor: "#e8f5e9", padding: 10, borderRadius: 8, marginBottom: 16, textAlign: "center" },

  inputContainer: { marginBottom: 16 },
  
  input: { borderWidth: 1, borderRadius: 8, padding: 14, fontSize: 16 },
  lightInput: { borderColor: "#ccc", backgroundColor: "#fafafa", color: "#333" },
  darkInput: { borderColor: "#444", backgroundColor: "#2d3748", color: "#fff" },
  
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8, paddingRight: 0 },
  passwordInput: { flex: 1, padding: 14, fontSize: 16, borderWidth: 0, backgroundColor: 'transparent' },
  
  eyeIcon: { padding: 10 },
  
  button: { backgroundColor: "#2196F3", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 10, marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  linkText: { color: "#2196F3", fontWeight: "600" },
});

export default SignUp;




