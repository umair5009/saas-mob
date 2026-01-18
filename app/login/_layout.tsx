import { Stack } from 'expo-router';

export default function LoginLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="student" />
      <Stack.Screen name="parent" />
    </Stack>
  );
}
