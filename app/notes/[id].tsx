import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { TextInput } from "react-native";
import { Input, InputField } from "@/components/ui/input";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Load notes from JSON
  const notes = require("../../notes.json");
  const note = notes.find((n: any) => n.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note?.title || "");
  const [editedContent, setEditedContent] = useState(note?.content || "");

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Note not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    // Update the note in the JSON file (in a real app, this would be a backend call)
    const updatedNotes = notes.map((n: any) =>
      n.id === id
        ? {
            ...n,
            title: editedTitle,
            content: editedContent,
            updated_at: new Date().toISOString(),
          }
        : n,
    );

    // In a real app, you would save this to a database or backend
    console.log("Updated notes:", updatedNotes);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Delete the note from the JSON file (in a real app, this would be a backend call)
    const updatedNotes = notes.filter((n: any) => n.id !== id);

    // In a real app, you would delete this from a database or backend
    console.log("Deleted note, remaining notes:", updatedNotes);
    router.back();
  };

  return (
    <View className="flex-1 bg-white p-4">
      <VStack space="md">
        {isEditing ? (
          <>
            <Box className="mb-4">
              <Text className="text-xs text-gray-500 mb-2">Title</Text>
              <Input className="border border-gray-300 rounded-lg p-3 mb-4">
                <InputField
                  className="text-lg font-bold"
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  placeholder="Note title"
                />
              </Input>
            </Box>

            <Text className="text-xs text-gray-500 mb-2">Content</Text>
            <Input className="border border-gray-300 rounded-lg p-3 mb-4 min-h-[150px]">
              <InputField
                className="text-base font-normal"
                value={editedContent}
                onChangeText={setEditedContent}
                placeholder="Note content"
                multiline
                textAlignVertical="top"
              />
            </Input>

            <HStack space="md">
              <Button
                className="flex-1 bg-blue-500"
                onPress={handleSave}
                size="lg"
              >
                <ButtonText>Save</ButtonText>
              </Button>
              <Button
                className="flex-1 bg-gray-400"
                onPress={() => setIsEditing(false)}
                size="lg"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
            </HStack>
          </>
        ) : (
          <VStack>
            <Box className="mb-4">
              <Text className="text-3xl font-bold mb-2">{note.title}</Text>
              <Text className="text-sm text-gray-500">
                Updated: {new Date(note.updated_at).toLocaleDateString()}
              </Text>
            </Box>
            <Text className="text-sm text-gray-600 mb-4">{note.content}</Text>

            <HStack space="md">
              <Button
                className="flex-1 bg-blue-500"
                onPress={() => setIsEditing(true)}
                size="lg"
              >
                <ButtonText>Edit</ButtonText>
              </Button>
              <Button
                className="flex-1 bg-red-500"
                onPress={handleDelete}
                size="lg"
              >
                <ButtonText>Delete</ButtonText>
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </View>
  );
}
