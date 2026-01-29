import { DefaultColors } from "@/constants/colors";
import { Shield } from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  Animated
} from "react-native";
import { useEffect, useRef } from "react";

export default function PreloaderScreen() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in and scale animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <View style={styles.logoInner}>
              <Shield size={56} color="#ff4444" strokeWidth={2.5} />
            </View>
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>SaveGuard</Text>
        <Text style={styles.tagline}>Master Your Impulses</Text>

        {/* Loading Indicator */}
        <ActivityIndicator 
          size="large" 
          color="#ff4444" 
          style={styles.loader}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#ff444410",
    justifyContent: "center",
    alignItems: "center",
  },
  logoInner: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: DefaultColors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 40,
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
  loader: {
    marginTop: 24,
  },
});