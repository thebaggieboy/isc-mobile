import { DefaultColors } from "@/constants/colors";
import { 
  Lock,
  Key,
  Fingerprint,
  Shield,
  ChevronRight
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Switch
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function SecurityScreen() {
  const [biometrics, setBiometrics] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Authentication Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Authentication</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Fingerprint size={20} color={DefaultColors.white} />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>Biometric Login</Text>
                    <Text style={styles.settingDescription}>
                      Use fingerprint or face ID
                    </Text>
                  </View>
                </View>
                <Switch
                  value={biometrics}
                  onValueChange={setBiometrics}
                  trackColor={{ false: "#333", true: DefaultColors.white }}
                  thumbColor={biometrics ? DefaultColors.black : "#888"}
                />
              </View>

              <View style={[styles.settingItem, styles.settingItemBorder]}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Shield size={20} color={DefaultColors.white} />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>Two-Factor Auth</Text>
                    <Text style={styles.settingDescription}>
                      Extra security layer
                    </Text>
                  </View>
                </View>
                <Switch
                  value={twoFactor}
                  onValueChange={setTwoFactor}
                  trackColor={{ false: "#333", true: DefaultColors.white }}
                  thumbColor={twoFactor ? DefaultColors.black : "#888"}
                />
              </View>
            </View>
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Password & PIN</Text>
            <View style={styles.settingsCard}>
              <TouchableOpacity style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Key size={20} color={DefaultColors.white} />
                  </View>
                  <Text style={styles.settingLabel}>Change Password</Text>
                </View>
                <ChevronRight size={20} color="#888" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingItem, styles.settingItemBorder]}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Lock size={20} color={DefaultColors.white} />
                  </View>
                  <Text style={styles.settingLabel}>Change PIN</Text>
                </View>
                <ChevronRight size={20} color="#888" />
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: DefaultColors.white,
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: DefaultColors.black,
    borderRadius: 16,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  settingDescription: {
    fontSize: 13,
    color: "#888",
  },
});