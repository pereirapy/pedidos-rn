import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LayoutGeneric from '~/components/LayoutGeneric';

import Loading from '~/components/Loading';
import { useAuth } from '~/hooks/useAuth';
import { useFocus } from '~/hooks/useFocus';

export default function IndexPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t } = useTranslation();
  const { focusCount, isFocused } = useFocus();

  useEffect(() => {
    if (focusCount > 1 && isFocused) {
      if (loading) return;
      if (user) router.push('/dashboardPage');
      else router.push('/loginPage');
    }
  }, [focusCount]);

  useEffect(() => {
    if (loading) return;
    if (user) router.push('/dashboardPage');
    else router.push('/loginPage');
  }, [loading, user]);

  return (
    <LayoutGeneric title={t('indexPage.title')}>
      {loading && <Loading show={loading} />}
    </LayoutGeneric>
  );
}
