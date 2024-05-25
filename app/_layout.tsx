import '../global.css';

import '../translation';

import { Stack } from 'expo-router';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'loginPage',
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(login)/loginPage" />
    </Stack>
  );
}
