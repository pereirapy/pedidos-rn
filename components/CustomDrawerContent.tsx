import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '~/utils/firebase';
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from '~/hooks/useAuth';
import { Image, View } from 'react-native';

export default function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleSignOut = () => {
    try {
      signOut(auth);
      router.replace('/loginPage');
    } catch (error) {}
  };

  return (
    <DrawerContentScrollView {...props}>
      {user?.photoURL && <View className='p-4'>
        <Image src={user.photoURL} style={{width: 100, height: 100, borderRadius: 50, alignSelf: 'center'}}  />
      </View>}
      <DrawerItemList {...props} />
      {user && !loading && (
        <DrawerItem
          
        labelStyle={{ marginLeft: -20 }}
          label="Logout"
          onPress={handleSignOut}
          icon={({ size, color }) => <AntDesign name="logout" size={size} color={color} />}
        />
      )}
    </DrawerContentScrollView>
  );
}
