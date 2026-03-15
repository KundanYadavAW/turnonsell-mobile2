// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { useState } from "react";
// import {
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// // import { useStore } from "";
// import { Ionicons } from "@expo/vector-icons";

// import { useStore } from '../../../src/zustand/store';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [step, setStep] = useState("signup"); // 'signup' or 'otp'
//   const [showPassword, setShowPassword] = useState(false);
  
//   const baseURL = useStore((state) => state.baseURL);
//   const darkMode = useStore((state) => state.darkMode);
//   const navigation = useNavigation();

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSignupSubmit = async () => {
//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//       setError("All fields are required.");
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${baseURL}/signup`, formData);
//       setSuccess(response.data.message || "OTP sent successfully!");
//       setStep("otp");
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async () => {
//     if (!otp) {
//       setError("Please enter the OTP.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${baseURL}/verify-otp`, {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         otp
//       });
      
//       setSuccess(response.data.message || "Signup successful! You can now login.");
//       setTimeout(() => {
//         navigation.navigate("Login");
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isDark = darkMode === true || darkMode === "true";

//   return (
//     <KeyboardAvoidingView 
//       style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]} 
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
          
//           <TouchableOpacity 
//             style={styles.backButton} 
//             onPress={() => navigation.goBack()}
//           >
//             <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#333"} />
//           </TouchableOpacity>

//           <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>
//             {step === "signup" ? "Create Account" : "Verify OTP"}
//           </Text>

//           {error ? <Text style={styles.errorText}>{error}</Text> : null}
//           {success ? <Text style={styles.successText}>{success}</Text> : null}

//           {step === "signup" && (
//             <View>
//               <View style={styles.inputContainer}>
//                 <TextInput
//                   style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
//                   placeholder="Full Name"
//                   placeholderTextColor={isDark ? "#aaa" : "#888"}
//                   value={formData.name}
//                   onChangeText={(text) => handleChange("name", text)}
//                 />
//               </View>

//               <View style={styles.inputContainer}>
//                 <TextInput
//                   style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
//                   placeholder="Email Address"
//                   placeholderTextColor={isDark ? "#aaa" : "#888"}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   value={formData.email}
//                   onChangeText={(text) => handleChange("email", text)}
//                 />
//               </View>

//               <View style={[styles.inputContainer, styles.passwordContainer, isDark ? styles.darkInput : styles.lightInput]}>
//                 <TextInput
//                   style={[styles.passwordInput, isDark ? styles.darkText : styles.lightText]}
//                   placeholder="Password"
//                   placeholderTextColor={isDark ? "#aaa" : "#888"}
//                   secureTextEntry={!showPassword}
//                   value={formData.password}
//                   onChangeText={(text) => handleChange("password", text)}
//                 />
//                 <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
//                   <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={isDark ? "#aaa" : "#888"} />
//                 </TouchableOpacity>
//               </View>

//               <View style={[styles.inputContainer, styles.passwordContainer, isDark ? styles.darkInput : styles.lightInput]}>
//                 <TextInput
//                   style={[styles.passwordInput, isDark ? styles.darkText : styles.lightText]}
//                   placeholder="Confirm Password"
//                   placeholderTextColor={isDark ? "#aaa" : "#888"}
//                   secureTextEntry={!showPassword}
//                   value={formData.confirmPassword}
//                   onChangeText={(text) => handleChange("confirmPassword", text)}
//                 />
//               </View>

//               <TouchableOpacity 
//                 style={styles.button} 
//                 onPress={handleSignupSubmit} 
//                 disabled={loading}
//               >
//                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
//               </TouchableOpacity>
              
//               <View style={styles.footer}>
//                 <Text style={isDark ? styles.darkText : styles.lightText}>Already have an account? </Text>
//                 <TouchableOpacity onPress={() => navigation.navigate("Login")}>
//                   <Text style={styles.linkText}>Log In</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}

//           {step === "otp" && (
//             <View>
//               <Text style={[styles.subtitle, isDark ? {color: "#ccc"} : {color: "#666"}]}>
//                 Please enter the OTP sent to {formData.email}
//               </Text>

//               <View style={styles.inputContainer}>
//                 <TextInput
//                   style={[styles.input, isDark ? styles.darkInput : styles.lightInput]}
//                   placeholder="Enter OTP"
//                   placeholderTextColor={isDark ? "#aaa" : "#888"}
//                   keyboardType="number-pad"
//                   value={otp}
//                   onChangeText={setOtp}
//                 />
//               </View>

//               <TouchableOpacity 
//                 style={styles.button} 
//                 onPress={handleOtpSubmit} 
//                 disabled={loading}
//               >
//                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
//               </TouchableOpacity>
//             </View>
//           )}

//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
//   lightContainer: { backgroundColor: "#f5f7fa" },
//   darkContainer: { backgroundColor: "#1a1a2e" },
  
//   card: { padding: 24, borderRadius: 16, elevation: 4 },
//   lightCard: { backgroundColor: "#fff", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
//   darkCard: { backgroundColor: "#16213e", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 10 },

//   backButton: { alignSelf: 'flex-start', marginBottom: 10 },
  
//   title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
//   subtitle: { fontSize: 14, textAlign: "center", marginBottom: 20 },
//   lightText: { color: "#333" },
//   darkText: { color: "#fff" },

//   errorText: { color: "#d32f2f", backgroundColor: "#fdecea", padding: 10, borderRadius: 8, marginBottom: 16, textAlign: "center" },
//   successText: { color: "#2e7d32", backgroundColor: "#e8f5e9", padding: 10, borderRadius: 8, marginBottom: 16, textAlign: "center" },

//   inputContainer: { marginBottom: 16 },
  
//   input: { borderWidth: 1, borderRadius: 8, padding: 14, fontSize: 16 },
//   lightInput: { borderColor: "#ccc", backgroundColor: "#fafafa", color: "#333" },
//   darkInput: { borderColor: "#444", backgroundColor: "#2d3748", color: "#fff" },
  
//   passwordContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 8, paddingRight: 0 },
//   passwordInput: { flex: 1, padding: 14, fontSize: 16, borderWidth: 0, backgroundColor: 'transparent' },
  
//   eyeIcon: { padding: 10 },
  
//   button: { backgroundColor: "#2196F3", padding: 16, borderRadius: 8, alignItems: "center", marginTop: 10, marginBottom: 20 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  
//   footer: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
//   linkText: { color: "#2196F3", fontWeight: "600" },
// });

// export default SignUp;








// import { Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import axios from "axios";
// import { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Animated,
//   Dimensions,
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View
// } from "react-native";
// import { useStore } from '../../../src/zustand/store';

// const { width } = Dimensions.get('window');
// const mainLogo = require('../../../assets/images/logo.png');

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [step, setStep] = useState("signup"); // 'signup' or 'otp'
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Animations
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(40)).current;
//   const cardAnim = useRef(new Animated.Value(60)).current;
//   const cardFade = useRef(new Animated.Value(0)).current;
//   const shakeAnim = useRef(new Animated.Value(0)).current;
//   const stepFade = useRef(new Animated.Value(1)).current;

//   const baseURL = useStore((state) => state.baseURL);
//   const darkMode = useStore((state) => state.darkMode);
//   const navigation = useNavigation();

//   const isDark = darkMode === true || darkMode === "true";

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
//       Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
//     ]).start();

//     Animated.sequence([
//       Animated.delay(250),
//       Animated.parallel([
//         Animated.spring(cardAnim, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
//         Animated.timing(cardFade, { toValue: 1, duration: 500, useNativeDriver: true }),
//       ])
//     ]).start();
//   }, []);

//   const triggerShake = () => {
//     Animated.sequence([
//       Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 6, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: -6, duration: 60, useNativeDriver: true }),
//       Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
//     ]).start();
//   };

//   const animateStepTransition = (callback) => {
//     Animated.timing(stepFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
//       callback();
//       Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
//     });
//   };

//   const handleChange = (name, value) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSignupSubmit = async () => {
//     if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
//       setError("All fields are required.");
//       triggerShake();
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match.");
//       triggerShake();
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${baseURL}/api/signup`, formData);
//       setSuccess(response.data.message || "OTP sent successfully!");
//       animateStepTransition(() => setStep("otp"));
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong. Please try again.");
//       triggerShake();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOtpSubmit = async () => {
//     if (!otp) {
//       setError("Please enter the OTP.");
//       triggerShake();
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post(`${baseURL}/api/verify-otp`, {
//         name: formData.name,
//         email: formData.email,
//         password: formData.password,
//         otp
//       });

//       setSuccess(response.data.message || "Signup successful! You can now login.");
//       setTimeout(() => {
//         navigation.navigate("Login");
//       }, 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || "Invalid OTP");
//       triggerShake();
//     } finally {
//       setLoading(false);
//     }
//   };

//   const theme = isDark ? dark : light;

//   return (
//     <KeyboardAvoidingView
//       style={[styles.root, { backgroundColor: isDark ? '#0F0F14' : '#FFF8F2' }]}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scroll}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header blob */}
//         <View style={[styles.headerBlob, { backgroundColor: isDark ? '#1E1428' : '#FF6B2C' }]}>
//           <View style={[styles.blobAccent, { backgroundColor: isDark ? '#FF6B2C33' : '#FF8C5A55' }]} />
//           <View style={[styles.blobAccent2, { backgroundColor: isDark ? '#FF6B2C22' : '#FFAD8055' }]} />

//           {/* Back button */}
//           <Animated.View style={{ opacity: fadeAnim }}>
//             <TouchableOpacity
//               style={styles.backBtn}
//               onPress={() => navigation.goBack()}
//               activeOpacity={0.7}
//             >
//               <Ionicons name="arrow-back" size={20} color="#fff" />
//               <Text style={styles.backText}>Back</Text>
//             </TouchableOpacity>
//           </Animated.View>

//           {/* Logo + Brand */}
//           <Animated.View
//             style={[
//               styles.brandRow,
//               { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
//             ]}
//           >
//             <View style={styles.logoWrap}>
//               <Image source={mainLogo} style={styles.logo} resizeMode="contain" />
//             </View>
//             <View>
//               <Text style={styles.brandName}>TurnOnSell</Text>
//               <Text style={styles.brandTagline}>
//                 {step === "signup" ? "Join the community" : "Almost there!"}
//               </Text>
//             </View>
//           </Animated.View>

//           {/* Step indicator */}
//           <Animated.View style={[styles.stepRow, { opacity: fadeAnim }]}>
//             <View style={styles.stepItem}>
//               <View style={[styles.stepDot, styles.stepDotActive]}>
//                 <Ionicons name="person-outline" size={13} color="#fff" />
//               </View>
//               <Text style={styles.stepLabel}>Details</Text>
//             </View>
//             <View style={[styles.stepLine, step === "otp" ? styles.stepLineActive : styles.stepLineInactive]} />
//             <View style={styles.stepItem}>
//               <View style={[styles.stepDot, step === "otp" ? styles.stepDotActive : styles.stepDotInactive]}>
//                 <Ionicons name="shield-checkmark-outline" size={13} color="#fff" />
//               </View>
//               <Text style={styles.stepLabel}>Verify</Text>
//             </View>
//           </Animated.View>
//         </View>

//         {/* Card */}
//         <Animated.View
//           style={[
//             styles.card,
//             theme.card,
//             {
//               opacity: cardFade,
//               transform: [
//                 { translateY: cardAnim },
//                 { translateX: shakeAnim }
//               ]
//             }
//           ]}
//         >
//           <Animated.View style={{ opacity: stepFade }}>

//             <Text style={[styles.cardTitle, theme.text]}>
//               {step === "signup" ? "Create Account" : "Verify Email"}
//             </Text>
//             <Text style={[styles.cardSub, theme.subText]}>
//               {step === "signup"
//                 ? "Sign up to start buying and selling"
//                 : `OTP sent to ${formData.email}`}
//             </Text>

//             {/* Error / Success */}
//             {error ? (
//               <View style={styles.errorBox}>
//                 <Ionicons name="alert-circle-outline" size={16} color="#d32f2f" />
//                 <Text style={styles.errorText}>{error}</Text>
//               </View>
//             ) : null}
//             {success ? (
//               <View style={styles.successBox}>
//                 <Ionicons name="checkmark-circle-outline" size={16} color="#2e7d32" />
//                 <Text style={styles.successText}>{success}</Text>
//               </View>
//             ) : null}

//             {/* ── SIGNUP STEP ── */}
//             {step === "signup" && (
//               <View>
//                 {/* Full Name */}
//                 <View style={styles.fieldWrap}>
//                   <Text style={[styles.fieldLabel, theme.subText]}>Full Name</Text>
//                   <View style={[styles.inputBox, theme.inputBox]}>
//                     <Ionicons name="person-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
//                     <TextInput
//                       style={[styles.inputText, theme.text]}
//                       placeholder="Your full name"
//                       placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
//                       value={formData.name}
//                       onChangeText={(text) => handleChange("name", text)}
//                     />
//                   </View>
//                 </View>

//                 {/* Email */}
//                 <View style={styles.fieldWrap}>
//                   <Text style={[styles.fieldLabel, theme.subText]}>Email</Text>
//                   <View style={[styles.inputBox, theme.inputBox]}>
//                     <Ionicons name="mail-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
//                     <TextInput
//                       style={[styles.inputText, theme.text]}
//                       placeholder="you@email.com"
//                       placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
//                       keyboardType="email-address"
//                       autoCapitalize="none"
//                       value={formData.email}
//                       onChangeText={(text) => handleChange("email", text)}
//                     />
//                   </View>
//                 </View>

//                 {/* Password */}
//                 <View style={styles.fieldWrap}>
//                   <Text style={[styles.fieldLabel, theme.subText]}>Password</Text>
//                   <View style={[styles.inputBox, theme.inputBox]}>
//                     <Ionicons name="lock-closed-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
//                     <TextInput
//                       style={[styles.inputText, theme.text, { flex: 1 }]}
//                       placeholder="Create a password"
//                       placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
//                       secureTextEntry={!showPassword}
//                       value={formData.password}
//                       onChangeText={(text) => handleChange("password", text)}
//                     />
//                     <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
//                       <Ionicons
//                         name={showPassword ? "eye-off-outline" : "eye-outline"}
//                         size={20}
//                         color={isDark ? "#666" : "#BBB"}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 {/* Confirm Password */}
//                 <View style={styles.fieldWrap}>
//                   <Text style={[styles.fieldLabel, theme.subText]}>Confirm Password</Text>
//                   <View style={[styles.inputBox, theme.inputBox]}>
//                     <Ionicons name="lock-closed-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
//                     <TextInput
//                       style={[styles.inputText, theme.text, { flex: 1 }]}
//                       placeholder="Repeat your password"
//                       placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
//                       secureTextEntry={!showConfirmPassword}
//                       value={formData.confirmPassword}
//                       onChangeText={(text) => handleChange("confirmPassword", text)}
//                     />
//                     <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
//                       <Ionicons
//                         name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
//                         size={20}
//                         color={isDark ? "#666" : "#BBB"}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 </View>

//                 {/* Sign Up Button */}
//                 <TouchableOpacity
//                   style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
//                   onPress={handleSignupSubmit}
//                   disabled={loading}
//                   activeOpacity={0.85}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <>
//                       <Text style={styles.primaryBtnText}>Create Account</Text>
//                       <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
//                     </>
//                   )}
//                 </TouchableOpacity>

//                 {/* Divider */}
//                 <View style={styles.divider}>
//                   <View style={[styles.divLine, theme.divLine]} />
//                   <Text style={[styles.divText, theme.subText]}>Have an account?</Text>
//                   <View style={[styles.divLine, theme.divLine]} />
//                 </View>

//                 {/* Login link */}
//                 <TouchableOpacity
//                   style={[styles.secondaryBtn, theme.secondaryBtn]}
//                   onPress={() => navigation.navigate("Login")}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={[styles.secondaryBtnText, { color: isDark ? '#FF8C5A' : '#FF6B2C' }]}>
//                     Sign In Instead
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}

//             {/* ── OTP STEP ── */}
//             {step === "otp" && (
//               <View>
//                 {/* OTP illustration */}
//                 <View style={[styles.otpIconWrap, { backgroundColor: isDark ? '#2A1F38' : '#FFF0E8' }]}>
//                   <Ionicons name="shield-checkmark-outline" size={40} color="#FF6B2C" />
//                 </View>

//                 <View style={styles.fieldWrap}>
//                   <Text style={[styles.fieldLabel, theme.subText]}>One-Time Password</Text>
//                   <View style={[styles.inputBox, theme.inputBox, styles.otpInputBox]}>
//                     <Ionicons name="keypad-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
//                     <TextInput
//                       style={[styles.inputText, theme.text, styles.otpText]}
//                       placeholder="Enter OTP"
//                       placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
//                       keyboardType="number-pad"
//                       value={otp}
//                       onChangeText={setOtp}
//                       maxLength={6}
//                     />
//                   </View>
//                 </View>

//                 <Text style={[styles.otpHint, theme.subText]}>
//                   Didn't receive it?{" "}
//                   <Text style={styles.resendText} onPress={handleSignupSubmit}>
//                     Resend OTP
//                   </Text>
//                 </Text>

//                 {/* Verify Button */}
//                 <TouchableOpacity
//                   style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
//                   onPress={handleOtpSubmit}
//                   disabled={loading}
//                   activeOpacity={0.85}
//                 >
//                   {loading ? (
//                     <ActivityIndicator color="#fff" />
//                   ) : (
//                     <>
//                       <Text style={styles.primaryBtnText}>Verify & Continue</Text>
//                       <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
//                     </>
//                   )}
//                 </TouchableOpacity>

//                 {/* Back to signup */}
//                 <TouchableOpacity
//                   style={[styles.secondaryBtn, theme.secondaryBtn, { marginTop: 12 }]}
//                   onPress={() => animateStepTransition(() => { setStep("signup"); setError(""); setSuccess(""); })}
//                   activeOpacity={0.8}
//                 >
//                   <Text style={[styles.secondaryBtnText, { color: isDark ? '#FF8C5A' : '#FF6B2C' }]}>
//                     Change Email
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </Animated.View>
//         </Animated.View>

//         {/* Footer note */}
//         <Animated.Text style={[styles.footerNote, { opacity: cardFade, color: isDark ? '#444' : '#C9BDB5' }]}>
//           Your marketplace for second-hand treasures 🏷️
//         </Animated.Text>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// // ─── Light theme ─────────────────────────────────────────────────────────────
// const light = StyleSheet.create({
//   card: { backgroundColor: '#FFFFFF', shadowColor: '#FF6B2C', shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
//   text: { color: '#1C1410' },
//   subText: { color: '#9A8E87' },
//   inputBox: { borderColor: '#EDE5DF', backgroundColor: '#FDFAF8' },
//   divLine: { backgroundColor: '#EDE5DF' },
//   secondaryBtn: { borderColor: '#FF6B2C', backgroundColor: '#FFF5F0' },
// });

// // ─── Dark theme ───────────────────────────────────────────────────────────────
// const dark = StyleSheet.create({
//   card: { backgroundColor: '#1A1520', shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 24, elevation: 10 },
//   text: { color: '#F0EAE5' },
//   subText: { color: '#665E6A' },
//   inputBox: { borderColor: '#2D2535', backgroundColor: '#211C2A' },
//   divLine: { backgroundColor: '#2D2535' },
//   secondaryBtn: { borderColor: '#FF6B2C55', backgroundColor: '#2A1F1A' },
// });

// // ─── Base styles ─────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   root: { flex: 1 },
//   scroll: { flexGrow: 1, paddingBottom: 40 },

//   // Header blob
//   headerBlob: {
//     paddingTop: Platform.OS === 'ios' ? 56 : 40,
//     paddingBottom: 32,
//     paddingHorizontal: 24,
//     overflow: 'hidden',
//     borderBottomLeftRadius: 32,
//     borderBottomRightRadius: 32,
//   },
//   blobAccent: {
//     position: 'absolute', width: 200, height: 200,
//     borderRadius: 100, top: -60, right: -40,
//   },
//   blobAccent2: {
//     position: 'absolute', width: 140, height: 140,
//     borderRadius: 70, bottom: -30, left: 40,
//   },

//   // Back button
//   backBtn: {
//     flexDirection: 'row', alignItems: 'center', gap: 6,
//     alignSelf: 'flex-start', marginBottom: 16,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
//   },
//   backText: { color: '#fff', fontSize: 13, fontWeight: '600' },

//   // Brand
//   brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
//   logoWrap: {
//     width: 52, height: 52, borderRadius: 14,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center', justifyContent: 'center',
//     marginRight: 14, overflow: 'hidden',
//   },
//   logo: { width: 40, height: 40 },
//   brandName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
//   brandTagline: { fontSize: 12, color: 'rgba(255,255,255,0.72)', letterSpacing: 0.4, marginTop: 1 },

//   // Step indicator
//   stepRow: { flexDirection: 'row', alignItems: 'center' },
//   stepItem: { alignItems: 'center', gap: 4 },
//   stepDot: {
//     width: 30, height: 30, borderRadius: 15,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   stepDotActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
//   stepDotInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },
//   stepLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },
//   stepLine: { flex: 1, height: 2, marginHorizontal: 8, borderRadius: 1 },
//   stepLineActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
//   stepLineInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },

//   // Card
//   card: {
//     marginHorizontal: 20, marginTop: -16,
//     borderRadius: 24, padding: 28,
//     shadowOffset: { width: 0, height: 8 },
//   },
//   cardTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
//   cardSub: { fontSize: 14, marginBottom: 22 },

//   // Error / Success
//   errorBox: {
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     backgroundColor: '#FDE8E8', borderRadius: 10, padding: 12, marginBottom: 16,
//   },
//   errorText: { color: '#d32f2f', fontSize: 13, flex: 1 },
//   successBox: {
//     flexDirection: 'row', alignItems: 'center', gap: 8,
//     backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12, marginBottom: 16,
//   },
//   successText: { color: '#2e7d32', fontSize: 13, flex: 1 },

//   // Field
//   fieldWrap: { marginBottom: 14 },
//   fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 7 },
//   inputBox: {
//     flexDirection: 'row', alignItems: 'center',
//     borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 52,
//   },
//   inputIcon: { marginRight: 10 },
//   inputText: { flex: 1, fontSize: 15 },
//   eyeBtn: { padding: 4 },

//   // OTP
//   otpIconWrap: {
//     width: 80, height: 80, borderRadius: 24,
//     alignItems: 'center', justifyContent: 'center',
//     alignSelf: 'center', marginBottom: 20,
//   },
//   otpInputBox: { justifyContent: 'center' },
//   otpText: { fontSize: 22, fontWeight: '700', letterSpacing: 8, textAlign: 'center' },
//   otpHint: { fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: -4 },
//   resendText: { color: '#FF6B2C', fontWeight: '700' },

//   // Primary button
//   primaryBtn: {
//     flexDirection: 'row',
//     backgroundColor: '#FF6B2C',
//     height: 54, borderRadius: 14,
//     alignItems: 'center', justifyContent: 'center',
//     shadowColor: '#FF6B2C',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.38, shadowRadius: 12, elevation: 6,
//     marginTop: 8,
//   },
//   primaryBtnDisabled: { opacity: 0.7 },
//   primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

//   // Divider
//   divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
//   divLine: { flex: 1, height: 1 },
//   divText: { fontSize: 13 },

//   // Secondary button
//   secondaryBtn: {
//     height: 50, borderRadius: 14, borderWidth: 1.5,
//     alignItems: 'center', justifyContent: 'center',
//   },
//   secondaryBtnText: { fontSize: 15, fontWeight: '700' },

//   // Footer
//   footerNote: { textAlign: 'center', marginTop: 28, fontSize: 13 },
// });

// export default SignUp;








import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useStore } from '../../../src/zustand/store';

const { height } = Dimensions.get('window');
const mainLogo = require('../../../assets/images/logo.png');

// ─── Inline Privacy Policy Content ───────────────────────────────────────────
const PrivacyPolicyContent = ({ isDark }) => {
  const theme = isDark ? dark : light;
  const Section = ({ title }) => (
    <Text style={[ppStyles.sectionTitle, theme.text]}>{title}</Text>
  );
  const Bullet = ({ text }) => (
    <Text style={[ppStyles.listItem, theme.text]}>• {text}</Text>
  );
  const Divider = () => (
    <View style={[ppStyles.divider, isDark ? ppStyles.darkDivider : ppStyles.lightDivider]} />
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={ppStyles.dateInfo}>
        <Text style={[ppStyles.dateText, theme.subText]}>
          <Text style={ppStyles.bold}>Effective Date:</Text> 03 December 2025
        </Text>
        <Text style={[ppStyles.dateText, theme.subText]}>
          <Text style={ppStyles.bold}>Last Updated:</Text> 03 December 2025
        </Text>
      </View>

      <Text style={[ppStyles.paragraph, theme.text]}>
        TurnOnSell ("we", "our", "us") operates the TurnOnSell mobile application and website
        (https://turnonsell.com). This Privacy Policy explains how we collect, use, and protect
        user information on our platform.
      </Text>

      <View style={ppStyles.alertInfo}>
        <Ionicons name="information-circle-outline" size={18} color="#1976d2" />
        <Text style={ppStyles.alertInfoText}>By using TurnOnSell, you agree to this policy.</Text>
      </View>

      <Divider />
      <Section title="1. Information We Collect" />
      <Text style={[ppStyles.paragraph, theme.text]}>We collect only the information needed to run the platform.</Text>
      <Text style={[ppStyles.subTitle, theme.text]}>Personal Information:</Text>
      {["Name", "Mobile number", "Email (if provided)", "College name", "Profile image (if uploaded)"].map(i => <Bullet key={i} text={i} />)}
      <Text style={[ppStyles.subTitle, theme.text]}>Product Information:</Text>
      {["Item title and description", "Photos uploaded by the user", "Category details (book, clothes, electronics, etc.)", "College location"].map(i => <Bullet key={i} text={i} />)}
      <Text style={[ppStyles.subTitle, theme.text]}>We do not collect:</Text>
      {["Bank details", "Card details", "Payment information", "Aadhaar / PAN", "Exact GPS location", "Biometric data"].map(i => <Bullet key={i} text={i} />)}

      <Divider />
      <Section title="2. How We Use Your Data" />
      {["Create and manage user accounts", "Show listings inside your own college", "Enable buyer–seller communication", "Display product details", "Maintain system functionality", "Improve platform performance", "Prevent misuse or spam"].map(i => <Bullet key={i} text={i} />)}

      <Divider />
      <Section title="3. Data Sharing" />
      <Text style={[ppStyles.paragraph, theme.text]}>We do not sell or rent your data. We share limited information only:</Text>
      {["Between buyers and sellers for contact and meeting purposes", "If required by law or legal authority", "To protect the platform from misuse or fraud"].map(i => <Bullet key={i} text={i} />)}
      <View style={ppStyles.alertSuccess}>
        <Ionicons name="checkmark-circle-outline" size={18} color="#2e7d32" />
        <Text style={ppStyles.alertSuccessText}>No third-party marketing, no advertisers.</Text>
      </View>

      <Divider />
      <Section title="4. Payments & Transactions" />
      <Text style={[ppStyles.paragraph, theme.text]}>
        TurnOnSell does not handle payments. All transactions are direct, offline, face-to-face, and
        user-to-user. We are not involved in payment collection, pricing decisions, refunds, or delivery.
      </Text>

      <Divider />
      <Section title="5. Data Security" />
      {["Secure servers", "Controlled access", "Regular system checks"].map(i => <Bullet key={i} text={i} />)}
      <Text style={[ppStyles.paragraph, theme.text]}>However, no internet system can guarantee full security.</Text>

      <Divider />
      <Section title="6. Account Deletion & User Rights" />
      {["Edit your information", "Delete your listings", "Delete your account anytime from within the app"].map(i => <Bullet key={i} text={i} />)}
      <View style={ppStyles.alertWarning}>
        <Ionicons name="warning-outline" size={18} color="#e65100" />
        <Text style={ppStyles.alertWarningText}>
          If a user uploads any inappropriate, illegal, or abusive content, TurnOnSell reserves the
          right to immediately delete the user account along with all posts permanently without notice.
        </Text>
      </View>

      <Divider />
      <Section title="7. Data Retention" />
      {["Only while the account is active", "Until the user deletes the account", "If legally required by law"].map(i => <Bullet key={i} text={i} />)}
      <Text style={[ppStyles.paragraph, theme.text]}>
        Once deleted, all user data and listings are permanently removed and cannot be recovered.
      </Text>

      <Divider />
      <Section title="8. Age Requirement" />
      <Text style={[ppStyles.paragraph, theme.text]}>
        TurnOnSell is intended for users 18 years and above. We do not knowingly allow minors on this platform.
      </Text>

      <Divider />
      <Section title="9. Cookies" />
      {["Maintain login sessions", "Improve user experience"].map(i => <Bullet key={i} text={i} />)}
      <Text style={[ppStyles.paragraph, theme.text]}>Cookies do not collect personal details.</Text>

      <Divider />
      <Section title="10. Policy Changes" />
      <Text style={[ppStyles.paragraph, theme.text]}>
        This Privacy Policy may be updated. All updates will reflect a new "Last Updated" date.
      </Text>

      <Divider />
      <Section title="11. Contact" />
      <Text style={[ppStyles.paragraph, theme.text]}>
        <Text style={ppStyles.bold}>Email:</Text> turnonsell@gmail.com{"\n"}
        <Text style={ppStyles.bold}>Website:</Text> https://turnonsell.com{"\n"}
        <Text style={ppStyles.bold}>Location:</Text> Mumbai, India
      </Text>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

// ─── Main SignUp Component ────────────────────────────────────────────────────
const SignUp = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState("signup"); // 'signup' | 'otp' | 'success'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Privacy modal
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const modalFade = useRef(new Animated.Value(0)).current;
  const modalSlide = useRef(new Animated.Value(80)).current;

  // Availability checking
  const [nameStatus, setNameStatus] = useState({ checking: false, available: null, suggestions: [] });
  const [emailStatus, setEmailStatus] = useState({ checking: false, available: null });
  const nameTimeout = useRef(null);
  const emailTimeout = useRef(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const cardAnim = useRef(new Animated.Value(60)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const stepFade = useRef(new Animated.Value(1)).current;
  const successScale = useRef(new Animated.Value(0.5)).current;
  const successFade = useRef(new Animated.Value(0)).current;

  const baseURL = useStore((state) => state.baseURL);
  const darkMode = useStore((state) => state.darkMode);
  const navigation = useNavigation();
  const isDark = darkMode === true || darkMode === "true";
  const theme = isDark ? dark : light;

  useEffect(() => {
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
    return () => {
      if (nameTimeout.current) clearTimeout(nameTimeout.current);
      if (emailTimeout.current) clearTimeout(emailTimeout.current);
    };
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

  const animateStepTransition = (callback) => {
    Animated.timing(stepFade, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      callback();
      Animated.timing(stepFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    });
  };

  const openPrivacyModal = () => {
    setShowPrivacyModal(true);
    Animated.parallel([
      Animated.timing(modalFade, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.spring(modalSlide, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
    ]).start();
  };

  const closePrivacyModal = () => {
    Animated.parallel([
      Animated.timing(modalFade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(modalSlide, { toValue: 80, duration: 200, useNativeDriver: true }),
    ]).start(() => setShowPrivacyModal(false));
  };

  // ── Availability checks ───────────────────────────────────────────────────
  const checkUsernameAvailability = async (username) => {
    if (!username || username.length < 2) { setNameStatus({ checking: false, available: null, suggestions: [] }); return; }
    try {
      setNameStatus(prev => ({ ...prev, checking: true }));
      await axios.post(`${baseURL}/api/signup`, { name: username.toLowerCase() });
      setNameStatus({ checking: false, available: true, suggestions: [] });
    } catch (err) {
      if (err.response?.data?.showSuggestions) {
        setNameStatus({ checking: false, available: false, suggestions: err.response.data.suggestions || [] });
      } else {
        setNameStatus({ checking: false, available: true, suggestions: [] });
      }
    }
  };

  const checkEmailAvailability = async (email) => {
    if (!email || !email.includes('@')) { setEmailStatus({ checking: false, available: null }); return; }
    try {
      setEmailStatus(prev => ({ ...prev, checking: true }));
      await axios.post(`${baseURL}/api/signup`, { email });
      setEmailStatus({ checking: false, available: true });
    } catch (err) {
      setEmailStatus({ checking: false, available: err.response?.data?.message === "Email already registered" ? false : true });
    }
  };

  // ── Input handler ─────────────────────────────────────────────────────────
  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "name") {
      if (nameTimeout.current) clearTimeout(nameTimeout.current);
      if (value.length >= 2) {
        setNameStatus(prev => ({ ...prev, checking: true }));
        nameTimeout.current = setTimeout(() => checkUsernameAvailability(value), 800);
      } else {
        setNameStatus({ checking: false, available: null, suggestions: [] });
      }
    }
    if (name === "email") {
      if (emailTimeout.current) clearTimeout(emailTimeout.current);
      if (value.includes('@')) {
        setEmailStatus(prev => ({ ...prev, checking: true }));
        emailTimeout.current = setTimeout(() => checkEmailAvailability(value), 1000);
      } else {
        setEmailStatus({ checking: false, available: null });
      }
    }
  };

  const handleSuggestionTap = (suggestion) => {
    setFormData(prev => ({ ...prev, name: suggestion }));
    setNameStatus({ checking: false, available: true, suggestions: [] });
  };

  // ── Submit handlers ───────────────────────────────────────────────────────
  const handleSignupSubmit = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required."); triggerShake(); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match."); triggerShake(); return;
    }
    if (emailStatus.available === false) {
      setError("This email is already registered."); triggerShake(); return;
    }
    if (nameStatus.available === false) {
      setError("Username is already taken. Please choose from suggestions."); triggerShake(); return;
    }
    setError("");
    openPrivacyModal();
  };

  const handlePrivacyAcceptAndSignup = async () => {
    closePrivacyModal();
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/api/signup`, { ...formData, privacy_policy: true });
      setSuccess(response.data.message || "OTP sent successfully!");
      animateStepTransition(() => setStep("otp"));
    } catch (err) {
      if (err.response?.data?.showSuggestions) {
        setNameStatus({ checking: false, available: false, suggestions: err.response.data.suggestions || [] });
        setError("Username already taken. Please choose from suggestions below.");
      } else {
        setError(err.response?.data?.message || "Something went wrong. Please try again.");
      }
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) { setError("Please enter the OTP."); triggerShake(); return; }
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${baseURL}/api/verify-otp`, {
        name: formData.name, email: formData.email, password: formData.password, otp, privacy_policy: true
      });
      setSuccess(response.data.message || "Signup successful!");
      animateStepTransition(() => {
        setStep("success");
        Animated.parallel([
          Animated.spring(successScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
          Animated.timing(successFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        ]).start();
      });
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const isSubmitDisabled = loading || nameStatus.available === false || emailStatus.available === false;

  // ── Status icon ───────────────────────────────────────────────────────────
  const StatusIcon = ({ status }) => {
    if (status.checking) return <ActivityIndicator size={16} color="#FF6B2C" style={{ marginLeft: 8 }} />;
    if (status.available === true) return <Ionicons name="checkmark-circle" size={18} color="#2e7d32" style={{ marginLeft: 8 }} />;
    if (status.available === false) return <Ionicons name="close-circle" size={18} color="#d32f2f" style={{ marginLeft: 8 }} />;
    return null;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: isDark ? '#0F0F14' : '#FFF8F2' }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

        {/* ── Header blob ── */}
        <View style={[styles.headerBlob, { backgroundColor: isDark ? '#1E1428' : '#FF6B2C' }]}>
          <View style={[styles.blobAccent, { backgroundColor: isDark ? '#FF6B2C33' : '#FF8C5A55' }]} />
          <View style={[styles.blobAccent2, { backgroundColor: isDark ? '#FF6B2C22' : '#FFAD8055' }]} />

          <Animated.View style={{ opacity: fadeAnim }}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.brandRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.logoWrap}>
              <Image source={mainLogo} style={styles.logo} resizeMode="contain" />
            </View>
            <View>
              <Text style={styles.brandName}>TurnOnSell</Text>
              <Text style={styles.brandTagline}>
                {step === "signup" ? "Join the community" : step === "otp" ? "Almost there!" : "Welcome aboard!"}
              </Text>
            </View>
          </Animated.View>

          {step !== "success" && (
            <Animated.View style={[styles.stepRow, { opacity: fadeAnim }]}>
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, styles.stepDotActive]}>
                  <Ionicons name="person-outline" size={13} color="#fff" />
                </View>
                <Text style={styles.stepLabel}>Details</Text>
              </View>
              <View style={[styles.stepLine, step === "otp" ? styles.stepLineActive : styles.stepLineInactive]} />
              <View style={styles.stepItem}>
                <View style={[styles.stepDot, step === "otp" ? styles.stepDotActive : styles.stepDotInactive]}>
                  <Ionicons name="shield-checkmark-outline" size={13} color="#fff" />
                </View>
                <Text style={styles.stepLabel}>Verify</Text>
              </View>
            </Animated.View>
          )}
        </View>

        {/* ── Card ── */}
        <Animated.View style={[styles.card, theme.card, { opacity: cardFade, transform: [{ translateY: cardAnim }, { translateX: shakeAnim }] }]}>
          <Animated.View style={{ opacity: stepFade }}>

            {/* ══ SIGNUP STEP ══ */}
            {step === "signup" && (
              <View>
                <Text style={[styles.cardTitle, theme.text]}>Create Account</Text>
                <Text style={[styles.cardSub, theme.subText]}>Sign up to start buying and selling</Text>

                {error ? (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle-outline" size={16} color="#d32f2f" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}

                {/* Username */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, theme.subText]}>Username</Text>
                  <View style={[styles.inputBox,
                    nameStatus.available === false ? styles.inputBoxError :
                    nameStatus.available === true ? styles.inputBoxSuccess : theme.inputBox
                  ]}>
                    <Ionicons name="person-outline" size={18}
                      color={nameStatus.available === false ? '#d32f2f' : nameStatus.available === true ? '#2e7d32' : isDark ? '#888' : '#AAA'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.inputText, theme.text]}
                      placeholder="Choose a username"
                      placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
                      autoCapitalize="none"
                      value={formData.name}
                      onChangeText={(text) => handleChange("name", text)}
                    />
                    <StatusIcon status={nameStatus} />
                  </View>

                  {/* Suggestions */}
                  {nameStatus.suggestions.length > 0 && (
                    <View style={[styles.suggestionsWrap, isDark ? styles.suggestionsWrapDark : styles.suggestionsWrapLight]}>
                      <View style={styles.suggestionsHeader}>
                        <Ionicons name="bulb-outline" size={14} color="#FF6B2C" />
                        <Text style={[styles.suggestionsTitle, theme.subText]}>Available usernames for you:</Text>
                      </View>
                      <View style={styles.chipsRow}>
                        {nameStatus.suggestions.map((s, i) => (
                          <TouchableOpacity key={i} style={[styles.chip, isDark ? styles.chipDark : styles.chipLight]} onPress={() => handleSuggestionTap(s)} activeOpacity={0.7}>
                            <Ionicons name="sparkles-outline" size={12} color="#FF6B2C" />
                            <Text style={styles.chipText}>{s}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* Email */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, theme.subText]}>Email</Text>
                  <View style={[styles.inputBox,
                    emailStatus.available === false ? styles.inputBoxError :
                    emailStatus.available === true ? styles.inputBoxSuccess : theme.inputBox
                  ]}>
                    <Ionicons name="mail-outline" size={18}
                      color={emailStatus.available === false ? '#d32f2f' : emailStatus.available === true ? '#2e7d32' : isDark ? '#888' : '#AAA'}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.inputText, theme.text]}
                      placeholder="you@email.com"
                      placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={formData.email}
                      onChangeText={(text) => handleChange("email", text)}
                    />
                    <StatusIcon status={emailStatus} />
                  </View>
                  {emailStatus.available === false && (
                    <View style={styles.fieldErrorRow}>
                      <Ionicons name="information-circle-outline" size={13} color="#d32f2f" />
                      <Text style={styles.fieldErrorText}>
                        Email already registered.{" "}
                        <Text style={styles.fieldErrorLink} onPress={() => navigation.navigate("Login")}>Sign in instead</Text>
                      </Text>
                    </View>
                  )}
                </View>

                {/* Password */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, theme.subText]}>Password</Text>
                  <View style={[styles.inputBox, theme.inputBox]}>
                    <Ionicons name="lock-closed-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.inputText, theme.text, { flex: 1 }]}
                      placeholder="Create a password"
                      placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
                      secureTextEntry={!showPassword}
                      value={formData.password}
                      onChangeText={(text) => handleChange("password", text)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                      <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={isDark ? "#666" : "#BBB"} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, theme.subText]}>Confirm Password</Text>
                  <View style={[styles.inputBox, theme.inputBox]}>
                    <Ionicons name="lock-closed-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.inputText, theme.text, { flex: 1 }]}
                      placeholder="Repeat your password"
                      placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
                      secureTextEntry={!showConfirmPassword}
                      value={formData.confirmPassword}
                      onChangeText={(text) => handleChange("confirmPassword", text)}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeBtn}>
                      <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color={isDark ? "#666" : "#BBB"} />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Privacy note */}
                <View style={[styles.privacyNoteRow, isDark ? styles.privacyNoteRowDark : styles.privacyNoteRowLight]}>
                  <Ionicons name="shield-checkmark-outline" size={14} color="#FF6B2C" />
                  <Text style={[styles.privacyNoteText, theme.subText]}>
                    By signing up, you agree to our{" "}
                    <Text style={styles.privacyLink} onPress={openPrivacyModal}>Privacy Policy</Text>
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, isSubmitDisabled && styles.primaryBtnDisabled]}
                  onPress={handleSignupSubmit}
                  disabled={isSubmitDisabled}
                  activeOpacity={0.85}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : (
                    <>
                      <Text style={styles.primaryBtnText}>Create Account</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={[styles.divLine, theme.divLine]} />
                  <Text style={[styles.divText, theme.subText]}>Have an account?</Text>
                  <View style={[styles.divLine, theme.divLine]} />
                </View>

                <TouchableOpacity style={[styles.secondaryBtn, theme.secondaryBtn]} onPress={() => navigation.navigate("Login")} activeOpacity={0.8}>
                  <Text style={[styles.secondaryBtnText, { color: isDark ? '#FF8C5A' : '#FF6B2C' }]}>Sign In Instead</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ══ OTP STEP ══ */}
            {step === "otp" && (
              <View>
                <Text style={[styles.cardTitle, theme.text]}>Verify Email</Text>
                <Text style={[styles.cardSub, theme.subText]}>OTP sent to {formData.email}</Text>

                {error ? (
                  <View style={styles.errorBox}>
                    <Ionicons name="alert-circle-outline" size={16} color="#d32f2f" />
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                ) : null}
                {success ? (
                  <View style={styles.successBox}>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#2e7d32" />
                    <Text style={styles.successText}>{success}</Text>
                  </View>
                ) : null}

                <View style={[styles.otpIconWrap, { backgroundColor: isDark ? '#2A1F38' : '#FFF0E8' }]}>
                  <Ionicons name="shield-checkmark-outline" size={40} color="#FF6B2C" />
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={[styles.fieldLabel, theme.subText]}>One-Time Password</Text>
                  <View style={[styles.inputBox, theme.inputBox, styles.otpInputBox]}>
                    <Ionicons name="keypad-outline" size={18} color={isDark ? '#888' : '#AAA'} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.inputText, theme.text, styles.otpText]}
                      placeholder="• • • • • •"
                      placeholderTextColor={isDark ? "#555" : "#C0B8B0"}
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                      maxLength={6}
                    />
                  </View>
                </View>

                <Text style={[styles.otpHint, theme.subText]}>
                  Didn't receive it?{" "}
                  <Text style={styles.resendText} onPress={handlePrivacyAcceptAndSignup}>Resend OTP</Text>
                </Text>

                <TouchableOpacity
                  style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                  onPress={handleOtpSubmit}
                  disabled={loading}
                  activeOpacity={0.85}
                >
                  {loading ? <ActivityIndicator color="#fff" /> : (
                    <>
                      <Text style={styles.primaryBtnText}>Verify & Continue</Text>
                      <Ionicons name="checkmark-circle-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.secondaryBtn, theme.secondaryBtn, { marginTop: 12 }]}
                  onPress={() => animateStepTransition(() => { setStep("signup"); setError(""); setSuccess(""); })}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.secondaryBtnText, { color: isDark ? '#FF8C5A' : '#FF6B2C' }]}>Change Email</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ══ SUCCESS STEP ══ */}
            {step === "success" && (
              <Animated.View style={[styles.successContainer, { opacity: successFade, transform: [{ scale: successScale }] }]}>
                <View style={[styles.successIconRing, { backgroundColor: isDark ? '#1A2E1A' : '#E8F5E9' }]}>
                  <Ionicons name="checkmark-circle" size={72} color="#2e7d32" />
                </View>
                <Text style={[styles.successTitle, theme.text]}>Account Created!</Text>
                <Text style={[styles.successMsg, theme.subText]}>
                  Your account has been successfully created. You can now start buying and selling on TurnOnSell.
                </Text>
                <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate("Login")} activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>Go to Login</Text>
                  <Ionicons name="log-in-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </Animated.View>
            )}

          </Animated.View>
        </Animated.View>

        <Animated.Text style={[styles.footerNote, { opacity: cardFade, color: isDark ? '#444' : '#C9BDB5' }]}>
          Your marketplace for second-hand treasures 🏷️
        </Animated.Text>
      </ScrollView>

      {/* ══ Privacy Policy Bottom Sheet Modal ══ */}
      <Modal visible={showPrivacyModal} transparent animationType="none" onRequestClose={closePrivacyModal} statusBarTranslucent>
        <Animated.View style={[styles.modalOverlay, { opacity: modalFade }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closePrivacyModal} />
          <Animated.View style={[
            styles.modalSheet,
            isDark ? styles.modalSheetDark : styles.modalSheetLight,
            { transform: [{ translateY: modalSlide }] }
          ]}>
            {/* Header */}
            <View style={[styles.modalHeader, isDark ? styles.modalHeaderDark : styles.modalHeaderLight]}>
              <View style={styles.modalHandleBar} />
              <View style={styles.modalTitleRow}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#fff" />
                <Text style={styles.modalTitle}>Privacy Policy</Text>
              </View>
              <TouchableOpacity style={styles.modalCloseBtn} onPress={closePrivacyModal}>
                <Ionicons name="close" size={20} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.modalBody}>
              <PrivacyPolicyContent isDark={isDark} />
            </View>

            {/* Actions */}
            <View style={[styles.modalFooter, isDark ? styles.modalFooterDark : styles.modalFooterLight]}>
              <TouchableOpacity
                style={[styles.modalCancelBtn, isDark ? styles.modalCancelBtnDark : styles.modalCancelBtnLight]}
                onPress={closePrivacyModal}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalCancelText, { color: isDark ? '#FF8C5A' : '#FF6B2C' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalAcceptBtn, loading && styles.primaryBtnDisabled]}
                onPress={handlePrivacyAcceptAndSignup}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? <ActivityIndicator color="#fff" size="small" /> : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={16} color="#fff" />
                    <Text style={styles.modalAcceptText}>Accept & Continue</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

// ─── Light theme ──────────────────────────────────────────────────────────────
const light = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', shadowColor: '#FF6B2C', shadowOpacity: 0.12, shadowRadius: 24, elevation: 8 },
  text: { color: '#1C1410' },
  subText: { color: '#9A8E87' },
  inputBox: { borderColor: '#EDE5DF', backgroundColor: '#FDFAF8' },
  divLine: { backgroundColor: '#EDE5DF' },
  secondaryBtn: { borderColor: '#FF6B2C', backgroundColor: '#FFF5F0' },
});

// ─── Dark theme ───────────────────────────────────────────────────────────────
const dark = StyleSheet.create({
  card: { backgroundColor: '#1A1520', shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 24, elevation: 10 },
  text: { color: '#F0EAE5' },
  subText: { color: '#665E6A' },
  inputBox: { borderColor: '#2D2535', backgroundColor: '#211C2A' },
  divLine: { backgroundColor: '#2D2535' },
  secondaryBtn: { borderColor: '#FF6B2C55', backgroundColor: '#2A1F1A' },
});

// ─── Base styles ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1, paddingBottom: 40 },

  headerBlob: {
    paddingTop: Platform.OS === 'ios' ? 56 : 40, paddingBottom: 32,
    paddingHorizontal: 24, overflow: 'hidden',
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  blobAccent: { position: 'absolute', width: 200, height: 200, borderRadius: 100, top: -60, right: -40 },
  blobAccent2: { position: 'absolute', width: 140, height: 140, borderRadius: 70, bottom: -30, left: 40 },

  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  backText: { color: '#fff', fontSize: 13, fontWeight: '600' },

  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  logoWrap: {
    width: 52, height: 52, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginRight: 14, overflow: 'hidden',
  },
  logo: { width: 40, height: 40 },
  brandName: { fontSize: 26, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.5 },
  brandTagline: { fontSize: 12, color: 'rgba(255,255,255,0.72)', letterSpacing: 0.4, marginTop: 1 },

  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepItem: { alignItems: 'center', gap: 4 },
  stepDot: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  stepDotActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
  stepDotInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  stepLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600' },
  stepLine: { flex: 1, height: 2, marginHorizontal: 8, borderRadius: 1 },
  stepLineActive: { backgroundColor: 'rgba(255,255,255,0.9)' },
  stepLineInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },

  card: { marginHorizontal: 20, marginTop: -16, borderRadius: 24, padding: 28, shadowOffset: { width: 0, height: 8 } },
  cardTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3, marginBottom: 4 },
  cardSub: { fontSize: 14, marginBottom: 22 },

  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FDE8E8', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: '#d32f2f', fontSize: 13, flex: 1 },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E8F5E9', borderRadius: 10, padding: 12, marginBottom: 16 },
  successText: { color: '#2e7d32', fontSize: 13, flex: 1 },

  fieldWrap: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 7 },
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, paddingHorizontal: 14, height: 52 },
  inputBoxError: { borderColor: '#d32f2f', backgroundColor: '#FFF5F5' },
  inputBoxSuccess: { borderColor: '#2e7d32', backgroundColor: '#F5FFF5' },
  inputIcon: { marginRight: 10 },
  inputText: { flex: 1, fontSize: 15 },
  eyeBtn: { padding: 4 },

  suggestionsWrap: { marginTop: 8, borderRadius: 10, padding: 12 },
  suggestionsWrapLight: { backgroundColor: '#FFF5F0', borderWidth: 1, borderColor: '#FFD5C2' },
  suggestionsWrapDark: { backgroundColor: '#2A1F1A', borderWidth: 1, borderColor: '#FF6B2C44' },
  suggestionsHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  suggestionsTitle: { fontSize: 12, fontWeight: '600' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16, borderWidth: 1 },
  chipLight: { backgroundColor: '#fff', borderColor: '#FF6B2C' },
  chipDark: { backgroundColor: '#3A2518', borderColor: '#FF6B2C66' },
  chipText: { fontSize: 13, color: '#FF6B2C', fontWeight: '600' },

  fieldErrorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 5 },
  fieldErrorText: { color: '#d32f2f', fontSize: 12 },
  fieldErrorLink: { color: '#FF6B2C', fontWeight: '700', textDecorationLine: 'underline' },

  privacyNoteRow: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 10, padding: 10, marginBottom: 12 },
  privacyNoteRowLight: { backgroundColor: '#FFF5F0' },
  privacyNoteRowDark: { backgroundColor: '#2A1F1A' },
  privacyNoteText: { fontSize: 12, flex: 1, lineHeight: 17 },
  privacyLink: { color: '#FF6B2C', fontWeight: '700', textDecorationLine: 'underline' },

  otpIconWrap: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 20 },
  otpInputBox: { justifyContent: 'center' },
  otpText: { fontSize: 22, fontWeight: '700', letterSpacing: 8, textAlign: 'center' },
  otpHint: { fontSize: 13, textAlign: 'center', marginBottom: 20, marginTop: -4 },
  resendText: { color: '#FF6B2C', fontWeight: '700' },

  primaryBtn: {
    flexDirection: 'row', backgroundColor: '#FF6B2C', height: 54, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF6B2C', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.38, shadowRadius: 12, elevation: 6, marginTop: 8,
  },
  primaryBtnDisabled: { opacity: 0.55 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800', letterSpacing: 0.3 },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  divLine: { flex: 1, height: 1 },
  divText: { fontSize: 13 },
  secondaryBtn: { height: 50, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { fontSize: 15, fontWeight: '700' },

  successContainer: { alignItems: 'center', paddingVertical: 20 },
  successIconRing: { width: 120, height: 120, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: '800', marginBottom: 12, letterSpacing: -0.3 },
  successMsg: { fontSize: 14, textAlign: 'center', lineHeight: 21, marginBottom: 28, paddingHorizontal: 8 },

  footerNote: { textAlign: 'center', marginTop: 28, fontSize: 13 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: height * 0.88, overflow: 'hidden' },
  modalSheetLight: { backgroundColor: '#fff' },
  modalSheetDark: { backgroundColor: '#1A1520' },
  modalHeader: { paddingTop: 10, paddingBottom: 16, paddingHorizontal: 20 },
  modalHeaderLight: { backgroundColor: '#FF6B2C' },
  modalHeaderDark: { backgroundColor: '#2A1420' },
  modalHandleBar: { width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)', alignSelf: 'center', marginBottom: 14 },
  modalTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '800', flex: 1 },
  modalCloseBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  modalBody: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  modalFooter: { flexDirection: 'row', gap: 12, padding: 16, borderTopWidth: 1 },
  modalFooterLight: { borderTopColor: '#EDE5DF', backgroundColor: '#fff' },
  modalFooterDark: { borderTopColor: '#2D2535', backgroundColor: '#1A1520' },
  modalCancelBtn: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  modalCancelBtnLight: { borderColor: '#FF6B2C', backgroundColor: '#FFF5F0' },
  modalCancelBtnDark: { borderColor: '#FF6B2C55', backgroundColor: '#2A1F1A' },
  modalCancelText: { fontSize: 15, fontWeight: '700' },
  modalAcceptBtn: {
    flex: 2, height: 48, borderRadius: 12, backgroundColor: '#FF6B2C',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#FF6B2C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  modalAcceptText: { color: '#fff', fontSize: 15, fontWeight: '800' },
});

// ─── Privacy Policy inline styles ─────────────────────────────────────────────
const ppStyles = StyleSheet.create({
  dateInfo: { marginBottom: 12 },
  dateText: { fontSize: 12, marginBottom: 2 },
  bold: { fontWeight: '700' },
  paragraph: { fontSize: 13, lineHeight: 20, marginBottom: 10 },
  sectionTitle: { fontSize: 15, fontWeight: '800', marginTop: 4, marginBottom: 8 },
  subTitle: { fontSize: 13, fontWeight: '700', marginTop: 8, marginBottom: 4 },
  listItem: { fontSize: 13, lineHeight: 20, marginLeft: 8, marginBottom: 2 },
  divider: { height: 1, marginVertical: 14 },
  lightDivider: { backgroundColor: '#EDE5DF' },
  darkDivider: { backgroundColor: '#2D2535' },
  alertInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E3F2FD', borderRadius: 8, padding: 10, marginBottom: 10 },
  alertInfoText: { color: '#1976d2', fontSize: 12, fontWeight: '600', flex: 1 },
  alertSuccess: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E8F5E9', borderRadius: 8, padding: 10, marginTop: 8 },
  alertSuccessText: { color: '#2e7d32', fontSize: 12, fontWeight: '600', flex: 1 },
  alertWarning: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: '#FFF3E0', borderRadius: 8, padding: 10, marginTop: 8 },
  alertWarningText: { color: '#e65100', fontSize: 12, flex: 1, lineHeight: 18 },
});

export default SignUp;