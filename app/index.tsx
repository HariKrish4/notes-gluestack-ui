import { View } from "@/components/ui/view";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Pressable } from "@/components/ui/pressable";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import notes from "../notes.json";

export default function HomeScreen() {
  const router = useRouter();

  const handleNotePress = (noteId: string) => {
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
      {notes.map((note) => (
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
      ))}
    </VStack>
  );
}
