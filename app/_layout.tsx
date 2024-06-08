import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

import '../translation';

import { Drawer } from 'expo-router/drawer';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import CustomDrawerContent from '~/components/CustomDrawerContent';

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <Drawer
        drawerContent={CustomDrawerContent}
        screenOptions={{
          drawerHideStatusBarOnOpen: true,
          drawerLabelStyle: { marginLeft: -20 },
        }}
      />
    </GestureHandlerRootView>
  );
}
