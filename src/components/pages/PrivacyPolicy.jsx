import React from "react";
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useStore } from "";


const PrivacyPolicy = () => {
  const navigation = useNavigation();
  const darkMode = useStore((state) => state.darkMode);
  const isDark = darkMode === true || darkMode === "true";

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.darkContainer : styles.lightContainer]}>
      {/* Header */}
      <View style={[styles.header, isDark ? styles.darkHeader : styles.lightHeader]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, isDark ? styles.darkText : styles.lightText]}>
          Privacy Policy
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, isDark ? styles.darkCard : styles.lightCard]}>
          
          <View style={styles.dateInfo}>
            <Text style={[styles.dateText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              <Text style={styles.bold}>Effective Date:</Text> 03 December 2025
            </Text>
            <Text style={[styles.dateText, isDark ? styles.darkSubtext : styles.lightSubtext]}>
              <Text style={styles.bold}>Last Updated:</Text> 03 December 2025
            </Text>
          </View>

          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            TurnOnSell ("we", "our", "us") operates the TurnOnSell mobile
            application and website (https://turnonsell.com). This Privacy Policy
            explains how we collect, use, and protect user information on our
            platform.
          </Text>

          <View style={styles.alertInfo}>
            <Ionicons name="information-circle-outline" size={20} color="#1976d2" />
            <Text style={styles.alertInfoText}>
              By using TurnOnSell, you agree to this policy.
            </Text>
          </View>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 1 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            1. Information We Collect
          </Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            We collect only the information needed to run the platform.
          </Text>
          
          <Text style={[styles.subTitle, isDark ? styles.darkText : styles.lightText]}>Personal Information:</Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Name</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Mobile number</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Email (if provided)</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• College name</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Profile image (if uploaded)</Text>
          </View>

          <Text style={[styles.subTitle, isDark ? styles.darkText : styles.lightText]}>Product Information:</Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>When a user lists items:</Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Item title and description</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Photos uploaded by the user</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Category details (book, clothes, electronics, etc.)</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• College location</Text>
          </View>

          <Text style={[styles.subTitle, isDark ? styles.darkText : styles.lightText]}>Messages:</Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            Messages exchanged between users are stored to enable communication.
          </Text>

          <Text style={[styles.subTitle, isDark ? styles.darkText : styles.lightText]}>We do not collect:</Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Bank details</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Card details</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Payment information</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Aadhaar / PAN</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Exact GPS location</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Biometric data</Text>
          </View>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 2 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            2. How We Use Your Data
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Create and manage user accounts</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Show listings inside your own college</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Enable buyer–seller communication</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Display product details</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Maintain system functionality</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Improve platform performance</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Prevent misuse or spam</Text>
          </View>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 3 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            3. Data Sharing
          </Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            We do not sell or rent your data.{"\n"}We share limited information only:
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Between buyers and sellers for contact and meeting purposes</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• If required by law or legal authority</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• To protect the platform from misuse or fraud</Text>
          </View>
          <View style={styles.alertSuccess}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#2e7d32" />
            <Text style={styles.alertSuccessText}>
              No third-party marketing, no advertisers.
            </Text>
          </View>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 4 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            4. Payments & Transactions
          </Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            TurnOnSell does not handle payments. All transactions are:
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Direct</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Offline</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Face-to-face</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• User-to-user</Text>
          </View>
          
          <Text style={[styles.subTitle, { marginTop: 12 }, isDark ? styles.darkText : styles.lightText]}>We are not involved in:</Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Payment collection</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Pricing decisions</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Refunds</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Delivery</Text>
          </View>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 5 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            5. Data Security
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Secure servers</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Controlled access</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Regular system checks</Text>
          </View>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            However, no internet system can guarantee full security.
          </Text>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 6 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            6. Account Deletion & User Rights
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Edit your information</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Delete your listings</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Delete your account anytime from within the app</Text>
          </View>
          <View style={styles.alertWarning}>
            <Ionicons name="warning-outline" size={20} color="#e65100" />
            <Text style={styles.alertWarningText}>
              If a user uploads any inappropriate, illegal, or abusive content,
              TurnOnSell reserves the right to immediately delete the user account
              along with all posts permanently without notice.
            </Text>
          </View>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 7 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            7. Data Retention
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Only while the account is active</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Until the user deletes the account</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• If legally required by law</Text>
          </View>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            Once an account is deleted by the user or by TurnOnSell, all user data
            and listings are permanently removed from our system and cannot be
            recovered.
          </Text>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 8 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            8. Age Requirement
          </Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            TurnOnSell is intended for users 18 years and above. We do not knowingly allow minors on this platform.
          </Text>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 9 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            9. Cookies
          </Text>
          <View style={styles.list}>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Maintain login sessions</Text>
            <Text style={[styles.listItem, isDark ? styles.darkText : styles.lightText]}>• Improve user experience</Text>
          </View>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            Cookies do not collect personal details.
          </Text>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 10 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            10. Policy Changes
          </Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            This Privacy Policy may be updated. All updates will reflect a new "Last Updated" date.
          </Text>

          <View style={[styles.divider, isDark ? styles.darkDivider : styles.lightDivider]} />

          {/* Section 11 */}
          <Text style={[styles.sectionTitle, isDark ? styles.darkText : styles.lightText]}>
            11. Contact
          </Text>
          <Text style={[styles.paragraph, isDark ? styles.darkText : styles.lightText]}>
            <Text style={styles.bold}>Email:</Text> turnonsell@gmail.com{"\n"}
            <Text style={styles.bold}>Website:</Text> https://turnonsell.com{"\n"}
            <Text style={styles.bold}>Location:</Text> Mumbai, India
          </Text>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lightHeader: {
    backgroundColor: "#fff",
    borderBottomColor: "#eee",
  },
  darkHeader: {
    backgroundColor: "#1e1e1e",
    borderBottomColor: "#333",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  lightText: {
    color: "#333",
  },
  darkText: {
    color: "#fff",
  },
  lightSubtext: {
    color: "#666",
  },
  darkSubtext: {
    color: "#aaa",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  lightCard: {
    backgroundColor: "#fff",
  },
  darkCard: {
    backgroundColor: "#1e1e1e",
  },
  bold: {
    fontWeight: "bold",
  },
  dateInfo: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  list: {
    paddingLeft: 10,
    marginBottom: 12,
  },
  listItem: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 6,
  },
  divider: {
    height: 1,
    marginVertical: 24,
  },
  lightDivider: {
    backgroundColor: "#e0e0e0",
  },
  darkDivider: {
    backgroundColor: "#333",
  },
  alertInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    borderWidth: 1,
    borderColor: "#90caf9",
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    gap: 12,
  },
  alertInfoText: {
    color: "#1976d2",
    fontWeight: "bold",
    flex: 1,
  },
  alertSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#81c784",
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    gap: 12,
  },
  alertSuccessText: {
    color: "#2e7d32",
    fontWeight: "bold",
    flex: 1,
  },
  alertWarning: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff3e0",
    borderWidth: 1,
    borderColor: "#ffb74d",
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
    gap: 12,
  },
  alertWarningText: {
    color: "#e65100",
    flex: 1,
    lineHeight: 20,
  },
});

export default PrivacyPolicy;




