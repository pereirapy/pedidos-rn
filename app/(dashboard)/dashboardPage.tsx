import { useRouter } from 'expo-router';
import { Text} from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '~/utils/firebase';
import React from 'react';
import LayoutGeneric from '~/components/LayoutGeneric';
import { useTranslation } from 'react-i18next';
import { AntDesign } from '@expo/vector-icons';

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useTranslation();

  const handleSignOut = () => {
    signOut(auth);
    router.replace('/loginPage');
  };

  return (
    <LayoutGeneric
      title={t('dashboardPage.title')}
      headerRight={
        <AntDesign name="logout" size={20} color="black" onPress={handleSignOut} />
      }>
      <Text>Email logged in: {auth.currentUser?.email}</Text>
    </LayoutGeneric>
  );
}
