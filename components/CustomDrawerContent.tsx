import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '~/utils/firebase';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useAuth } from '~/hooks/useAuth';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  const handleSignOut = () => {
    try {
      signOut(auth);
      router.replace('/loginPage');
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      {user?.photoURL && (
        <View className="p-4">
          <Image
            src={user.photoURL}
            style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center' }}
          />
        </View>
      )}
      <DrawerItem
        labelStyle={{ marginLeft: -20 }}
        label={t('drawer.home')}
        onPress={() => router.replace('/index')}
        icon={({ size, color }) => <AntDesign name="home" size={size} color={color} />}
      />
      <DrawerItem
        labelStyle={{ marginLeft: -20 }}
        label={t('drawer.users')}
        onPress={() => router.push('/usersPage')}
        icon={({ size, color }) => <Feather name="users" size={size} color={color} />}
      />

      {user && !loading ? (
        <DrawerItem
          labelStyle={{ marginLeft: -20 }}
          label={t('drawer.logout')}
          onPress={handleSignOut}
          icon={({ size, color }) => <AntDesign name="logout" size={size} color={color} />}
        />
      ): (<DrawerItem
        labelStyle={{ marginLeft: -20 }}
        label={t('drawer.login')}
        onPress={() => router.replace('/loginPage')}
        icon={({ size, color }) => <AntDesign name="login" size={size} color={color} />}
      />)}
    </DrawerContentScrollView>
  );
}
