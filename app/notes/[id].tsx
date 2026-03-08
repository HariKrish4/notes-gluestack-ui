import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View } from "@/components/ui/view";
import { VStack } from "@/components/ui/vstack";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { Alert } from "react-native";
import { Input, InputField } from "@/components/ui/input";
import {
  deleteNote,
  getNoteById,
  type Note,
  updateNote,
} from "@/lib/notes-repository";

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const noteId = useMemo(() => {
    if (typeof id === "string") {
      return Number(id);
    }

    if (Array.isArray(id) && id.length > 0) {
      return Number(id[0]);
    }

    return Number.NaN;
  }, [id]);

  const [note, setNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadNote = useCallback(async () => {
    if (!Number.isFinite(noteId)) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const currentNote = await getNoteById(noteId);
      setNote(currentNote);

      if (currentNote) {
        setEditedTitle(currentNote.title);
        setEditedContent(currentNote.content);
      }
    } catch {
      Alert.alert("Error", "Unable to load note.");
    } finally {
      setIsLoading(false);
    }
  }, [noteId]);

  useEffect(() => {
    void loadNote();
  }, [loadNote]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading note...</Text>
      </View>
    );
  }

  if (!note) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Note not found</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!editedTitle.trim()) {
      Alert.alert("Validation", "Please enter a note title.");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await updateNote(note.id, {
        title: editedTitle.trim(),
        content: editedContent.trim(),
      });

      if (updated) {
        setNote(updated);
      }

      setIsEditing(false);
    } catch {
      Alert.alert("Error", "Unable to update note.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteNote(note.id);
      router.back();
    } catch {
      Alert.alert("Error", "Unable to delete note.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <VStack space="md">
        {isEditing ? (
          <>
            <Box className="mb-4">
              <Text className="text-xs text-gray-500 mb-2">Title</Text>
              <Input className="border border-gray-300 rounded-lg">
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
                onPress={() => void handleSave()}
                size="lg"
                isDisabled={isSaving}
              >
                <ButtonText>{isSaving ? "Saving..." : "Save"}</ButtonText>
              </Button>
              <Button
                className="flex-1 bg-gray-400"
                onPress={() => setIsEditing(false)}
                size="lg"
                isDisabled={isSaving}
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
                onPress={() => void handleDelete()}
                size="lg"
                isDisabled={isDeleting}
              >
                <ButtonText>{isDeleting ? "Deleting..." : "Delete"}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        )}
      </VStack>
    </View>
  );
}
