import { Pressable, StyleProp, Text, TextStyle, ViewStyle } from "react-native";
import { styles } from "./styles";
import { BanknoteArrowUp, LucideIcon } from "lucide-react-native";

interface ButtonProps {
  title: string;
  buttonStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
}
export default function Button({
  title,
  buttonStyle,
  titleStyle,
  children,
  onPress,
  disabled,
}: ButtonProps) {
  return (
    <Pressable
      style={[styles.button, buttonStyle, disabled && { opacity: 0.5 }]}
      onPress={disabled ? undefined : onPress}
    >
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      {children}
    </Pressable>
  );
}
