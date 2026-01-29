// app/(auth)/signup.tsx
import { useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { 
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Phone
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    // Skip authentication for now - go straight to tabs (which contains home)
    router.replace("/(tabs)/(home)");
    
    // Later, add authentication here:
    // const response = await api.signup(name, email, password);
    // await AsyncStorage.setItem('authToken', response.token);
    // router.replace("/(tabs)/(home)");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color={DefaultColors.white} />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <User size={32} color="#ff4444" />
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Start your journey to better savings
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#888"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#888"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#888"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#888"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color="#888" />
                  ) : (
                    <Eye size={20} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#888" />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#888"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#888" />
                  ) : (
                    <Eye size={20} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms */}
            <Text style={styles.termsText}>
              By creating an account, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {" "}and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            {/* Signup Button */}
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>Create Account</Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  backButton: {
    padding: 16,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#ff444410",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: DefaultColors.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DefaultColors.black,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: DefaultColors.white,
  },
  termsText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
    marginTop: 4,
  },
  termsLink: {
    color: "#ff4444",
    fontWeight: "600",
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
    marginTop: 8,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff4444",
  },
});