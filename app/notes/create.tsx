import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";
import { Alert } from "react-native";
import { createNote } from "@/lib/notes-repository";

export default function CreateNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Validation", "Please enter a note title.");
      return;
    }

    try {
      setIsSaving(true);
      await createNote({
        title: title.trim(),
        content: content.trim(),
      });

      router.back();
    } catch {
      Alert.alert("Error", "Unable to create note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <VStack space="md">
        <Box className="mb-4">
          <Text className="text-xs text-gray-500 mb-2">Title</Text>
          <Input className="border border-gray-300 rounded-lg">
            <InputField
              className="text-lg font-bold"
              value={title}
              onChangeText={setTitle}
              placeholder="Note title"
            />
          </Input>
        </Box>

        <Text className="text-xs text-gray-500 mb-2">Content</Text>
        <Input className="border border-gray-300 rounded-lg p-3 min-h-[150px]">
          <InputField
            className="text-base font-normal"
            value={content}
            onChangeText={setContent}
            placeholder="Note content"
            multiline
            textAlignVertical="top"
          />
        </Input>

        <HStack space="md">
          <Button
            className="flex-1 bg-green-500"
            onPress={() => void handleCreate()}
            size="lg"
            isDisabled={isSaving}
          >
            <ButtonText>{isSaving ? "Creating..." : "Create"}</ButtonText>
          </Button>
          <Button
            className="flex-1 bg-gray-400"
            onPress={handleCancel}
            size="lg"
            isDisabled={isSaving}
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </View>
  );
}
