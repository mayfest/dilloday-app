import { Stack } from 'expo-router';

export default function DrawerLayout() {
  // This is a simple stack layout for the (drawer) group
  // The actual drawer navigation is handled at the root level
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name='products' />
      <Stack.Screen name='cart' />
      <Stack.Screen name='settings' />
      <Stack.Screen name='about' />
      <Stack.Screen name='index' />
      <Stack.Screen name='product/[id]' />
    </Stack>
  );
}
