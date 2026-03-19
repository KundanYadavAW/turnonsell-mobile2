// import { Ionicons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { useStore } from '../../../src/zustand/store';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const setLoggedin = useStore((state) => state.setIsLoggedin);
//   const baseURL = useStore((state) => state.baseURL);
//   const setAccessToken = useStore((state) => state.setAccessToken);
//   const setRefreshToken = useStore((state) => state.setRefreshToken);
//   const usertype = useStore((state) => state.setUserType);
//   const setUserId = useStore((state) => state.setUserId);
//   const darkMode = useStore((state) => state.darkMode);
  
//   const navigation = useNavigation();

//   useEffect(() => {
//     const checkToken = async () => {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         setLoggedin(true);
//         // React Navigation automatically handles showing Main when logged in state changes
//       }
//     };
//     checkToken();
//   }, [setLoggedin]);

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async () => {
//     if (!formData.email || !formData.password) {
//       setError("Please fill in all fields.");
//       return;
//     }
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${baseURL}/api/login`, formData);

//       await AsyncStorage.setItem("token", response.data.token);
//       if(response.data.refreshToken) {
//         await AsyncStorage.setItem("refresh", response.data.refreshToken);
//       }
//       await AsyncStorage.setItem("is_login", "true");
//       await AsyncStorage.setItem("user_type", response.data.user.role || "user");
//       await AsyncStorage.setItem("user_id", response.data.user.id.toString());

//       setAccessToken(response.data.token);
//       usertype(response.data.user.role);
//       setUserId(response.data.user.id);
      
//       // Update this last as it triggers navigation in App.js
//       setLoggedin(true); 
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView 
//       style={[styles.container, darkMode ? styles.darkContainer : styles.lightContainer]} 
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <View style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
//         <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>Welcome Back</Text>

//         {error ? <Text style={styles.errorText}>{error}</Text> : null}

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={[styles.input, darkMode ? styles.darkInput : styles.lightInput]}
//             placeholder="Email"
//             placeholderTextColor={darkMode ? "#aaa" : "#888"}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             value={formData.email}
//             onChangeText={(text) => handleChange("email", text)}
//           />
//         </View>

//         <View style={[styles.inputContainer, styles.passwordContainer, darkMode ? styles.darkInput : styles.lightInput]}>
//           <TextInput
//             style={[styles.passwordInput, darkMode ? styles.darkText : styles.lightText]}
//             placeholder="Password"
//             placeholderTextColor={darkMode ? "#aaa" : "#888"}
//             secureTextEntry={!showPassword}
//             value={formData.password}
//             onChangeText={(text) => handleChange("password", text)}
//           />
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
//             <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={darkMode ? "#aaa" : "#888"} />
//           </TouchableOpacity>
//         </View>

//         <TouchableOpacity 
//           style={styles.button} 
//           onPress={handleSubmit} 
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>Login</Text>
//           )}
//         </TouchableOpacity>

//         <View style={styles.footer}>
//           <TouchableOpacity onPress={() => {}}>
//             <Text style={styles.linkText}>Forgot Password?</Text>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
//             <Text style={styles.linkText}>Sign Up</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 20 },
//   lightContainer: { backgroundColor: "#f5f7fa" },
//   darkContainer: { backgroundColor: "#1a1a2e" },
  
//   card: { padding: 24, borderRadius: 16, elevation: 4 },
//   lightCard: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
//   darkCard: { backgroundColor: "#16213e", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10 },

//   title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
//   lightText: { color: "#333" },
//   darkText: { color: "#fff" },

//   errorText: { color: "#d32f2f", backgroundColor: "#fdecea", padding: 10, borderRadius: 8, marginBottom: 16, textAlign: "center" },

//   inputContainer: { marginBottom: 16 },
  
//   input: { borderWidth: 1, borderRadius: 8, padding: 14, fontSize: 16 },
//   lightInput: { borderColor: "#ccc", backgroundColor: "#fafafa", color: "#333" },
//   darkInput: { borderColor: "#444", backgroundColor: "#2d3748", color: "#fff" },
  
//   passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8 },
//   passwordInput: { flex: 1, padding: 14, fontSize: 16 },
  
//   eyeIcon: { padding: 10 },
  
//   button: { backgroundColor: "#2196F3", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 10 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  
//   footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
//   linkText: { color: "#2196F3", fontWeight: "600" },
// });

// export default Login;










import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useStore } from '../../../src/zustand/store';

const { width, height } = Dimensions.get('window');

const mainLogo = require('../../../assets/images/logo.png');

const CATEGORIES = [
  { icon: 'book-outline', label: 'Books' },
  { icon: 'shirt-outline', label: 'Clothes' },
  { icon: 'laptop-outline', label: 'Laptops' },
  { icon: 'footsteps-outline', label: 'Shoes' },
];

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const cardAnim = useRef(new Animated.Value(60)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const iconAnims = useRef(CATEGORIES.map(() => new Animated.Value(0))).current;

  const setLoggedin = useStore((state) => state.setIsLoggedin);
  const baseURL = useStore((state) => state.baseURL);
  const setAccessToken = useStore((state) => state.setAccessToken);
  const setRefreshToken = useStore((state) => state.setRefreshToken);
  const usertype = useStore((state) => state.setUserType);
  const setUserId = useStore((state) => state.setUserId);
  const darkMode = useStore((state) => state.darkMode);

  const navigation = useNavigation();

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.delay(250),
      Animated.parallel([
        Animated.spring(cardAnim, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
        Animated.timing(cardFade, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ]).start();

    // Stagger category icons
    iconAnims.forEach((anim, i) => {
      Animated.sequence([
        Animated.delay(400 + i * 100),
        Animated.spring(anim, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      ]).start();
    });

    // Check token
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) setLoggedin(true);
    };
    checkToken();
  }, []);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/api/login`, formData);
      await AsyncStorage.setItem("token", response.data.token);
      if (response.data.refreshToken) {
        await AsyncStorage.setItem("refresh", response.data.refreshToken);
      }
      await AsyncStorage.setItem("is_login", "true");
      await AsyncStorage.setItem("user_type", response.data.user.role || "user");
      await AsyncStorage.setItem("user_id", response.data.user.id.toString());
      setAccessToken(response.data.token);
      usertype(response.data.user.role);
      setUserId(response.data.user.id);
      setLoggedin(true);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const theme = darkMode ? dark : light;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: darkMode ? '#0F0F14' : '#FFF8F2' }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header blob */}
        <View style={[styles.headerBlob, { backgroundColor: darkMode ? '#1E1428' : '#FF6B2C' }]}>
          <View style={[styles.blobAccent, { backgroundColor: darkMode ? '#FF6B2C33' : '#FF8C5A55' }]} />
          <View style={[styles.blobAccent2, { backgroundColor: darkMode ? '#FF6B2C22' : '#FFAD8055' }]} />

          {/* Logo + Brand */}
          <Animated.View
            style={[
              styles.brandRow,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <View style={styles.logoWrap}>
              <Image source={mainLogo} style={styles.logo} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.brandName}>TurnOnSell</Text>
              <Text style={styles.brandTagline}>Buy less. Sell smart.</Text>
            </View>
          </Animated.View>

          {/* Category pills */}
          <Animated.View style={[styles.categoryRow, { opacity: fadeAnim }]}>
            {CATEGORIES.map((cat, i) => (
              <Animated.View
                key={cat.label}
                style={[
                  styles.catPill,
                  {
                    opacity: iconAnims[i],
                    transform: [{ scale: iconAnims[i] }],
                    backgroundColor: darkMode ? '#2A1F38' : 'rgba(255,255,255,0.22)',
                  }
                ]}
              >
                <Ionicons name={cat.icon} size={18} color="#fff" />
                <Text style={styles.catLabel}>{cat.label}</Text>
              </Animated.View>
            ))}
          </Animated.View>
        </View>

        {/* Card */}
        <Animated.View
          style={[
            styles.card,
            theme.card,
            {
              opacity: cardFade,
              transform: [
                { translateY: cardAnim },
                { translateX: shakeAnim }
              ]
            }
          ]}
        >
          <Text style={[styles.cardTitle, theme.text]}>Welcome back</Text>
          <Text style={[styles.cardSub, theme.subText]}>Sign in to your account</Text>

          {/* Error */}
          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Email */}
          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, theme.subText]}>Email</Text>
            <View style={[styles.inputBox, theme.inputBox]}>
              <Ionicons name="mail-outline" size={18} color={darkMode ? '#888' : '#AAA'} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputText, theme.text]}
                placeholder="you@email.com"
                placeholderTextColor={darkMode ? "#555" : "#C0B8B0"}
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => handleChange("email", text)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.fieldWrap}>
            <Text style={[styles.fieldLabel, theme.subText]}>Password</Text>
            <View style={[styles.inputBox, theme.inputBox]}>
              <Ionicons name="lock-closed-outline" size={18} color={darkMode ? '#888' : '#AAA'} style={styles.inputIcon} />
              <TextInput
                style={[styles.inputText, theme.text, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor={darkMode ? "#555" : "#C0B8B0"}
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={darkMode ? "#666" : "#BBB"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={styles.forgotWrap} onPress={() => {}}>
            <Text style={styles.forgotText} onPress={()=>navigation.navigate("ResetPassword")}>Forgot password?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={[styles.divLine, theme.divLine]} />
            <Text style={[styles.divText, theme.subText]}>New here?</Text>
            <View style={[styles.divLine, theme.divLine]} />
          </View>

          {/* Sign up */}
          <TouchableOpacity
            style={[styles.signupBtn, theme.signupBtn]}
            onPress={() => navigation.navigate("SignUp")}
            activeOpacity={0.8}
          >
            <Text style={[styles.signupBtnText, { color: darkMode ? '#FF8C5A' : '#FF6B2C' }]}>
              Create an Account
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Footer note */}
        <Animated.Text style={[styles.footerNote, { opacity: cardFade, color: darkMode ? '#444' : '#C9BDB5' }]}>
          Your marketplace for second-hand treasures 🏷️
        </Animated.Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// ─── Light theme ────────────────────────────────────────────────────────────
const light = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', shadowColor: '#FF6B2C', shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
  text: { color: '#1C1410' },
  subText: { color: '#9A8E87' },
  inputBox: { borderColor: '#EDE5DF', backgroundColor: '#FDFAF8' },
  divLine: { backgroundColor: '#EDE5DF' },
  signupBtn: { borderColor: '#FF6B2C', backgroundColor: '#FFF5F0' },
});

// ─── Dark theme ─────────────────────────────────────────────────────────────
const dark = StyleSheet.create({
  card: { backgroundColor: '#1A1520', shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 24, elevation: 10 },
  text: { color: '#F0EAE5' },
  subText: { color: '#665E6A' },
  inputBox: { borderColor: '#2D2535', backgroundColor: '#211C2A' },
  divLine: { backgroundColor: '#2D2535' },
  signupBtn: { borderColor: '#FF6B2C55', backgroundColor: '#2A1F1A' },
});

// ─── Base styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  // Header blob
  headerBlob: {
    paddingTop: Platform.OS === 'ios' ? 64 : 48,
    paddingBottom: 36,
    paddingHorizontal: 24,
    overflow: 'hidden',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  blobAccent: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
    right: -40,
  },
  blobAccent2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    bottom: -30,
    left: 40,
  },

  // Brand
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    overflow: 'hidden',
  },
  logo: { width: 40, height: 40 },
  brandName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 0.4,
    marginTop: 1,
  },

  // Category pills
  categoryRow: { flexDirection: 'row', gap: 10 },
  catPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  catLabel: { color: '#fff', fontSize: 12, fontWeight: '600' },

  // Card
  card: {
    marginHorizontal: 20,
    marginTop: -16,
    borderRadius: 24,
    padding: 28,
    shadowOffset: { width: 0, height: 8 },
  },
  cardTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  cardSub: { fontSize: 14, marginBottom: 24 },

  // Error
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FDE8E8',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  errorText: { color: '#d32f2f', fontSize: 13, flex: 1 },

  // Field
  fieldWrap: { marginBottom: 16 },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 7 },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: { marginRight: 10 },
  inputText: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },

  // Forgot
  forgotWrap: { alignSelf: 'flex-end', marginBottom: 24, marginTop: -4 },
  forgotText: { color: '#FF6B2C', fontSize: 13, fontWeight: '600' },

  // Login button
  loginBtn: {
    flexDirection: 'row',
    backgroundColor: '#FF6B2C',
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B2C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnDisabled: { opacity: 0.7 },
  loginBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  // Divider
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 22, gap: 12 },
  divLine: { flex: 1, height: 1 },
  divText: { fontSize: 13 },

  // Sign up button
  signupBtn: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupBtnText: { fontSize: 15, fontWeight: '700' },

  // Footer
  footerNote: { textAlign: 'center', marginTop: 28, fontSize: 13 },
});

export default Login;
