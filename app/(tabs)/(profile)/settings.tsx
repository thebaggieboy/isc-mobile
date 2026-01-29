import { DefaultColors } from "@/constants/colors";
import { 
  Moon,
  Globe,
  DollarSign,
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

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const settingsOptions = [
    {
      id: "language",
      icon: Globe,
      label: "Language",
      value: "English",
      type: "select",
    },
    {
      id: "currency",
      icon: DollarSign,
      label: "Currency",
      value: "NGN (₦)",
      type: "select",
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Appearance Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Appearance</Text>
            <View style={styles.settingsCard}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.iconContainer}>
                    <Moon size={20} color={DefaultColors.white} />
                  </View>
                  <View>
                    <Text style={styles.settingLabel}>Dark Mode</Text>
                    <Text style={styles.settingDescription}>
                      Use dark theme
                    </Text>
                  </View>
                </View>
                <Switch
                  value={darkMode}
                  onValueChange={setDarkMode}
                  trackColor={{ false: "#333", true: DefaultColors.white }}
                  thumbColor={darkMode ? DefaultColors.black : "#888"}
                />
              </View>
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.settingsCard}>
              {settingsOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.settingItem,
                      index !== settingsOptions.length - 1 && styles.settingItemBorder
                    ]}
                  >
                    <View style={styles.settingLeft}>
                      <View style={styles.iconContainer}>
                        <Icon size={20} color={DefaultColors.white} />
                      </View>
                      <View>
                        <Text style={styles.settingLabel}>{option.label}</Text>
                        <Text style={styles.settingValue}>{option.value}</Text>
                      </View>
                    </View>
                    <ChevronRight size={20} color="#888" />
                  </TouchableOpacity>
                );
              })}
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
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: "#888",
  },
  settingValue: {
    fontSize: 13,
    color: "#888",
    fontWeight: "500",
  },
});