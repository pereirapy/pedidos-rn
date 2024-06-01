import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import LayoutGeneric from '~/components/LayoutGeneric';
import { auth } from '~/utils/firebase';

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
        <AntDesign key="logout" name="logout" size={20} color="black" onPress={handleSignOut} />
      }>
      <Text>Email logged in: {auth.currentUser?.email}</Text>
    </LayoutGeneric>
  );
}
