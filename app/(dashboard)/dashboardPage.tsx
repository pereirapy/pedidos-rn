import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

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
    if (!user) router.push('/loginPage');
  }, [loading, user]);

  return (
    <LayoutGeneric title={t('dashboardPage.title')}>
      {loading ? (
        <Loading show={loading} />
      ) : (
        <>
          {user ? (
            <View className='px-4'>
              <Text>Email logged in: {user?.email}</Text>
              <Text>Name logged in: {user?.displayName}</Text>
            </View>
          ) : (
            <Text>No logged in</Text>
          )}
        </>
      )}
    </LayoutGeneric>
  );
}
