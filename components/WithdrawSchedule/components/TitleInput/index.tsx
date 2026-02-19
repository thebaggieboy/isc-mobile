import { DefaultColors } from "@/constants/colors";
import { List } from "lucide-react-native";
import { Text, TextInput, View } from "react-native";
import { styles } from "./styles";

interface TitleInputProps {
    title: string;
    onTitleChange: (title: string) => void;
}

export default function TitleInput({
    title,
    onTitleChange,
}: TitleInputProps) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <List
                    size={16}
                    color={DefaultColors.white}
                />
                <Text style={styles.title}>Schedule Title</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={onTitleChange}
                    placeholder="e.g., Vacation Savings"
                    placeholderTextColor={DefaultColors.gray}
                />
            </View>
        </View>
    );
}
