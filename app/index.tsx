import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { listNotes, type Note } from "@/lib/notes-repository";

export default function HomeScreen() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const rows = await listNotes();
      setNotes(rows);
    } catch {
      Alert.alert("Error", "Unable to load notes.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadNotes();
    }, [loadNotes]),
  );

  const handleNotePress = (noteId: number) => {
    router.push(`/notes/${noteId}`);
  };

  const handleCreateNote = () => {
    router.push("/notes/create");
  };

  return (
    <VStack space="md" reversed={false} className="p-4">
      <Button className="bg-blue-500 mb-2" onPress={handleCreateNote} size="lg">
        <ButtonText>+ New Note</ButtonText>
      </Button>
      {isLoading ? (
        <Text className="text-sm text-gray-600">Loading notes...</Text>
      ) : notes.length === 0 ? (
        <Text className="text-sm text-gray-600">No notes yet. Create one.</Text>
      ) : (
        notes.map((note) => (
          <Pressable
            key={note.id}
            onPress={() => handleNotePress(note.id)}
            className="active:opacity-70"
          >
            <Box className="bg-gray-100 p-4 rounded-lg border border-gray-300">
              <Text className="font-bold text-lg mb-2">{note.title}</Text>
              <Text className="text-sm text-gray-600" numberOfLines={2}>
                {note.content}
              </Text>
            </Box>
          </Pressable>
        ))
      )}
    </VStack>
  );
}
