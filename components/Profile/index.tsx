import { useRouter } from "expo-router";
import { DefaultColors } from "@/constants/colors";
import { 
  User,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  Phone,
  Edit
} from "lucide-react-native";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";

interface ProfileProps {
  userName: string;
  userEmail: string;
  userPhone?: string;
  userAvatar?: string;
}

export default function Profile({ 
  userName, 
  userEmail, 
  userPhone,
  userAvatar
}: ProfileProps) {
  const router = useRouter();

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logging out...");
  };

  const menuItems = [
    {
      id: "settings",
      icon: Settings,
      label: "Settings",
      route: "/settings",
    },
    {
      id: "security",
      icon: Shield,
      label: "Security",
      route: "/security",
    },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      route: "/notifications",
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help & Support",
      route: "/help",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileView}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color={DefaultColors.white} />
              </View>
            )}
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push("/edit-profile")}
            >
              <Edit size={14} color={DefaultColors.black} />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userName}</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Mail size={14} color="#888" />
              <Text style={styles.contactText}>{userEmail}</Text>
            </View>
            {userPhone && (
              <View style={styles.contactItem}>
                <Phone size={14} color="#888" />
                <Text style={styles.contactText}>{userPhone}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Icon size={20} color={DefaultColors.white} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                <ChevronRight size={20} color="#888" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={18} color="#ff4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DefaultColors.background,
  },
  profileView: {
    padding: 20,
  },
  profileHeader: {
    backgroundColor: DefaultColors.black,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DefaultColors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: DefaultColors.black,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: DefaultColors.white,
    marginBottom: 12,
  },
  contactInfo: {
    gap: 8,
    alignItems: "center",
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  contactText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  menuSection: {
    backgroundColor: DefaultColors.black,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  menuItemLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: DefaultColors.white,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 14,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ff4444",
  },
  versionText: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
  },
});