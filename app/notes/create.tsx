import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Input, InputField } from "@/components/ui/input";

export default function CreateNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreate = () => {
    if (!title.trim()) {
      alert("Please enter a note title");
      return;
    }

    // Generate new note object
    const newNote = {
      id: `note_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Log to console (consistent with current persistence pattern)
    console.log("Created new note:", newNote);

    // Navigate back to home
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <VStack space="md">
        <Box className="mb-4">
          <Text className="text-xs text-gray-500 mb-2">Title</Text>
          <Input className="border border-gray-300 rounded-lg p-3">
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
            onPress={handleCreate}
            size="lg"
          >
            <ButtonText>Create</ButtonText>
          </Button>
          <Button
            className="flex-1 bg-gray-400"
            onPress={handleCancel}
            size="lg"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
        </HStack>
      </VStack>
    </View>
  );
}
