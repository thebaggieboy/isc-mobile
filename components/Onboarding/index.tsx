import { useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { 
  Shield,
  Lock,
  TrendingUp,
  Target
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {/* Logo/Icon */}
          <View style={styles.logoContainer}>
            <View style={styles.logoOuter}>
              <View style={styles.logoInner}>
                <Shield size={48} color="#ff4444" strokeWidth={2.5} />
              </View>
            </View>
          </View>

          {/* App Name */}
          <Text style={styles.appName}>SaveGuard</Text>
          <Text style={styles.tagline}>Master Your Impulses</Text>

          {/* Features Grid */}
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Lock size={20} color="#ff4444" />
              </View>
              <Text style={styles.featureText}>Lock Funds</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <TrendingUp size={20} color="#ff4444" />
              </View>
              <Text style={styles.featureText}>Track Progress</Text>
            </View>
            
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Target size={20} color="#ff4444" />
              </View>
              <Text style={styles.featureText}>Stay Focused</Text>
            </View>
          </View>

          {/* Value Proposition */}
          <View style={styles.valueSection}>
            <Text style={styles.valueTitle}>
              Take Control of Your Spending
            </Text>
            <Text style={styles.valueDescription}>
              Lock your money for set periods, build better habits, and watch your savings grow.
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={styles.signupButton}
            onPress={() => router.push("/signup")}
            activeOpacity={0.8}
          >
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push("/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {" "}and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ff444410",
    justifyContent: "center",
    alignItems: "center",
  },
  logoInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: DefaultColors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 36,
    fontWeight: "800",
    color: DefaultColors.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ff4444",
    marginBottom: 48,
  },
  featuresGrid: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 48,
  },
  featureItem: {
    alignItems: "center",
    gap: 8,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ff444410",
    justifyContent: "center",
    alignItems: "center",
  },
  featureText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
  },
  valueSection: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  valueTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: DefaultColors.white,
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 28,
  },
  valueDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
  actionSection: {
    gap: 12,
    paddingBottom: 8,
  },
  signupButton: {
    backgroundColor: "#ff4444",
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#ff4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  loginButton: {
    backgroundColor: DefaultColors.black,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#222",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  termsText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 8,
  },
  termsLink: {
    color: "#ff4444",
    fontWeight: "600",
  },
});