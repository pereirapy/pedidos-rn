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
      <Drawer drawerContent={CustomDrawerContent} screenOptions={{
        drawerHideStatusBarOnOpen: true,
        drawerLabelStyle: {marginLeft: -20}
      }}>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ color, size }) => <AntDesign name="home" size={size} color={color} />,
          }}
        />
          <Drawer.Screen
            name="(dashboard)/dashboardPage"
            options={{
              drawerLabel: 'Dashboard',
              drawerIcon: ({ color, size }) => <AntDesign name="dashboard" size={size} color={color} />,
            }}
          />
        <Drawer.Screen
          name="(users)/usersPage"
          options={{
            drawerLabel: 'Users',
            drawerIcon: ({ color, size }) => <Feather name="users" size={size} color={color} />,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
