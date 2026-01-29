import { useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { 
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  TextInput,
  StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Here you would normally handle authentication
    // For now, just navigate to the home screen
    router.replace("/(home)");
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

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Lock size={32} color="#ff4444" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Log in to continue managing your savings
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
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

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Lock size={20} color="#888" />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
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

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
  backButton: {
    padding: 16,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
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
    gap: 24,
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
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ff4444",
  },
  loginButton: {
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
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: DefaultColors.white,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ff4444",
  },
});