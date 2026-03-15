import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useStore } from "";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const setLoggedin = useStore((state) => state.setIsLoggedin);
  const baseURL = useStore((state) => state.baseURL);
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setRefreshToken = useStore((state) => state.setRefreshToken);
  const usertype = useStore((state) => state.setUserType);
  const setUserId = useStore((state) => state.setUserId);
  const darkMode = useStore((state) => state.darkMode);
  
  const navigation = useNavigation();

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setLoggedin(true);
        // React Navigation automatically handles showing Main when logged in state changes
      }
    };
    checkToken();
  }, [setLoggedin]);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${baseURL}/login`, formData);

      await AsyncStorage.setItem("token", response.data.token);
      if(response.data.refreshToken) {
        await AsyncStorage.setItem("refresh", response.data.refreshToken);
      }
      await AsyncStorage.setItem("is_login", "true");
      await AsyncStorage.setItem("user_type", response.data.user.role || "user");
      await AsyncStorage.setItem("user_id", response.data.user.id.toString());

      setAccessToken(response.data.token);
      usertype(response.data.user.role);
      setUserId(response.data.user.id);
      
      // Update this last as it triggers navigation in App.js
      setLoggedin(true); 
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
        <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>Welcome Back</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
            placeholder="Email"
            placeholderTextColor={darkMode ? "#aaa" : "#888"}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>

        <View style={[styles.inputContainer, styles.passwordContainer, darkMode ? styles.darkInput : styles.lightInput]}>
          <TextInput
            style={[styles.passwordInput, darkMode ? styles.darkText : styles.lightText]}
            placeholder="Password"
            placeholderTextColor={darkMode ? "#aaa" : "#888"}
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={darkMode ? "#aaa" : "#888"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.linkText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={styles.linkText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  lightContainer: { backgroundColor: "#f5f7fa" },
  darkContainer: { backgroundColor: "#1a1a2e" },
  
  card: { padding: 24, borderRadius: 16, elevation: 4 },
  lightCard: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  darkCard: { backgroundColor: "#16213e", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10 },

  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  lightText: { color: "#333" },
  darkText: { color: "#fff" },

  errorText: { color: "#d32f2f", backgroundColor: "#fdecea", padding: 10, borderRadius: 8, marginBottom: 16, textAlign: "center" },

  inputContainer: { marginBottom: 16 },
  
  input: { borderWidth: 1, borderRadius: 8, padding: 14, fontSize: 16 },
  lightInput: { borderColor: "#ccc", backgroundColor: "#fafafa", color: "#333" },
  darkInput: { borderColor: "#444", backgroundColor: "#2d3748", color: "#fff" },
  
  passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8 },
  passwordInput: { flex: 1, padding: 14, fontSize: 16 },
  
  eyeIcon: { padding: 10 },
  
  button: { backgroundColor: "#2196F3", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  linkText: { color: "#2196F3", fontWeight: "600" },
});

export default Login;




