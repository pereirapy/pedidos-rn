import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text } from 'react-native';

import LayoutGeneric from '~/components/LayoutGeneric';
import Loading from '~/components/Loading';
import { useAuth } from '~/hooks/useAuth';
import { useRouter } from 'expo-router';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (loading) return;
    setTimeout(() => {
      if (!user) router.replace('/loginPage');
    }, 100);
  }, [loading, user]);


  if (loading) return <Loading show={loading} />;

  return (
    <LayoutGeneric title={t('dashboardPage.title')}>
      <Text>Email logged in: {user?.email}</Text>
      <Text>Name logged in: {user?.displayName}</Text>
    </LayoutGeneric>
  );
}
